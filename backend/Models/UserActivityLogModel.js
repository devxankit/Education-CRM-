import mongoose from "mongoose";

/**
 * User Activity Logs
 * Isme record hota hai ki user ne system me kya-kya actions kiye.
 * Example: Rehan ne 10:30 AM pe login kiya, 10:35 pe new student add kiya.
 */
const userActivityLogSchema = new mongoose.Schema(
    {
        instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
        branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
        userId: { type: mongoose.Schema.Types.ObjectId, refPath: "userModel", required: true },
        userModel: { type: String, enum: ["Institute", "Staff", "Teacher", "Student", "Parent"], required: true },
        userEmail: { type: String },
        userName: { type: String },
        action: { type: String, required: true }, // login, create_student, update_fee, delete_expense, etc.
        entityType: { type: String }, // Student, FeePayment, Expense, Payroll, etc.
        entityId: { type: mongoose.Schema.Types.ObjectId },
        description: { type: String },
        ipAddress: { type: String },
        userAgent: { type: String },
        metadata: { type: mongoose.Schema.Types.Mixed }
    },
    { timestamps: true }
);

userActivityLogSchema.index({ instituteId: 1, createdAt: -1 });
userActivityLogSchema.index({ userId: 1, createdAt: -1 });
userActivityLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model("UserActivityLog", userActivityLogSchema);
