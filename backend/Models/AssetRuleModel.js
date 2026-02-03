import mongoose from "mongoose";

const assetRuleSchema = new mongoose.Schema(
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
        isLocked: {
            type: Boolean,
            default: false,
        },
        unlockReason: {
            type: String,
        },
        inventory: {
            trackingEnabled: { type: Boolean, default: true },
            lowStockThreshold: { type: Number, default: 10 },
            autoBlockIssue: { type: Boolean, default: true },
        },
        assignment: {
            allowStaff: { type: Boolean, default: true },
            allowDepartment: { type: Boolean, default: true },
            allowLocation: { type: Boolean, default: true },
            approvalRequired: { type: Boolean, default: true },
            mandatoryReturn: { type: Boolean, default: true },
        },
        audit: {
            periodicAudit: { type: Boolean, default: true },
            frequency: { type: String, enum: ["monthly", "quarterly", "yearly"], default: "quarterly" },
            physicalVerification: { type: Boolean, default: true },
            retentionYears: { type: Number, default: 5 },
        },
    },
    { timestamps: true }
);

assetRuleSchema.index({ branchId: 1 }, { unique: true });

export default mongoose.model("AssetRule", assetRuleSchema);
