import mongoose from "mongoose";
import Student from "../Models/StudentModel.js";
import Teacher from "../Models/TeacherModel.js";
import Staff from "../Models/StaffModel.js";
import AcademicYear from "../Models/AcademicYearModel.js";
import SupportTicket from "../Models/SupportTicketModel.js";
import FeeStructure from "../Models/FeeStructureModel.js";
import UserActivityLog from "../Models/UserActivityLogModel.js";
import Checklist from "../Models/ChecklistModel.js";

/**
 * GET Admin Dashboard stats (counts, academic year, alerts, recent activity, chart data)
 * Query: branchId (optional), academicYearId (optional - filter students & pending by year)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { branchId, academicYearId } = req.query;

        const baseQuery = { instituteId };
        const branchFilter = branchId && branchId !== "all" ? { branchId } : {};
        // Academic years for dropdown: for this branch (or institute-wide when branch is all)
        const academicYearQuery = { instituteId };
        if (branchId && branchId !== "all") {
            academicYearQuery.$or = [
                { branchId: new mongoose.Types.ObjectId(branchId) },
                { branchId: null },
            ];
        }
        const studentFilter = {
            ...baseQuery,
            ...branchFilter,
            status: { $nin: ["withdrawn", "alumni"] },
        };
        if (academicYearId && academicYearId !== "all") {
            studentFilter.academicYearId = new mongoose.Types.ObjectId(academicYearId);
        }
        const pendingFilter = { ...baseQuery, ...branchFilter, status: "in_review" };
        if (academicYearId && academicYearId !== "all") {
            pendingFilter.academicYearId = new mongoose.Types.ObjectId(academicYearId);
        }

        const [
            totalStudents,
            totalTeachers,
            totalStaff,
            academicYearsList,
            activeAcademicYearDoc,
            pendingAdmissionApprovals,
            openTickets,
            inactiveFeeStructures,
            draftChecklists,
            recentLogs,
            studentsByClassAgg,
        ] = await Promise.all([
            Student.countDocuments(studentFilter),
            Teacher.countDocuments({ ...baseQuery, ...branchFilter }),
            Staff.countDocuments({ ...baseQuery, ...branchFilter, status: "active" }),
            AcademicYear.find(academicYearQuery).sort({ startDate: -1 }).select("_id name startDate endDate status branchId").lean(),
            AcademicYear.findOne({ instituteId, status: "active" }).select("name startDate endDate status").lean(),
            Student.countDocuments(pendingFilter),
            SupportTicket.countDocuments({ instituteId, status: { $in: ["Open", "In-Progress"] } }),
            FeeStructure.countDocuments({ instituteId, status: { $ne: "active" } }),
            Checklist.countDocuments({ instituteId, isActive: false }),
            UserActivityLog.find({ instituteId })
                .sort({ createdAt: -1 })
                .limit(10)
                .select("userName userEmail action entityType description createdAt")
                .lean(),
            Student.aggregate([
                { $match: studentFilter },
                { $group: { _id: "$classId", count: { $sum: 1 } } },
                {
                    $lookup: {
                        from: "classes",
                        localField: "_id",
                        foreignField: "_id",
                        as: "classDoc",
                    },
                },
                {
                    $project: {
                        className: {
                            $cond: {
                                if: { $and: [{ $ne: ["$_id", null] }, { $gt: [{ $size: "$classDoc" }, 0] }] },
                                then: { $arrayElemAt: ["$classDoc.name", 0] },
                                else: "Unassigned",
                            },
                        },
                        count: 1,
                    },
                },
                { $sort: { className: 1 } },
            ]),
        ]);

        const activeAcademicYear = activeAcademicYearDoc
            ? {
                _id: activeAcademicYearDoc._id,
                name: activeAcademicYearDoc.name,
                startDate: activeAcademicYearDoc.startDate,
                endDate: activeAcademicYearDoc.endDate,
                status: activeAcademicYearDoc.status,
            }
            : null;

        const academicYears = (academicYearsList || []).map((ay) => ({
            _id: ay._id,
            name: ay.name,
            startDate: ay.startDate,
            endDate: ay.endDate,
            status: ay.status,
        }));

        const studentsByClass = (studentsByClassAgg || []).map((row) => ({
            name: row.className || "Unassigned",
            count: row.count || 0,
        }));

        const alerts = [];
        if (inactiveFeeStructures > 0) {
            alerts.push({
                id: "fee-inactive",
                type: "warning",
                title: "Fee Structure",
                message: `${inactiveFeeStructures} Fee Structure(s) inactive`,
                link: "/admin/finance/fee-structures",
            });
        }
        if (openTickets > 0) {
            alerts.push({
                id: "tickets",
                type: "critical",
                title: "Support Tickets",
                message: `${openTickets} open ticket(s) need attention`,
                link: "/admin/operations/support-rules",
            });
        }
        if (draftChecklists > 0) {
            alerts.push({
                id: "checklists",
                type: "warning",
                title: "Checklists",
                message: `${draftChecklists} checklist(s) in draft`,
                link: "/admin/compliance/checklists",
            });
        }
        if (alerts.length === 0) {
            alerts.push({
                id: "ok",
                type: "info",
                title: "All clear",
                message: "No critical alerts at the moment.",
                link: "/admin/dashboard",
            });
        }

        const recentActivity = (recentLogs || []).map((log, i) => ({
            id: log._id || i,
            user: log.userName || log.userEmail || "System",
            action: log.action ? log.action.replace(/_/g, " ") : "",
            target: log.description || log.entityType || "",
            time: formatTimeAgo(log.createdAt),
            type: log.entityType || "system",
        }));

        return res.status(200).json({
            success: true,
            data: {
                totalStudents: totalStudents || 0,
                totalTeachers: totalTeachers || 0,
                totalStaff: totalStaff || 0,
                pendingApprovals: pendingAdmissionApprovals || 0,
                openTickets,
                activeAcademicYear,
                academicYears,
                alerts,
                recentActivity,
                chartData: {
                    studentsByClass,
                    roleDistribution: [
                        { name: "Students", value: totalStudents || 0 },
                        { name: "Teachers", value: totalTeachers || 0 },
                        { name: "Support Staff", value: totalStaff || 0 },
                    ],
                },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

function formatTimeAgo(date) {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
}
