import mongoose from "mongoose";

const notificationRuleSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        module: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        trigger: {
            type: String,
            required: true,
            trim: true,
        },
        condition: {
            type: String,
            trim: true,
            default: "Instant",
        },
        conditionVal: {
            type: Number,
            default: 0,
        },
        audience: {
            type: [String],
            default: [],
        },
        channels: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["ACTIVE", "DISABLED", "DRAFT"],
            default: "DRAFT",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
        },
    },
    { timestamps: true }
);

notificationRuleSchema.index({ instituteId: 1, module: 1, status: 1 });

export default mongoose.model("NotificationRule", notificationRuleSchema);
