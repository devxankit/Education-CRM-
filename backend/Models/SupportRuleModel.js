import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    autoAck: { type: Boolean, default: true }
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "medium"
    },
    active: { type: Boolean, default: true }
});

const slaSchema = new mongoose.Schema({
    priority: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        required: true
    },
    response: { type: Number, required: true }, // Hours
    resolution: { type: Number, required: true } // Hours
});

const supportRuleSchema = new mongoose.Schema(
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
        channels: [channelSchema],
        categories: [categorySchema],
        sla: [slaSchema],
        escalation: {
            escalationEnabled: { type: Boolean, default: true },
            autoBreachEscalation: { type: Boolean, default: true },
        },
    },
    { timestamps: true }
);

supportRuleSchema.index({ branchId: 1 }, { unique: true });

export default mongoose.model("SupportRule", supportRuleSchema);
