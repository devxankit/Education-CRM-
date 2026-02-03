import mongoose from "mongoose";

const salaryHeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["earning", "deduction"], required: true },
    calculation: { type: String, enum: ["fixed", "percentage"], required: true },
    value: { type: Number, required: true },
    base: { type: String, default: "basic" }, // only for percentage
    isDefault: { type: Boolean, default: false }
});

const payrollRuleSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        financialYear: {
            type: String,
            required: true,
        },
        isLocked: {
            type: Boolean,
            default: false,
        },
        unlockReason: {
            type: String,
        },
        salaryHeads: [salaryHeadSchema],
        leaveRules: {
            lopFormula: {
                type: String,
                enum: ["fixed_30", "actual_days"],
                default: "fixed_30"
            },
            sandwichRule: { type: Boolean, default: false },
            includeWeekends: { type: Boolean, default: true },
        },
        schedule: {
            cycleStart: { type: Number, default: 1 },
            payoutDay: { type: Number, default: 5 },
            autoGenerateSlips: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

// Unique rule per institute and financial year
payrollRuleSchema.index({ instituteId: 1, financialYear: 1 }, { unique: true });

export default mongoose.model("PayrollRule", payrollRuleSchema);
