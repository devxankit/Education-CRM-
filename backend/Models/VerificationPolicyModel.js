import mongoose from "mongoose";

const verificationLevelSchema = new mongoose.Schema({
    role: { type: String, required: true, trim: true },
    slaHours: { type: Number, default: 24 },
    canReject: { type: Boolean, default: true },
});

const verificationPolicySchema = new mongoose.Schema(
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
        entity: {
            type: String,
            enum: ["student", "employee"],
            default: "student",
        },
        documentName: { type: String, required: true, trim: true },
        category: { type: String, trim: true, default: "General" },
        mode: {
            type: String,
            enum: ["none", "manual", "multi"],
            default: "manual",
        },
        levels: [verificationLevelSchema],
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

verificationPolicySchema.index({ instituteId: 1, branchId: 1, entity: 1 });

export default mongoose.model("VerificationPolicy", verificationPolicySchema);
