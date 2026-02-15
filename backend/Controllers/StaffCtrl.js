import Staff from "../Models/StaffModel.js";
import AccessControl from "../Models/AccessControlModel.js";
import Student from "../Models/StudentModel.js";
import SupportTicket from "../Models/SupportTicketModel.js";
import FeePayment from "../Models/FeePaymentModel.js";
import FeeStructure from "../Models/FeeStructureModel.js";
import TransportRoute from "../Models/TransportRouteModel.js";
import Branch from "../Models/BranchModel.js";
import Teacher from "../Models/TeacherModel.js";
import Payroll from "../Models/PayrollModel.js";
import Expense from "../Models/ExpenseModel.js";
import AcademicYear from "../Models/AcademicYearModel.js";
import PayrollRule from "../Models/PayrollRuleModel.js";
import ExpenseCategory from "../Models/ExpenseCategoryModel.js";
import Tax from "../Models/TaxModel.js";
import { generateToken, generateTempOtpToken, verifyTempOtpToken } from "../Helpers/generateToken.js";
import { logSecurity, logUserActivity } from "../Helpers/logger.js";
import { calculateTaxFromRules } from "../Helpers/calculateTax.js";
import { generateRandomPassword } from "../Helpers/generateRandomPassword.js";
import { sendLoginCredentialsEmail, sendStaffOtpEmail } from "../Helpers/SendMail.js";
import OtpVerification from "../Models/OtpVerificationModel.js";
import { uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";

// ================= STAFF DASHBOARD (DYNAMIC) =================
export const getStaffDashboard = async (req, res) => {
    try {
        const staffId = req.user._id;
        const instituteId = req.user.instituteId || staffId;
        const staff = await Staff.findById(staffId).populate('roleId');

        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff user not found" });
        }

        const roleCode = staff.roleId?.code || "";
        const branchId = staff.branchId; // "all" or specific ObjectId

        const queryScope = { instituteId };
        if (branchId && branchId !== "all") {
            queryScope.branchId = branchId;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisMonth = today.getMonth() + 1;
        const thisYear = today.getFullYear();
        const payrollQuery = { instituteId, month: thisMonth, year: thisYear };
        if (branchId && branchId !== "all") payrollQuery.branchId = branchId;
        const expenseQuery = { instituteId };
        if (branchId && branchId !== "all") expenseQuery.branchId = branchId;

        const stats = {
            TotalAdmissions: 0,
            PendingAdmissions: 0,
            TodayAdmissions: 0,
            PendingDocuments: 0,
            VisitorRequests: 0,
            PendingFees: 0,
            OverdueFees: 0,
            TodayCollections: "₹0",
            ActiveRoutes: 0,
            BusAllocationIssues: 0,
            DriverStatus: "0/0",
            OpenTickets: 0,
            SlaBreachAlerts: 0,
            HighPriorityTickets: 0,
            IncompleteProfiles: 0,
            PendingVerifications: 0,
            MissingEmployeeRecords: 0,
            TeacherStatus: "Active",
            MyClasses: 0,
            TodayAttendance: "0%",
            PendingAssignments: 0,
            PendingPayroll: 0,
            UnpaidExpenses: 0,
            SystemHealth: "OK",
            AllStaffOverview: 0
        };

        // 1. ADMISSION STATS (For Admission Officer, Front Desk, Principal)
        if (roleCode.includes('ADMISSION') || roleCode.includes('FRONT_DESK') || roleCode.includes('PRINCIPAL')) {
            // Total Admissions - All time for this institute/branch
            stats.TotalAdmissions = await Student.countDocuments(queryScope);

            // Pending Admissions - Added by staff but not verified (status is in_review)
            stats.PendingAdmissions = await Student.countDocuments({
                ...queryScope,
                status: 'in_review'
            });

            stats.TodayAdmissions = await Student.countDocuments({
                ...queryScope,
                createdAt: { $gte: today }
            });

            // Count students who have AT LEAST ONE document pending
            stats.PendingDocuments = await Student.countDocuments({
                ...queryScope,
                $or: [
                    { "documents.photo.status": "in_review" },
                    { "documents.birthCert.status": "in_review" },
                    { "documents.transferCert.status": "in_review" },
                    { "documents.aadhar.status": "in_review" },
                    { "documents.prevMarksheet.status": "in_review" }
                ]
            });
            stats.VisitorRequests = 0;
        }

        // 2. ACCOUNTS STATS (For Accounts Officer, Principal)
        if (roleCode.includes('ACCOUNTS') || roleCode.includes('PRINCIPAL')) {
            const collections = await FeePayment.aggregate([
                { $match: { instituteId, paymentDate: { $gte: today }, status: 'Success' } },
                { $group: { _id: null, total: { $sum: "$amountPaid" } } }
            ]);
            const total = collections[0]?.total || 0;
            stats.TodayCollections = total >= 1000 ? `₹${(total / 1000).toFixed(1)}k` : `₹${total}`;

            stats.PendingFees = await Student.countDocuments({ ...queryScope, status: 'active' });
            stats.OverdueFees = await Student.countDocuments({ ...queryScope, status: 'active' });

            stats.PendingPayroll = await Payroll.countDocuments({
                ...payrollQuery,
                status: { $in: ['draft', 'approved'] }
            });
            stats.UnpaidExpenses = await Expense.countDocuments({
                ...expenseQuery,
                status: 'Pending'
            });
        }

        // 3. SUPPORT STATS (For Support Staff, Front Desk)
        if (roleCode.includes('SUPPORT') || roleCode.includes('FRONT_DESK')) {
            stats.OpenTickets = await SupportTicket.countDocuments({
                ...queryScope,
                status: 'Open'
            });
            stats.HighPriorityTickets = await SupportTicket.countDocuments({
                ...queryScope,
                status: 'Open',
                priority: 'High'
            });
            stats.SlaBreachAlerts = await SupportTicket.countDocuments({
                ...queryScope,
                status: 'Open',
                priority: 'Urgent'
            });
        }

        // 4. TRANSPORT STATS (For Transport Manager)
        if (roleCode.includes('TRANSPORT') || roleCode.includes('TRASPORT')) {
            stats.ActiveRoutes = await TransportRoute.countDocuments({ ...queryScope, isActive: true });
            stats.BusAllocationIssues = 0;
            stats.DriverStatus = "Active";
        }

        // 5. DATA ENTRY STATS
        if (roleCode.includes('DATA_ENTRY')) {
            stats.IncompleteProfiles = await Student.countDocuments({
                ...queryScope,
                $or: [{ dob: { $exists: false } }, { gender: { $exists: false } }]
            });
            stats.PendingVerifications = await Student.countDocuments({
                ...queryScope,
                "documents.photo.status": "in_review"
            });
        }

        // 6. ADMIN STATS (Admin/Principal overview)
        if (['ADMIN', 'ROLE_SUPER_ADMIN', 'SUPER_ADMIN'].includes(roleCode)) {
            stats.TotalAdmissions = await Student.countDocuments(queryScope);
            stats.AllStaffOverview = await Staff.countDocuments({ instituteId });
            stats.SystemHealth = "OK";
        }

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STAFF REPORTS =================
const getDateRange = (range) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    let start, end;
    switch (range) {
        case 'Last Month':
            start = new Date(year, month - 1, 1);
            end = new Date(year, month, 0, 23, 59, 59);
            break;
        case 'This Quarter':
            const q = Math.floor(month / 3) + 1;
            start = new Date(year, (q - 1) * 3, 1);
            end = new Date(year, q * 3, 0, 23, 59, 59);
            break;
        case 'This Year':
            start = new Date(year, 0, 1);
            end = new Date(year, 11, 31, 23, 59, 59);
            break;
        default: // This Month
            start = new Date(year, month, 1);
            end = new Date(year, month + 1, 0, 23, 59, 59);
    }
    return { start, end };
};

export const getStaffReports = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;
        const { dateRange = 'This Month' } = req.query;

        const queryScope = { instituteId };
        if (branchId && branchId !== "all") queryScope.branchId = branchId;

        const { start, end } = getDateRange(dateRange);
        const dateFilter = { $gte: start, $lte: end };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            incomeResult,
            expenseResult,
            expensesByCategory,
            pendingFeesApprox,
            recentPayments,
            recentExpenses,
            totalStudents,
            newAdmissions,
            transportStats,
            openTickets,
            closedToday,
            slaBreached,
            ticketsByCategory
        ] = await Promise.all([
            FeePayment.aggregate([
                { $match: { ...queryScope, paymentDate: dateFilter, status: 'Success' } },
                { $group: { _id: null, total: { $sum: '$amountPaid' } } }
            ]),
            Expense.aggregate([
                { $match: { ...queryScope, expenseDate: dateFilter } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Expense.aggregate([
                { $match: { ...queryScope, expenseDate: dateFilter } },
                { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
                { $lookup: { from: 'expensecategories', localField: '_id', foreignField: '_id', as: 'cat' } },
                { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
                { $project: { name: { $ifNull: ['$cat.name', 'Uncategorized'] }, total: 1 } }
            ]),
            (async () => {
                const students = await Student.find({ ...queryScope, status: 'active' }).select('classId').lean();
                const structs = await FeeStructure.find({ instituteId, status: 'active' }).lean();
                const paidAgg = await FeePayment.aggregate([
                    { $match: { instituteId, status: 'Success' } },
                    { $group: { _id: '$studentId', total: { $sum: '$amountPaid' } } }
                ]);
                const paidMap = new Map(paidAgg.map(p => [p._id.toString(), p.total]));
                let totalExpected = 0, totalPaid = 0;
                for (const s of students) {
                    const fs = structs.find(f => !f.applicableClasses?.length || f.applicableClasses.some(c => c.toString() === (s.classId || '').toString()));
                    totalExpected += fs?.totalAmount || 0;
                    totalPaid += paidMap.get(s._id.toString()) || 0;
                }
                return Math.max(0, totalExpected - totalPaid);
            })(),
            FeePayment.find({ ...queryScope, paymentDate: dateFilter, status: 'Success' })
                .populate('studentId', 'firstName lastName admissionNo')
                .sort({ paymentDate: -1 }).limit(10).lean(),
            Expense.find({ ...queryScope, expenseDate: dateFilter })
                .populate('categoryId', 'name')
                .sort({ expenseDate: -1 }).limit(10).lean(),
            Student.countDocuments({ ...queryScope }),
            Student.countDocuments({ ...queryScope, createdAt: dateFilter }),
            TransportRoute.aggregate([
                { $match: queryScope },
                { $group: { _id: null, total: { $sum: 1 }, active: { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } } } }
            ]),
            SupportTicket.countDocuments({ instituteId, status: { $in: ['Open', 'In-Progress'] } }),
            SupportTicket.countDocuments({ instituteId, status: { $in: ['Resolved', 'Closed'] }, updatedAt: { $gte: today } }),
            SupportTicket.countDocuments({ instituteId, status: { $in: ['Open', 'In-Progress'] }, priority: 'Urgent' }),
            SupportTicket.aggregate([
                { $match: { instituteId } },
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ])
        ]);

        const totalIncome = incomeResult[0]?.total || 0;
        const totalExpense = expenseResult[0]?.total || 0;
        const transport = transportStats[0] || { total: 0, active: 0 };

        const expenseBreakdown = expensesByCategory.map(e => ({
            label: e.name || 'Other',
            total: e.total,
            value: totalExpense > 0 ? Math.round((e.total / totalExpense) * 100) : 0
        }));

        const ticketCategories = ticketsByCategory.map(t => ({
            label: t._id || 'Other',
            count: t.count,
            value: 0
        }));
        const totalTickets = ticketCategories.reduce((s, t) => s + t.count, 0);
        ticketCategories.forEach(t => {
            t.value = totalTickets > 0 ? Math.round((t.count / totalTickets) * 100) : 0;
        });

        const recentTransactions = [];
        (recentPayments || []).forEach(p => {
            const name = p.studentId ? [p.studentId.firstName, p.studentId.lastName].filter(Boolean).join(' ') : 'Student';
            recentTransactions.push({
                to: `Fee: ${name}`,
                cat: 'Income',
                date: p.paymentDate,
                amount: p.amountPaid,
                type: 'credit'
            });
        });
        (recentExpenses || []).forEach(e => {
            recentTransactions.push({
                to: e.title || 'Expense',
                cat: 'Expense',
                date: e.expenseDate,
                amount: e.amount,
                type: 'debit'
            });
        });
        recentTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        recentTransactions.splice(5);

        res.status(200).json({
            success: true,
            data: {
                finance: {
                    totalIncome,
                    totalExpense,
                    netSurplus: totalIncome - totalExpense,
                    pendingFees: pendingFeesApprox,
                    expenseBreakdown,
                    recentTransactions
                },
                academic: {
                    totalStudents,
                    newAdmissions
                },
                operations: {
                    activeBuses: transport.active,
                    totalBuses: transport.total
                },
                support: {
                    openTickets,
                    closedToday,
                    slaBreached,
                    ticketCategories
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STAFF FEE OVERVIEW =================
export const getStaffFeeOverview = async (req, res) => {
    try {
        const staffId = req.user._id;
        const instituteId = req.user.instituteId || staffId;
        const branchId = req.user.branchId;

        const queryScope = { instituteId, status: 'active' };
        if (branchId && branchId !== "all") {
            queryScope.branchId = branchId;
        }

        const students = await Student.find(queryScope)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .sort({ firstName: 1 });

        const studentIds = students.map(s => s._id);

        const paymentsByStudent = await FeePayment.aggregate([
            { $match: { studentId: { $in: studentIds }, status: 'Success' } },
            { $group: { _id: '$studentId', totalPaid: { $sum: '$amountPaid' } } }
        ]);
        const paymentMap = new Map(paymentsByStudent.map(p => [p._id.toString(), p.totalPaid]));

        const feeStructures = await FeeStructure.find({
            instituteId,
            status: 'active'
        }).lean();

        const seen = new Set();
        const branchIds = [];
        students.forEach(s => {
            const bid = s.branchId?.toString();
            if (bid && !seen.has(bid)) {
                seen.add(bid);
                branchIds.push(s.branchId);
            }
        });
        const taxesByBranch = {};
        if (branchIds.length > 0) {
            const allTaxes = await Tax.find({ branchId: { $in: branchIds }, isActive: true }).lean();
            allTaxes.forEach(t => {
                const bid = t.branchId?.toString();
                if (!taxesByBranch[bid]) taxesByBranch[bid] = [];
                taxesByBranch[bid].push(t);
            });
        }

        const studentsWithFees = students.map(student => {
            const feeStructure = feeStructures.find(fs =>
                !fs.applicableClasses?.length || fs.applicableClasses.some(c => c.toString() === (student.classId?._id || student.classId)?.toString())
            );
            const baseAmount = feeStructure?.totalAmount || 0;
            const branchId = (feeStructure?.branchId || student.branchId)?.toString();
            const taxes = taxesByBranch[branchId] || [];
            const { totalTax } = calculateTaxFromRules(baseAmount, taxes, 'fees');
            const totalFee = baseAmount + totalTax;
            const totalPaid = paymentMap.get(student._id.toString()) || 0;
            const pending = Math.max(0, totalFee - totalPaid);

            let feeStatus = 'Due';
            if (pending <= 0 && totalFee > 0) feeStatus = 'Paid';
            else if (totalPaid > 0) feeStatus = 'Partial';

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let hasOverdueInstallment = false;
            const installments = (feeStructure?.installments || []).map((inst, i) => {
                const prevSum = (feeStructure.installments || []).slice(0, i).reduce((s, x) => s + (x.amount || 0), 0);
                const cumulThreshold = prevSum + (inst.amount || 0);
                const isPaid = totalPaid >= cumulThreshold;
                const dueDate = inst.dueDate ? new Date(inst.dueDate) : null;
                const status = isPaid ? 'Paid' : (dueDate && dueDate < today ? 'Overdue' : 'Due');
                if (status === 'Overdue') hasOverdueInstallment = true;
                return {
                    id: inst._id,
                    title: inst.name,
                    dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
                    amount: inst.amount || 0,
                    status
                };
            });
            if (hasOverdueInstallment && feeStatus === 'Partial') feeStatus = 'Overdue';
            else if (hasOverdueInstallment && feeStatus === 'Due') feeStatus = 'Overdue';

            const fullName = [student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ');
            const className = student.classId?.name || 'N/A';
            const sectionName = student.sectionId?.name || '';

            return {
                _id: student._id,
                id: student._id,
                name: fullName,
                admissionNo: student.admissionNo,
                class: className + (sectionName ? ` - ${sectionName}` : ''),
                classId: student.classId,
                sectionId: student.sectionId,
                feeStructureId: feeStructure?._id,
                feeStatus,
                fees: { total: totalFee, paid: totalPaid, pending },
                installments
            };
        });

        const paidCount = studentsWithFees.filter(s => s.feeStatus === 'Paid').length;
        const dueCount = studentsWithFees.filter(s => s.feeStatus === 'Due').length;
        const overdueCount = studentsWithFees.filter(s => s.feeStatus === 'Overdue').length;
        const partialCount = studentsWithFees.filter(s => s.feeStatus === 'Partial').length;
        const totalPending = studentsWithFees.reduce((sum, s) => sum + (s.fees?.pending || 0), 0);
        const totalCollected = studentsWithFees.reduce((sum, s) => sum + (s.fees?.paid || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                students: studentsWithFees,
                summary: {
                    total: studentsWithFees.length,
                    paid: paidCount,
                    due: dueCount,
                    overdue: overdueCount,
                    partial: partialCount,
                    totalPending,
                    totalCollected
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= STAFF RECORD FEE PAYMENT (Offline - No Gateway) =================
export const recordStaffFeePayment = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { studentId, feeStructureId, amount, paymentMethod = 'Cash', remarks } = req.body;

        if (!studentId || !feeStructureId || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "studentId, feeStructureId and amount are required" });
        }

        const student = await Student.findById(studentId);
        if (!student || student.instituteId?.toString() !== instituteId?.toString()) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const feeStructure = await FeeStructure.findById(feeStructureId);
        if (!feeStructure || feeStructure.instituteId?.toString() !== instituteId?.toString()) {
            return res.status(404).json({ success: false, message: "Fee structure not found" });
        }

        const payment = new FeePayment({
            instituteId: student.instituteId,
            branchId: student.branchId,
            studentId,
            academicYearId: feeStructure.academicYearId,
            feeStructureId,
            amountPaid: Number(amount),
            paymentMethod: paymentMethod || 'Cash',
            paymentDate: new Date(),
            status: 'Success',
            receiptNo: `REC-${Date.now()}-${studentId.toString().slice(-4)}`,
            remarks: remarks || ''
        });

        await payment.save();

        res.status(200).json({
            success: true,
            message: "Payment recorded successfully",
            data: { payment, receiptNo: payment.receiptNo }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STAFF PAYROLL RESOURCES =================
export const getStaffPayrollResources = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const staffBranchId = req.user.branchId;

        const { financialYear } = req.query;
        const ruleQuery = { instituteId };
        if (financialYear) ruleQuery.financialYear = financialYear;

        const [branches, teachers, staffList, academicYears, payrollRule] = await Promise.all([
            Branch.find({ instituteId }).select('name code').lean(),
            Teacher.find({ instituteId }).populate('department', 'name').select('firstName lastName name email employeeId').lean(),
            Staff.find({ instituteId, status: 'active' }).populate('roleId', 'name').select('name email').lean(),
            AcademicYear.find({ instituteId }).select('name status').sort({ startDate: -1 }).lean(),
            PayrollRule.findOne(ruleQuery).lean()
        ]);

        const defaultBranch = staffBranchId && staffBranchId !== "all" ? branches.find(b => b._id.toString() === staffBranchId.toString()) : branches[0];
        const activeYear = academicYears.find(ay => ay.status === 'active') || academicYears[0];

        res.status(200).json({
            success: true,
            data: {
                branches,
                teachers,
                staff: staffList,
                academicYears,
                payrollRule: payrollRule || null,
                defaultBranchId: defaultBranch?._id,
                defaultFinancialYear: activeYear?.name || '2025-26'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STAFF BRANCHES (for dropdowns e.g. attendance) =================
export const getStaffBranches = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const staffBranchId = req.user.branchId;
        const branches = await Branch.find({ instituteId }).select('name code').sort({ name: 1 }).lean();
        const defaultBranchId = staffBranchId && String(staffBranchId) !== "all"
            ? branches.find(b => b._id.toString() === String(staffBranchId))?._id
            : branches[0]?._id;
        res.status(200).json({
            success: true,
            data: { branches, defaultBranchId }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STAFF EXPENSE RESOURCES =================
export const getStaffExpenseResources = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const staffBranchId = req.user.branchId;

        const [branches, categories] = await Promise.all([
            Branch.find({ instituteId }).select('name code').lean(),
            ExpenseCategory.find({ instituteId, isActive: true }).select('name code').sort({ name: 1 }).lean()
        ]);

        const defaultBranchId = staffBranchId && staffBranchId !== "all"
            ? branches.find(b => b._id.toString() === staffBranchId.toString())?._id
            : branches[0]?._id;

        res.status(200).json({
            success: true,
            data: { branches, categories, defaultBranchId }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CREATE STAFF USER =================
export const createStaff = async (req, res) => {
    try {
        const { name, email, roleId, branchId, phone } = req.body;
        const instituteId = req.user._id;

        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({
                success: false,
                message: "Staff user with this email already exists",
            });
        }

        // Generate Random Password
        const generatedPassword = "123456"
        // const generatedPassword = generateRandomPassword();

        const staff = new Staff({
            instituteId,
            name,
            email,
            password: generatedPassword,
            roleId,
            branchId: branchId === 'all' ? null : branchId,
            phone
        });

        await staff.save();

        // Send Email with credentials
        // Use a background process or don't await if you don't want to block the response
        // but for now we'll just fire and forget or simple await
        sendLoginCredentialsEmail(email, generatedPassword, name, "Staff");

        res.status(201).json({
            success: true,
            message: "Staff user created successfully and credentials sent to email",
            data: {
                _id: staff._id,
                name: staff.name,
                email: staff.email,
                roleId: staff.roleId
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL STAFF =================
export const getStaffList = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const staff = await Staff.find({ instituteId })
            .populate('roleId', 'name code')
            .populate('branchId', 'name');

        res.status(200).json({
            success: true,
            data: staff,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE STAFF =================
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent direct password update through this route
        delete updateData.password;

        const staff = await Staff.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('roleId', 'name code');

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff user not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Staff user updated successfully",
            data: staff,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= DELETE STAFF =================
export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await Staff.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Staff user deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= STAFF VERIFY OTP (2FA) =================
export const verifyOtpStaff = async (req, res) => {
    try {
        const { tempToken, otp, role } = req.body;

        if (!tempToken || !otp) {
            return res.status(400).json({
                success: false,
                message: "Temp token and OTP are required"
            });
        }

        const staffId = verifyTempOtpToken(tempToken);
        if (!staffId) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired verification. Please login again."
            });
        }

        const otpRecord = await OtpVerification.findOne({
            staffId,
            otp: String(otp).trim()
        });

        if (!otpRecord) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP. Please check and try again."
            });
        }

        if (new Date() > otpRecord.expiresAt) {
            await OtpVerification.deleteOne({ _id: otpRecord._id });
            return res.status(401).json({
                success: false,
                message: "OTP has expired. Please login again to get a new one."
            });
        }

        await OtpVerification.deleteOne({ _id: otpRecord._id });

        const staff = await Staff.findById(staffId).populate('roleId');
        if (!staff || staff.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: "Account not found or inactive."
            });
        }

        if (role) {
            const assignedRoleCode = staff.roleId?.code || '';
            if (!assignedRoleCode.toUpperCase().includes(role.toUpperCase())) {
                return res.status(403).json({
                    success: false,
                    message: `Access Denied: You are not authorized to login as ${role}.`
                });
            }
        }

        let policies = await AccessControl.findOne({ instituteId: staff.instituteId }).lean();
        const sessionMinutes = policies ? (Number(policies.sessionTimeout) || 30) : 30;
        const token = generateToken(staff._id, "Staff", `${sessionMinutes}m`);

        staff.lastLogin = new Date();
        await staff.save();

        logSecurity(req, { instituteId: staff.instituteId, userId: staff._id, userModel: "Staff", identifier: staff.email, action: "2fa_success", success: true, message: "2FA verified, login successful" });
        logUserActivity(req, { instituteId: staff.instituteId, branchId: staff.branchId, userId: staff._id, userModel: "Staff", userEmail: staff.email, userName: staff.name, action: "login", description: "Staff login (after 2FA)" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: staff,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= STAFF LOGIN =================
export const loginStaff = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const staff = await Staff.findOne({ email }).populate('roleId');
        if (!staff) {
            logSecurity(req, { identifier: email, action: "login_failed", success: false, message: "Staff user not found" });
            return res.status(404).json({
                success: false,
                message: "Staff user not found",
            });
        }

        if (staff.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Your account is ${staff.status}. Please contact administrator.`
            });
        }

        // Fetch institute Access Control policies
        let policies = await AccessControl.findOne({ instituteId: staff.instituteId }).lean();
        if (!policies) {
            policies = { force2FA: false, sessionTimeout: 30, maxLoginAttempts: 5, lockoutMinutes: 15, ipWhitelistEnabled: false, ipWhitelist: [], passwordExpiryDays: 90 };
        }

        // 1. Check if account is locked (max failed attempts)
        if (staff.lockUntil && staff.lockUntil > new Date()) {
            const lockMinutes = Math.ceil((staff.lockUntil - new Date()) / 60000);
            return res.status(423).json({
                success: false,
                message: `Account temporarily locked due to too many failed attempts. Try again in ${lockMinutes} minutes.`,
                lockedUntil: staff.lockUntil
            });
        }
        if (staff.lockUntil && staff.lockUntil <= new Date()) {
            staff.loginAttempts = 0;
            staff.lockUntil = null;
        }

        const isMatch = await staff.comparePassword(password);

        if (!isMatch) {
            staff.loginAttempts = (staff.loginAttempts || 0) + 1;
            const maxAttempts = Number(policies.maxLoginAttempts) || 5;
            const lockoutMinutes = Number(policies.lockoutMinutes) || 15;
            if (staff.loginAttempts >= maxAttempts) {
                staff.lockUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
                await staff.save();
                return res.status(423).json({
                    success: false,
                    message: `Too many failed attempts. Account locked for ${lockoutMinutes} minutes.`,
                    lockedUntil: staff.lockUntil
                });
            }
            await staff.save();
            logSecurity(req, { instituteId: staff.instituteId, userId: staff._id, userModel: "Staff", identifier: staff.email, action: "wrong_password", success: false, message: `Invalid credentials. ${maxAttempts - staff.loginAttempts} attempts remaining.` });
            return res.status(401).json({
                success: false,
                message: `Invalid credentials. ${maxAttempts - staff.loginAttempts} attempts remaining.`,
            });
        }

        // Reset login attempts on success
        staff.loginAttempts = 0;
        staff.lockUntil = null;

        // 2. IP Whitelist check
        if (policies.ipWhitelistEnabled && policies.ipWhitelist?.length > 0) {
            const clientIp = req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || '';
            const allowedIps = policies.ipWhitelist.map(ip => ip.trim());
            console.log('[Staff Login] Current IP:', clientIp);
            console.log('[Staff Login] Allowed IPs:', allowedIps);
            const isLoopback = ['::1', '127.0.0.1', '::ffff:127.0.0.1'].includes(clientIp);
            const isAllowed = isLoopback || allowedIps.some(allowed => clientIp === allowed || clientIp.endsWith(allowed));
            if (!isAllowed) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: Login not allowed from this network. Please use office network."
                });
            }
        }

        // 3. Password expiry check (use passwordChangedAt or createdAt for legacy staff)
        const pwdExpiryDays = Number(policies.passwordExpiryDays);
        if (pwdExpiryDays > 0) {
            const refDate = staff.passwordChangedAt || staff.createdAt;
            if (refDate) {
                const expiryDate = new Date(refDate);
                expiryDate.setDate(expiryDate.getDate() + pwdExpiryDays);
                if (new Date() > expiryDate) {
                    return res.status(403).json({
                        success: false,
                        message: "Your password has expired. Please contact administrator to reset.",
                        requiresPasswordChange: true
                    });
                }
            }
        }

        // 4. Force 2FA - send OTP to email and require verification
        if (policies.force2FA) {
            const otp = "123456";
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

            await OtpVerification.deleteMany({ staffId: staff._id });
            await OtpVerification.create({
                staffId: staff._id,
                email: staff.email,
                otp,
                expiresAt
            });

            const sent = await sendStaffOtpEmail(staff.email, otp, staff.name);
            if (!sent) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to send OTP. Please try again later."
                });
            }

            const tempToken = generateTempOtpToken(staff._id);

            return res.status(200).json({
                success: true,
                message: "OTP sent to your email. Enter it to complete login.",
                requires2FA: true,
                tempToken
            });
        }

        // Validate Role if provided
        if (role) {
            const assignedRoleCode = staff.roleId?.code || '';
            if (!assignedRoleCode.toUpperCase().includes(role.toUpperCase())) {
                return res.status(403).json({
                    success: false,
                    message: `Access Denied: You are not authorized to login as ${role}. Your assigned role is ${staff.roleId?.name || 'different'}.`
                });
            }
        }

        const sessionMinutes = Number(policies.sessionTimeout) || 30;
        const token = generateToken(staff._id, "Staff", `${sessionMinutes}m`);

        staff.lastLogin = new Date();
        await staff.save();

        logSecurity(req, { instituteId: staff.instituteId, userId: staff._id, userModel: "Staff", identifier: staff.email, action: "login_success", success: true, message: "Login successful" });
        logUserActivity(req, { instituteId: staff.instituteId, branchId: staff.branchId, userId: staff._id, userModel: "Staff", userEmail: staff.email, userName: staff.name, action: "login", description: "Staff login" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: staff,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET STAFF PERMISSIONS =================
export const getStaffPermissions = async (req, res) => {
    try {
        const staffId = req.user.id; // User ID from auth middleware
        const staff = await Staff.findById(staffId).populate('roleId');

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        const permissions = staff.roleId ? staff.roleId.permissions : {};

        res.status(200).json({
            success: true,
            data: permissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= GET STAFF PROFILE =================
export const getStaffProfile = async (req, res) => {
    try {
        const staffId = req.user._id;
        const staff = await Staff.findById(staffId)
            .populate('roleId', 'name code permissions')
            .populate('branchId', 'name')
            .populate({
                path: 'instituteId',
                select: 'name email phone address logo'
            });

        if (!staff) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.status(200).json({
            success: true,
            data: staff
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const staffId = req.user._id;

        console.log(`[PASS_CHANGE] Attempt for staff: ${staffId}`);

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const staff = await Staff.findById(staffId).select('+password');
        if (!staff) {
            console.log(`[PASS_CHANGE] Staff NOT found: ${staffId}`);
            return res.status(404).json({ success: false, message: "Staff not found" });
        }

        console.log(`[PASS_CHANGE] Verifying current password...`);
        const isMatch = await staff.comparePassword(currentPassword);
        if (!isMatch) {
            console.log(`[PASS_CHANGE] INVALID current password for: ${staffId}`);
            return res.status(401).json({ success: false, message: "Invalid current password" });
        }

        // Update password
        staff.password = newPassword;
        await staff.save();

        console.log(`[PASS_CHANGE] SUCCESS for staff: ${staffId}`);
        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("[PASS_CHANGE] ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
    try {
        const staffId = req.user._id;
        const { profilePic, bannerPic, name, phone } = req.body;
        console.log(`Updating profile for staff: ${staffId}`, { name, phone, hasProfilePic: !!profilePic, hasBannerPic: !!bannerPic });

        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff not found" });
        }

        // Update basic fields
        if (name) staff.name = name;
        if (phone) staff.phone = phone;

        // Handle profile picture upload
        if (profilePic && profilePic.startsWith('data:image')) {
            console.log("Uploading profile pic to Cloudinary...");
            const uploadedUrl = await uploadBase64ToCloudinary(profilePic, 'staff_profiles');
            staff.profilePic = uploadedUrl;
            console.log("Profile pic uploaded:", uploadedUrl);
        }

        // Handle banner picture upload
        if (bannerPic && bannerPic.startsWith('data:image')) {
            console.log("Uploading banner pic to Cloudinary...");
            const uploadedUrl = await uploadBase64ToCloudinary(bannerPic, 'staff_banners');
            staff.bannerPic = uploadedUrl;
            console.log("Banner pic uploaded:", uploadedUrl);
        }

        await staff.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: staff
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
