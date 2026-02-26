import Student from "../Models/StudentModel.js";
import StudentNotification from "../Models/StudentNotificationModel.js";
import { sendPushToTokens } from "../Helpers/notificationHelper.js";

export const sendCustomNotification = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const {
            audienceType, // 'student' | 'teacher' | 'staff' | 'parent'
            title,
            message,
            branchId,
            classId,
            sectionId,
            studentIds,
        } = req.body;

        if (!audienceType || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "audienceType, title and message are required",
            });
        }

        if (audienceType !== "student") {
            return res.status(400).json({
                success: false,
                message: "Currently only student audience is supported for custom notifications.",
            });
        }

        const query = { instituteId };
        if (branchId && branchId !== "all") {
            query.branchId = branchId;
        }
        if (classId && classId !== "all") {
            query.classId = classId;
        }
        if (sectionId && sectionId !== "all") {
            query.sectionId = sectionId;
        }
        if (Array.isArray(studentIds) && studentIds.length > 0) {
            query._id = { $in: studentIds };
        }

        const students = await Student.find(query).select("_id fcmTokens");
        if (!students.length) {
            return res.status(200).json({
                success: true,
                message: "No matching students found for this audience filter.",
            });
        }

        const notifications = students.map((s) => ({
            instituteId,
            studentId: s._id,
            type: "info",
            title,
            message,
            meta: { audienceType: "student", branchId, classId, sectionId },
        }));

        await StudentNotification.insertMany(notifications);

        const allTokens = students.flatMap((s) => s.fcmTokens || []);
        await sendPushToTokens(allTokens, {
            title,
            body: message,
            data: { type: "custom_broadcast", audienceType: "student" },
        });

        res.status(200).json({
            success: true,
            message: `Notification sent to ${students.length} students.`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

