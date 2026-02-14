import mongoose from "mongoose";

const accessControlSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
            unique: true, // One set of policies per institute
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

export default mongoose.model("AccessControl", accessControlSchema);
