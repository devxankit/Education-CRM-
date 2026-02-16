import Student from "../Models/StudentModel.js";
import Class from "../Models/ClassModel.js";
import Section from "../Models/SectionModel.js";
import Attendance from "../Models/AttendanceModel.js";
import ExamResult from "../Models/ExamResultModel.js";
import Exam from "../Models/ExamModel.js";
import FeePayment from "../Models/FeePaymentModel.js";
import FeeStructure from "../Models/FeeStructureModel.js";
import Expense from "../Models/ExpenseModel.js";
import ExpenseCategory from "../Models/ExpenseCategoryModel.js";
import Staff from "../Models/StaffModel.js";
import StaffAttendance from "../Models/StaffAttendanceModel.js";
import Department from "../Models/DepartmentModel.js";
import Payroll from "../Models/PayrollModel.js";
import SupportTicket from "../Models/SupportTicketModel.js";
import TransportRoute from "../Models/TransportRouteModel.js";
import Hostel from "../Models/HostelModel.js";
import AssetCategory from "../Models/AssetCategoryModel.js";
import AcademicYear from "../Models/AcademicYearModel.js";
import { getReportDateRange } from "../Helpers/reportDateRange.js";

const buildQuery = (instituteId, branchId) => {
    const q = { instituteId };
    if (branchId && branchId !== "all") q.branchId = branchId;
    return q;
};

// ================= ACADEMIC REPORTS =================
export const getAcademicReport = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { branchId, academicYearId, report = "attendance", classSection } = req.query;
        const query = buildQuery(instituteId, branchId);

        if (report === "attendance") {
            const ayFilter = academicYearId && academicYearId !== "all" ? { academicYearId } : {};
            const attMatch = { ...query, ...ayFilter };
            const classSectionFilter = classSection && classSection !== "ALL" ? { classId: classSection } : {};
            if (classSectionFilter.classId) attMatch.classId = classSectionFilter.classId;

            const byClass = await Attendance.aggregate([
                { $match: attMatch },
                { $unwind: "$attendanceData" },
                {
                    $group: {
                        _id: "$classId",
                        total: { $sum: 1 },
                        present: { $sum: { $cond: [{ $eq: ["$attendanceData.status", "Present"] }, 1, 0] } },
                        absent: { $sum: { $cond: [{ $eq: ["$attendanceData.status", "Absent"] }, 1, 0] } },
                        late: { $sum: { $cond: [{ $eq: ["$attendanceData.status", "Late"] }, 1, 0] } },
                    },
                },
                { $lookup: { from: "classes", localField: "_id", foreignField: "_id", as: "cls" } },
                { $unwind: { path: "$cls", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        class: { $ifNull: ["$cls.name", "Class"] },
                        total: 1,
                        present: 1,
                        absent: 1,
                        late: 1,
                        presentPct: { $cond: [{ $gt: ["$total", 0] }, { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0] }, 0] },
                        absentPct: { $cond: [{ $gt: ["$total", 0] }, { $round: [{ $multiply: [{ $divide: ["$absent", "$total"] }, 100] }, 0] }, 0] },
                    },
                },
            ]);

            const reportData = byClass.map((r) => ({
                class: r.class,
                present: `${r.presentPct}%`,
                absent: `${r.absentPct}%`,
                late: `${r.late || 0} students`,
            }));

            const chartData = byClass.map((r) => ({ name: r.class, present: r.presentPct, absent: r.absentPct }));
            const pieData = byClass.length ? [{ name: "Present", value: byClass.reduce((s, r) => s + r.present, 0) }, { name: "Absent", value: byClass.reduce((s, r) => s + r.absent, 0) }] : [];

            return res.status(200).json({
                success: true,
                data: { reportData, chartData, pieData },
            });
        }

        if (report === "exams") {
            const examMatch = { ...query };

            const bySubject = await ExamResult.aggregate([
                { $match: examMatch },
                { $unwind: "$results" },
                {
                    $group: {
                        _id: "$results.subjectId",
                        total: { $sum: 1 },
                        marksSum: { $sum: "$results.marksObtained" },
                        totalMax: { $sum: "$results.totalMarks" },
                        fail: { $sum: { $cond: [{ $eq: ["$results.status", "Fail"] }, 1, 0] } },
                    },
                },
                { $lookup: { from: "subjects", localField: "_id", foreignField: "_id", as: "subj" } },
                { $unwind: { path: "$subj", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        subject: { $ifNull: ["$subj.name", "Subject"] },
                        avg: { $cond: [{ $gt: ["$total", 0] }, { $round: [{ $multiply: [{ $divide: ["$marksSum", "$totalMax"] }, 100] }, 0] }, 0] },
                        highest: 100,
                        fail: 1,
                    },
                },
            ]);

            const reportData = bySubject.map((r) => ({
                subject: r.subject,
                avg: `${r.avg}%`,
                highest: `${r.avg}%`,
                fail: String(r.fail),
            }));

            const chartData = bySubject.map((r) => ({ name: r.subject, avg: r.avg }));
            const pieData = bySubject.length ? [{ name: "Pass", value: bySubject.reduce((s, r) => s + (r.total - r.fail), 0) }, { name: "Fail", value: bySubject.reduce((s, r) => s + r.fail, 0) }] : [];

            return res.status(200).json({
                success: true,
                data: { reportData, chartData, pieData },
            });
        }

        return res.status(200).json({ success: true, data: { reportData: [], chartData: [], pieData: [] } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= FINANCE REPORTS =================
export const getFinanceReport = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { branchId, dateRange = "this_month", report = "collection" } = req.query;
        const query = buildQuery(instituteId, branchId);
        const { start, end } = getReportDateRange(dateRange);
        const dateFilter = { $gte: start, $lte: end };

        if (report === "collection") {
            const [totalCollected, byMethod, recentPayments] = await Promise.all([
                FeePayment.aggregate([
                    { $match: { ...query, paymentDate: dateFilter, status: "Success" } },
                    { $group: { _id: null, total: { $sum: "$amountPaid" } } },
                ]),
                FeePayment.aggregate([
                    { $match: { ...query, paymentDate: dateFilter, status: "Success" } },
                    { $group: { _id: "$paymentMethod", total: { $sum: "$amountPaid" }, count: { $sum: 1 } } },
                ]),
                FeePayment.find({ ...query, paymentDate: dateFilter, status: "Success" })
                    .populate("studentId", "firstName lastName admissionNo")
                    .sort({ paymentDate: -1 })
                    .limit(20)
                    .lean(),
            ]);

            const total = totalCollected[0]?.total || 0;
            const totalCount = byMethod.reduce((s, m) => s + m.count, 0);
            const modeDist = byMethod.map((m) => ({
                name: m._id || "Other",
                value: total > 0 ? Math.round((m.total / total) * 100) : 0,
                amount: m.total,
                count: m.count,
            }));

            const weeklyBuckets = [];
            const step = (end - start) / 4;
            for (let i = 0; i < 4; i++) {
                const wStart = new Date(start.getTime() + i * step);
                const wEnd = new Date(start.getTime() + (i + 1) * step);
                weeklyBuckets.push({ name: `Week ${i + 1}`, start: wStart, end: wEnd });
            }
            const trendRaw = await FeePayment.aggregate([
                { $match: { ...query, paymentDate: dateFilter, status: "Success" } },
                {
                    $group: {
                        _id: {
                            $switch: {
                                branches: [
                                    { case: { $lt: ["$paymentDate", weeklyBuckets[1].start] }, then: 0 },
                                    { case: { $lt: ["$paymentDate", weeklyBuckets[2].start] }, then: 1 },
                                    { case: { $lt: ["$paymentDate", weeklyBuckets[3].start] }, then: 2 },
                                    { case: true, then: 3 },
                                ],
                                default: 0,
                            },
                        },
                        cash: { $sum: { $cond: [{ $eq: ["$paymentMethod", "Cash"] }, "$amountPaid", 0] } },
                        online: { $sum: { $cond: [{ $in: ["$paymentMethod", ["Online", "Bank Transfer"]] }, "$amountPaid", 0] } },
                        other: { $sum: { $cond: [{ $nin: ["$paymentMethod", ["Cash", "Online", "Bank Transfer"]] }, "$amountPaid", 0] } },
                    },
                },
            ]);
            const monthlyTrend = weeklyBuckets.map((w, i) => {
                const r = trendRaw.find((x) => x._id === i);
                return { name: w.name, cash: r?.cash || 0, online: r?.online || 0 };
            });

            return res.status(200).json({
                success: true,
                data: {
                    totalCollected: total,
                    totalTransactions: totalCount,
                    modeDist,
                    monthlyTrend,
                    recentPayments: (recentPayments || []).map((p) => ({
                        id: p._id,
                        student: p.studentId ? [p.studentId.firstName, p.studentId.lastName].filter(Boolean).join(" ") : "—",
                        amount: p.amountPaid,
                        method: p.paymentMethod,
                        date: p.paymentDate,
                    })),
                },
            });
        }

        if (report === "dues") {
            const students = await Student.find({ ...query, status: "active" }).select("classId admissionNo firstName lastName").lean();
            const structs = await FeeStructure.find({ instituteId, status: "active" }).lean();
            const paidAgg = await FeePayment.aggregate([
                { $match: { instituteId, status: "Success" } },
                { $group: { _id: "$studentId", total: { $sum: "$amountPaid" } } },
            ]);
            const paidMap = new Map(paidAgg.map((p) => [p._id.toString(), p.total]));
            const defaulters = [];
            for (const s of students) {
                const fs = structs.find((f) => !f.applicableClasses?.length || f.applicableClasses.some((c) => c.toString() === (s.classId || "").toString()));
                const expected = fs?.totalAmount || 0;
                const paid = paidMap.get(s._id.toString()) || 0;
                const due = expected - paid;
                if (due > 0) defaulters.push({ studentId: s._id, name: [s.firstName, s.lastName].filter(Boolean).join(" "), admissionNo: s.admissionNo, expected, paid, due });
            }
            const totalDues = defaulters.reduce((s, d) => s + d.due, 0);
            return res.status(200).json({
                success: true,
                data: { defaulters, totalDues, count: defaulters.length },
            });
        }

        if (report === "expenses") {
            const [totalExpense, byCategory] = await Promise.all([
                Expense.aggregate([
                    { $match: { ...query, expenseDate: dateFilter } },
                    { $group: { _id: null, total: { $sum: "$amount" } } },
                ]),
                Expense.aggregate([
                    { $match: { ...query, expenseDate: dateFilter } },
                    { $group: { _id: "$categoryId", total: { $sum: "$amount" } } },
                    { $lookup: { from: "expensecategories", localField: "_id", foreignField: "_id", as: "cat" } },
                    { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
                    { $project: { name: { $ifNull: ["$cat.name", "Uncategorized"] }, total: 1 } },
                ]),
            ]);
            const total = totalExpense[0]?.total || 0;
            const expenseBreakdown = byCategory.map((c) => ({ name: c.name, total: c.total, value: total > 0 ? Math.round((c.total / total) * 100) : 0 }));
            const recentExpenses = await Expense.find({ ...query, expenseDate: dateFilter })
                .populate("categoryId", "name")
                .sort({ expenseDate: -1 })
                .limit(15)
                .lean();
            return res.status(200).json({
                success: true,
                data: { totalExpense: total, expenseBreakdown, recentExpenses },
            });
        }

        if (report === "dcr") {
            const daily = await FeePayment.aggregate([
                { $match: { ...query, paymentDate: dateFilter, status: "Success" } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } }, total: { $sum: "$amountPaid" }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]);
            return res.status(200).json({
                success: true,
                data: { dailyCollection: daily.map((d) => ({ date: d._id, total: d.total, count: d.count })) },
            });
        }

        return res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= HR REPORTS =================
export const getHRReport = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { branchId, dateRange = "this_month", report = "attendance" } = req.query;
        const query = buildQuery(instituteId, branchId);
        const { start, end } = getReportDateRange(dateRange);
        const dateFilter = { $gte: start, $lte: end };

        if (report === "attendance") {
            const [byDay, byDept, chronic] = await Promise.all([
                StaffAttendance.aggregate([
                    { $match: { ...query, date: dateFilter } },
                    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } }, absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } } } },
                    { $sort: { _id: 1 } },
                ]),
                StaffAttendance.aggregate([
                    { $match: { ...query, date: dateFilter } },
                    { $lookup: { from: "staff", localField: "staffId", foreignField: "_id", as: "st" } },
                    { $unwind: { path: "$st", preserveNullAndEmptyArrays: true } },
                    { $lookup: { from: "departments", localField: "st.departmentId", foreignField: "_id", as: "dept" } },
                    { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
                    { $group: { _id: "$dept.name", present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } }, total: { $sum: 1 } } },
                    { $project: { name: { $ifNull: ["$_id", "Other"] }, value: { $cond: [{ $gt: ["$total", 0] }, { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0] }, 0] } } },
                ]),
                StaffAttendance.aggregate([
                    { $match: { ...query, date: dateFilter, status: "Absent" } },
                    { $group: { _id: "$staffId", absentDays: { $sum: 1 } } },
                    { $match: { absentDays: { $gte: 2 } } },
                    { $lookup: { from: "staff", localField: "_id", foreignField: "_id", as: "st" } },
                    { $unwind: "$st" },
                    { $lookup: { from: "departments", localField: "st.departmentId", foreignField: "_id", as: "dept" } },
                    { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
                    { $project: { name: { $concat: ["$st.firstName", " ", "$st.lastName"] }, dept: { $ifNull: ["$dept.name", "—"] }, absentDays: 1, risk: { $cond: [{ $gte: ["$absentDays", 5] }, "High", "Medium"] } } },
                ]),
            ]);

            const trendData = byDay.map((d) => ({ name: d._id, present: d.present, absent: d.absent }));
            const deptAttendance = byDept.map((d) => ({ name: d.name, value: d.value }));
            const chronicAbsentees = chronic.map((c, i) => ({ id: i + 1, name: c.name, dept: c.dept, absentDays: c.absentDays, risk: c.risk }));
            const totalPresent = byDay.reduce((s, d) => s + d.present, 0);
            const totalAbsent = byDay.reduce((s, d) => s + d.absent, 0);
            const totalDays = totalPresent + totalAbsent;
            const avgAttendance = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;

            return res.status(200).json({
                success: true,
                data: { trendData, deptAttendance, chronicAbsentees, avgAttendance, totalPresent, totalAbsent },
            });
        }

        if (report === "strength") {
            const byDept = await Staff.aggregate([
                { $match: query },
                { $group: { _id: "$departmentId", count: { $sum: 1 } } },
                { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept" } },
                { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
                { $project: { name: { $ifNull: ["$dept.name", "Unassigned"] }, value: "$count" } },
            ]);
            const total = await Staff.countDocuments(query);
            return res.status(200).json({
                success: true,
                data: { byDepartment: byDept, totalStaff: total },
            });
        }

        if (report === "payroll") {
            const payrollMatch = { ...query };
            const payPeriod = await Payroll.findOne(payrollMatch).sort({ month: -1 }).lean();
            const byMonth = await Payroll.aggregate([
                { $match: query },
                { $group: { _id: "$month", total: { $sum: "$netSalary" }, count: { $sum: 1 } } },
                { $sort: { _id: -1 } },
                { $limit: 6 },
            ]);
            return res.status(200).json({
                success: true,
                data: { latestMonth: payPeriod, byMonth },
            });
        }

        if (report === "turnover") {
            const joiners = await Staff.countDocuments({ ...query, createdAt: dateFilter });
            const exits = await Staff.countDocuments({ ...query, status: "inactive", updatedAt: dateFilter });
            return res.status(200).json({
                success: true,
                data: { joiners, exits },
            });
        }

        return res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= OPERATIONS REPORTS =================
export const getOperationsReport = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { branchId, dateRange = "this_month", report = "transport" } = req.query;
        const query = buildQuery(instituteId, branchId);
        const { start, end } = getReportDateRange(dateRange);
        const dateFilter = { $gte: start, $lte: end };

        if (report === "transport") {
            const routes = await TransportRoute.find(query).lean();
            const total = routes.length;
            const active = routes.filter((r) => r.status !== "Inactive").length;
            return res.status(200).json({
                success: true,
                data: { totalBuses: total, activeBuses: active, routes: routes.slice(0, 20) },
            });
        }

        if (report === "support") {
            const [openTickets, closedInPeriod, byCategory, slaBreached] = await Promise.all([
                SupportTicket.countDocuments({ instituteId, status: { $in: ["Open", "In-Progress"] } }),
                SupportTicket.countDocuments({ instituteId, status: { $in: ["Resolved", "Closed"] }, updatedAt: dateFilter }),
                SupportTicket.aggregate([{ $match: { instituteId } }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
                SupportTicket.countDocuments({ instituteId, status: { $in: ["Open", "In-Progress"] }, priority: "Urgent" }),
            ]);
            const ticketCategories = (byCategory || []).map((c) => ({ label: c._id || "Other", count: c.count }));
            return res.status(200).json({
                success: true,
                data: { openTickets, closedToday: closedInPeriod, slaBreached, ticketCategories },
            });
        }

        if (report === "hostel") {
            const hostels = await Hostel.find(query).lean();
            let totalCapacity = 0;
            let occupied = 0;
            hostels.forEach((h) => {
                (h.rooms || []).forEach((r) => {
                    totalCapacity += r.capacity || 0;
                    if (r.status === "Occupied") occupied += r.capacity || 0;
                });
            });
            return res.status(200).json({
                success: true,
                data: { hostels, totalCapacity, occupied, vacancy: totalCapacity - occupied },
            });
        }

        if (report === "assets") {
            const categories = await AssetCategory.find(query).lean();
            return res.status(200).json({
                success: true,
                data: { categories, totalCategories: categories.length },
            });
        }

        return res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
