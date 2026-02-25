import mongoose from "mongoose";

const studentNotificationSchema = new mongoose.Schema(
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
        type: {
            type: String,
            enum: ["alert", "success", "info", "general"],
            default: "general",
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        meta: {
            type: Object,
        },
    },
    { timestamps: true }
);

studentNotificationSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.model("StudentNotification", studentNotificationSchema);

