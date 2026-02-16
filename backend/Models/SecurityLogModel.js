import mongoose from "mongoose";

/**
 * Login & Security Logs
 * Isme login aur security se related information store hoti hai.
 * Example: 9:00 AM successful login, wrong password try, 3 failed attempts, different IP/country.
 */
const securityLogSchema = new mongoose.Schema(
    {
        instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" },
        userId: { type: mongoose.Schema.Types.ObjectId, refPath: "userModel" },
        userModel: { type: String, enum: ["Institute", "Staff", "Teacher", "Student", "Parent"] },
        identifier: { type: String }, // email ya login id
        action: {
            type: String,
            required: true,
            enum: [
                "login_success",
                "login_failed",
                "logout",
                "wrong_password",
                "account_locked",
                "2fa_success",
                "2fa_failed",
                "password_changed",
                "password_reset_request",
                "access_denied_ip",
                "access_denied_role"
            ]
        },
        success: { type: Boolean, default: false },
        message: { type: String },
        ipAddress: { type: String },
        userAgent: { type: String },
        metadata: { type: mongoose.Schema.Types.Mixed }
    },
    { timestamps: true }
);

securityLogSchema.index({ instituteId: 1, createdAt: -1 });
securityLogSchema.index({ identifier: 1, createdAt: -1 });
securityLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model("SecurityLog", securityLogSchema);
