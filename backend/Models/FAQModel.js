import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        question: {
            type: String,
            required: true,
            trim: true,
        },
        answer: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: "General",
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

faqSchema.index({ instituteId: 1, status: 1 });

export default mongoose.model("FAQ", faqSchema);
