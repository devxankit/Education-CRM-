import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["Academic", "Fee Related", "Homework", "General", "Correction"],
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
    },
    { timestamps: true }
);

export default mongoose.model("SupportTicket", supportTicketSchema);
