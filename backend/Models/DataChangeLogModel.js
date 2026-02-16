import mongoose from "mongoose";

/**
 * Data Change History
 * Isme record hota hai ki data me kab aur kya change hua.
 * Example: Student mobile update, fee structure price change, order status Pending -> Completed.
 */
const dataChangeLogSchema = new mongoose.Schema(
    {
        instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
        branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
        entityType: { type: String, required: true }, // Student, Teacher, FeeStructure, etc.
        entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
        action: { type: String, required: true, enum: ["create", "update", "delete"] },
        changedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "changedByModel" },
        changedByModel: { type: String, enum: ["Institute", "Staff", "Teacher"] },
        changedByEmail: { type: String },
        changedFields: [{ type: String }],
        oldValue: { type: mongoose.Schema.Types.Mixed },
        newValue: { type: mongoose.Schema.Types.Mixed },
        description: { type: String }
    },
    { timestamps: true }
);

dataChangeLogSchema.index({ instituteId: 1, createdAt: -1 });
dataChangeLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export default mongoose.model("DataChangeLog", dataChangeLogSchema);
