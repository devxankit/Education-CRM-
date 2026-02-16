import SupportTicket from "../Models/SupportTicketModel.js";
import Student from "../Models/StudentModel.js";
import TeacherMapping from "../Models/TeacherMappingModel.js";

// ================= GET TEACHER SUPPORT TICKETS =================
export const getTeacherSupportTickets = async (req, res) => {
    try {
        const teacherId = req.user._id;

        // Get all sections taught by this teacher
        const mappings = await TeacherMapping.find({
            teacherId,
            status: "active"
        }).distinct('sectionId');

        // Get all students in those sections
        const studentIds = await Student.find({
            sectionId: { $in: mappings },
            status: "active"
        }).distinct('_id');

        // Get support tickets from those students
        const tickets = await SupportTicket.find({
            studentId: { $in: studentIds }
        })
            .populate('studentId', 'firstName lastName admissionNo')
            .populate({
                path: 'studentId',
                populate: [
                    { path: 'classId sectionId', select: 'name' },
                    { path: 'parentId', select: 'name mobile email relationship' }
                ]
            })
            .populate("raisedBy", "firstName lastName name")
            .populate("respondedBy", "firstName lastName name role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (error) {
        console.error("Error fetching support tickets:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= RESOLVE SUPPORT TICKET =================
export const resolveSupportTicket = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const { ticketId } = req.params;
        const { response } = req.body;

        const ticket = await SupportTicket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Verify teacher has access to this student
        const mappings = await TeacherMapping.find({
            teacherId,
            status: "active"
        }).distinct('sectionId');

        const sectionIds = mappings.map(id => id.toString());
        const student = await Student.findById(ticket.studentId);

        if (!student || !sectionIds.includes(student.sectionId?.toString())) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // Update ticket
        ticket.status = "Resolved";
        ticket.response = response || "Query has been resolved.";
        ticket.respondedBy = teacherId;
        ticket.onModel = "Teacher";
        ticket.respondedAt = new Date();

        await ticket.save();
        await ticket.populate("respondedBy", "firstName lastName name role email");

        res.status(200).json({
            success: true,
            message: "Ticket resolved successfully",
            data: ticket
        });
    } catch (error) {
        console.error("Error resolving ticket:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
