import mongoose from "mongoose";

const transportConfigSchema = new mongoose.Schema(
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
        availability: {
            isEnabled: { type: Boolean, default: true },
            isMandatory: { type: Boolean, default: false },
            scope: { type: String, enum: ["all", "selected"], default: "all" },
        },
        routeRules: {
            maxStopsPerRoute: { type: Number, default: 20 },
            minStudentsToStart: { type: Number, default: 5 },
        },
        capacityRules: {
            bufferPercent: { type: Number, default: 10 },
            enforceStrictLimit: { type: Boolean, default: true },
        },
        feeLink: {
            autoApplyToInvoices: { type: Boolean, default: true },
            feeType: { type: String, enum: ["monthly", "quarterly", "yearly"], default: "monthly" },
        },
    },
    { timestamps: true }
);

transportConfigSchema.index({ branchId: 1 }, { unique: true });

export default mongoose.model("TransportConfig", transportConfigSchema);
