import SupportTicket from "../Models/SupportTicketModel.js";
import TeacherTicket from "../Models/TeacherTicketModel.js";
import Student from "../Models/StudentModel.js";
import Class from "../Models/ClassModel.js";
import AcademicYear from "../Models/AcademicYearModel.js";
import { uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";

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

        const branchFilter = branchId || staffBranchId;
        const ayFilter = academicYearId && academicYearId !== "all" ? academicYearId : null;
        const andParts = [];
        if (branchFilter && branchFilter !== "all") {
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
        const branchFilter = branchId || staffBranchId;
        let ayFilter = academicYearId && academicYearId !== "all" ? academicYearId : null;

        if (branchFilter && branchFilter !== "all") {
            query.branchId = branchFilter;
        }
        if (!ayFilter && branchFilter) {
            const activeYear = await AcademicYear.findOne({
                instituteId,
                $or: [{ branchId: branchFilter }, { branchId: null }],
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
