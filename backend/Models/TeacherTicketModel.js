import mongoose from "mongoose";

const teacherTicketSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
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
        category: {
            type: String,
            required: true,
            enum: ["General", "IT Support", "HR & Payroll", "Finance", "Leave", "Attendance", "Other"],
            default: "General",
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
        response: { type: String },
        respondedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "respondedByModel" },
        respondedByModel: { type: String, enum: ["Staff", "Institute"], default: "Staff" },
        respondedAt: { type: Date },
        responseAttachment: { type: String },
        responseAttachmentName: { type: String },
    },
    { timestamps: true }
);

teacherTicketSchema.index({ instituteId: 1, branchId: 1, academicYearId: 1 });
teacherTicketSchema.index({ raisedBy: 1 });

export default mongoose.model("TeacherTicket", teacherTicketSchema);
