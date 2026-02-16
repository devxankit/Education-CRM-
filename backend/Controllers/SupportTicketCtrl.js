import SupportTicket from "../Models/SupportTicketModel.js";

// Create a new ticket (Staff side)
export const createTicket = async (req, res) => {
    try {
        const { studentId, category, topic, details, priority } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        const ticket = new SupportTicket({
            instituteId,
            studentId,
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

// Get all tickets for an institute
export const getAllTickets = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const tickets = await SupportTicket.find({ instituteId })
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
        const { response, status } = req.body;
        const staffId = req.user._id;
        const role = req.role; // Lowercase from AuthMiddleware

        const ticket = await SupportTicket.findByIdAndUpdate(
            id,
            {
                response,
                status: status || "Resolved",
                respondedBy: staffId,
                onModel: role === "teacher" ? "Teacher" : (role === "institute" ? "Institute" : "Staff"),
                respondedAt: new Date()
            },
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
