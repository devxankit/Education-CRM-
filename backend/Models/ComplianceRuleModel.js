import mongoose from "mongoose";

const complianceRuleSchema = new mongoose.Schema(
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
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        documentTypes: [{ type: String, trim: true }],
        validationRules: [{ type: String, trim: true }],
        retention: { type: String, trim: true, default: "7 years" },
        isActive: { type: Boolean, default: true },
        appliesTo: {
            type: String,
            enum: ["students", "employees", "teachers", "all"],
            default: "students",
        },
    },
    { timestamps: true }
);

complianceRuleSchema.index({ instituteId: 1, branchId: 1 });

export default mongoose.model("ComplianceRule", complianceRuleSchema);
