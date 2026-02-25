import SupportTicket from "../Models/SupportTicketModel.js";
import TeacherTicket from "../Models/TeacherTicketModel.js";
import Student from "../Models/StudentModel.js";
import StudentNotification from "../Models/StudentNotificationModel.js";
import Class from "../Models/ClassModel.js";
import AcademicYear from "../Models/AcademicYearModel.js";
import { uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";
import { sendPushToTokens } from "../Helpers/notificationHelper.js";

// Create a new ticket (Staff side)
export const createTicket = async (req, res) => {
    try {
        const { studentId, category, topic, details, priority } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        let branchId, academicYearId;
        const student = await Student.findById(studentId).populate("classId", "academicYearId").lean();
        if (student) {
            branchId = student.branchId;
            academicYearId = student.classId?.academicYearId || null;
        }

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required to raise a ticket. Please ensure student is assigned to a branch." });
        }

        const ticket = new SupportTicket({
            instituteId,
            studentId,
            branchId,
            academicYearId,
            raisedBy: req.user._id,
            raisedByType: "Staff",
            category,
            topic,
            details,
            priority: priority || "Normal"
        });

        await ticket.save();

        // Create in-app notification for student
        try {
            const studentDoc = await Student.findById(studentId);
            if (studentDoc) {
                await StudentNotification.create({
                    instituteId,
                    studentId: studentDoc._id,
                    type: "info",
                    title: "Support ticket created",
                    message: `${ticket.topic} – your request has been received.`,
                    meta: { ticketId: ticket._id.toString(), status: ticket.status },
                });

                // Push notification via Firebase (if tokens registered)
                await sendPushToTokens(studentDoc.fcmTokens || [], {
                    title: "Support ticket created",
                    body: ticket.topic,
                    data: {
                        type: "support_ticket_created",
                        ticketId: ticket._id.toString(),
                    },
                });
            }
        } catch (notifyErr) {
            console.error("Error creating notification for support ticket:", notifyErr?.message || notifyErr);
        }

        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tickets for an institute (filter by branch + academic year for staff)
export const getAllTickets = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const staffBranchId = req.user.branchId;
        const { branchId, academicYearId } = req.query;

        const query = { instituteId };

        // Filter: Documents are only for Staff/Admin, not for Teachers
        if (req.role === "teacher") {
            query.category = { $ne: "Documents" };
        }

        // If explicit branchId filter provided, respect it.
        // Otherwise, do NOT restrict by branch so that staff can see
        // all institute tickets by default.
        const branchFilter = branchId && branchId !== "all" ? branchId : null;
        const ayFilter = academicYearId && academicYearId !== "all" ? academicYearId : null;
        const andParts = [];
        if (branchFilter) {
            query.branchId = branchFilter;
        }
        if (ayFilter) {
            andParts.push({ $or: [{ academicYearId: ayFilter }, { academicYearId: null }, { academicYearId: { $exists: false } }] });
        }
        if (andParts.length) query.$and = andParts;

        const tickets = await SupportTicket.find(query)
            .populate("studentId", "firstName lastName admissionNo classId sectionId")
            .populate("raisedBy", "firstName lastName name")
            .populate("respondedBy", "firstName lastName name role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single ticket by ID
export const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await SupportTicket.findById(id)
            .populate("studentId", "firstName lastName admissionNo classId sectionId")
            .populate("raisedBy", "firstName lastName name mobile email")
            .populate("respondedBy", "firstName lastName name role email");

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const ticket = await SupportTicket.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        res.status(200).json({
            success: true,
            message: `Ticket status updated to ${status}`,
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Respond to ticket
export const respondToTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { response, status, attachment } = req.body; // attachment: { base64, name }
        const staffId = req.user._id;
        const role = req.role; // Lowercase from AuthMiddleware

        const updateData = {
            response,
            status: status || "Resolved",
            respondedBy: staffId,
            onModel: role === "teacher" ? "Teacher" : (role === "institute" ? "Institute" : "Staff"),
            respondedAt: new Date()
        };

        // Handle Response Attachment Upload
        if (attachment && attachment.base64) {
            try {
                const instituteId = req.user.instituteId || req.user._id;
                const cloudinaryUrl = await uploadBase64ToCloudinary(attachment.base64, `support/responses/${instituteId}`);
                updateData.responseAttachment = cloudinaryUrl;
                updateData.responseAttachmentName = attachment.name || "response-document";
            } catch (uploadError) {
                console.error("Error uploading response attachment:", uploadError);
            }
        }

        const ticket = await SupportTicket.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).populate("respondedBy", "firstName lastName name role email").populate("studentId", "firstName lastName admissionNo");

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        // Notify student about response
        try {
            const studentDoc = await Student.findById(ticket.studentId);
            if (studentDoc) {
                await StudentNotification.create({
                    instituteId: studentDoc.instituteId,
                    studentId: studentDoc._id,
                    type: status === "Closed" ? "success" : "info",
                    title: status === "Closed" ? "Support ticket closed" : "New response on your ticket",
                    message: ticket.topic,
                    meta: { ticketId: ticket._id.toString(), status: ticket.status },
                });

                await sendPushToTokens(studentDoc.fcmTokens || [], {
                    title: status === "Closed" ? "Ticket closed" : "Support response",
                    body: ticket.topic,
                    data: {
                        type: "support_ticket_updated",
                        ticketId: ticket._id.toString(),
                        status: ticket.status || status || "Resolved",
                    },
                });
            }
        } catch (notifyErr) {
            console.error("Error sending support-ticket notification:", notifyErr?.message || notifyErr);
        }

        res.status(200).json({
            success: true,
            message: "Response sent successfully",
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get teacher tickets (for staff - filtered by branch + academic year)
export const getTeacherTickets = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const staffBranchId = req.user.branchId;
        const { branchId, academicYearId } = req.query;

        const query = { instituteId };
        // Only filter by branch when explicitly requested
        const branchFilter = branchId && branchId !== "all" ? branchId : null;
        let ayFilter = academicYearId && academicYearId !== "all" ? academicYearId : null;

        if (branchFilter) {
            query.branchId = branchFilter;
        }
        if (!ayFilter && (branchFilter || staffBranchId)) {
            const activeYear = await AcademicYear.findOne({
                instituteId,
                $or: [{ branchId: branchFilter || staffBranchId }, { branchId: null }],
                status: "active"
            }).sort({ startDate: -1 });
            ayFilter = activeYear?._id;
        }
        if (ayFilter) {
            query.academicYearId = ayFilter;
        }

        const tickets = await TeacherTicket.find(query)
            .populate("raisedBy", "firstName lastName employeeId email")
            .populate("branchId", "name")
            .populate("academicYearId", "name")
            .populate("respondedBy", "firstName lastName name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Respond to teacher ticket
export const respondToTeacherTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { response, status, attachment } = req.body;

        const updateData = {
            response,
            status: status || "Resolved",
            respondedBy: req.user._id,
            respondedByModel: req.role === "institute" ? "Institute" : "Staff",
            respondedAt: new Date()
        };

        if (attachment && attachment.base64) {
            try {
                const instituteId = req.user.instituteId || req.user._id;
                const cloudinaryUrl = await uploadBase64ToCloudinary(attachment.base64, `support/responses/${instituteId}`);
                updateData.responseAttachment = cloudinaryUrl;
                updateData.responseAttachmentName = attachment.name || "response-document";
            } catch (uploadError) {
                console.error("Error uploading response attachment:", uploadError);
            }
        }

        const ticket = await TeacherTicket.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        )
            .populate("respondedBy", "firstName lastName name")
            .populate("raisedBy", "firstName lastName employeeId");

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        res.status(200).json({ success: true, message: "Response sent successfully", data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await SupportTicket.findByIdAndDelete(id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
