import mongoose from "mongoose";

const accessControlSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            default: null,
        },
        force2FA: {
            type: Boolean,
            default: false,
        },
        sessionTimeout: {
            type: Number,
            default: 30, // minutes
        },
        maxLoginAttempts: {
            type: Number,
            default: 3,
        },
        lockoutMinutes: {
            type: Number,
            default: 15,
        },
        ipWhitelistEnabled: {
            type: Boolean,
            default: false,
        },
        ipWhitelist: {
            type: [String],
            default: [],
        },
        passwordExpiryDays: {
            type: Number,
            default: 90,
        },
    },
    { timestamps: true }
);

accessControlSchema.index({ instituteId: 1, branchId: 1 }, { unique: true });

export default mongoose.model("AccessControl", accessControlSchema);
