import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true
        },
        academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear" },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "raisedByType",
        },
        raisedByType: {
            type: String,
            enum: ["Student", "Parent", "Staff", "Teacher"],
        },
        topic: {
            type: String,
            required: true,
            trim: true,
        },
        details: {
            type: String,
            required: true,
        },
        attachment: {
            type: String,
        },
        category: {
            type: String,
            required: true,
            enum: ["Academic", "Fee Related", "Homework", "General", "Correction", "Attendance", "Fees", "Transport", "Other", "Documents"],
        },
        status: {
            type: String,
            enum: ["Open", "In-Progress", "Resolved", "Closed"],
            default: "Open",
        },
        priority: {
            type: String,
            enum: ["Low", "Normal", "High", "Urgent"],
            default: "Normal",
        },
        response: {
            type: String,
        },
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "onModel",
        },
        onModel: {
            type: String,
            enum: ["Teacher", "Staff", "Institute"],
        },
        respondedAt: {
            type: Date,
        },
        responseAttachment: {
            type: String,
        },
        responseAttachmentName: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("SupportTicket", supportTicketSchema);
