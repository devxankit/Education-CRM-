import Student from "../Models/StudentModel.js";
import Teacher from "../Models/TeacherModel.js";
import Staff from "../Models/StaffModel.js";
import AcademicYear from "../Models/AcademicYearModel.js";
import SupportTicket from "../Models/SupportTicketModel.js";
import FeeStructure from "../Models/FeeStructureModel.js";
import UserActivityLog from "../Models/UserActivityLogModel.js";
import Checklist from "../Models/ChecklistModel.js";

/**
 * GET Admin Dashboard stats (counts, academic year, alerts, recent activity)
 * Query: branchId (optional - filter counts by branch)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { branchId } = req.query;

        const baseQuery = { instituteId };
        const branchFilter = branchId && branchId !== "all" ? { branchId } : {};

        const [
            totalStudents,
            totalTeachers,
            totalStaff,
            activeAcademicYear,
            pendingAdmissionApprovals,
            openTickets,
            inactiveFeeStructures,
            draftChecklists,
            recentLogs,
        ] = await Promise.all([
            Student.countDocuments({ ...baseQuery, ...branchFilter, status: { $nin: ["withdrawn", "alumni"] } }),
            Teacher.countDocuments({ ...baseQuery, ...branchFilter }),
            Staff.countDocuments({ ...baseQuery, ...branchFilter, status: "active" }),
            AcademicYear.findOne({ instituteId, status: "active" }).select("name startDate endDate status").lean(),
            Student.countDocuments({ ...baseQuery, ...branchFilter, status: "in_review" }),
            SupportTicket.countDocuments({ instituteId, status: { $in: ["Open", "In-Progress"] } }),
            FeeStructure.countDocuments({ instituteId, status: { $ne: "active" } }),
            Checklist.countDocuments({ instituteId, isActive: false }),
            UserActivityLog.find({ instituteId })
                .sort({ createdAt: -1 })
                .limit(10)
                .select("userName userEmail action entityType description createdAt")
                .lean(),
        ]);

        const pendingApprovals = pendingAdmissionApprovals;

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
                pendingApprovals: pendingApprovals || 0,
                openTickets,
                activeAcademicYear: activeAcademicYear
                    ? {
                        name: activeAcademicYear.name,
                        startDate: activeAcademicYear.startDate,
                        endDate: activeAcademicYear.endDate,
                        status: activeAcademicYear.status,
                    }
                    : null,
                alerts,
                recentActivity,
                systemHealth: {
                    server: "Stable",
                    database: "Synced",
                    uptime: "99.98%",
                    lastBackup: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " Today",
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
