import mongoose from "mongoose";

const feePolicySchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        isLocked: {
            type: Boolean,
            default: false,
        },
        unlockReason: {
            type: String,
        },
        installmentRules: {
            allowPartial: { type: Boolean, default: true },
            allowOutOfOrder: { type: Boolean, default: false },
            strictDueDate: { type: Boolean, default: true },
            blockResultsOnDue: { type: Boolean, default: true },
        },
        lateFeeRules: {
            enabled: { type: Boolean, default: true },
            gracePeriod: { type: Number, default: 7 },
            type: { type: String, enum: ["flat", "percentage"], default: "flat" },
            value: { type: Number, default: 50 },
            frequency: {
                type: String,
                enum: ["one-time", "daily", "weekly", "monthly"],
                default: "daily",
            },
            maxCap: { type: Number, default: 1000 },
        },
        discountRules: [
            {
                name: { type: String, required: true },
                type: { type: String, enum: ["flat", "percentage"], required: true },
                value: { type: Number, required: true },
                approvalRequired: { type: Boolean, default: true },
            },
        ],
        refundRules: {
            allowed: { type: Boolean, default: false },
            windowDays: { type: Number, default: 30 },
            deductionPercent: { type: Number, default: 10 },
        },
    },
    { timestamps: true }
);

// Unique policy per institute and academic year
feePolicySchema.index({ instituteId: 1, academicYearId: 1 }, { unique: true });

export default mongoose.model("FeePolicy", feePolicySchema);
