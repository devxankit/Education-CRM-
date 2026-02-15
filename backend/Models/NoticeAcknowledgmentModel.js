import mongoose from "mongoose";

const noticeAcknowledgmentSchema = new mongoose.Schema(
    {
        noticeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notice",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            // Can be parent, student, or staff ID
        },
        userType: {
            type: String,
            enum: ["Parent", "Student", "Staff"],
            required: true,
        },
        acknowledgedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Unique acknowledgment per user per notice
noticeAcknowledgmentSchema.index({ noticeId: 1, userId: 1 }, { unique: true });

export default mongoose.model("NoticeAcknowledgment", noticeAcknowledgmentSchema);
