import mongoose from "mongoose";

const documentCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
    mandatory: { type: Boolean, default: false }
});

const studentRequirementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: "General" },
    stage: {
        type: String,
        enum: ["admission", "post-admission", "joining", "exam"],
        default: "admission"
    },
    mandatory: { type: Boolean, default: false },
    gracePeriodDays: { type: Number, default: 0 },
    enforcement: {
        type: String,
        enum: ["hard_block", "soft_warning", "info_only"],
        default: "hard_block"
    },
    verifier: {
        type: String,
        enum: ["admin", "registrar", "class-teacher", "compliance"],
        default: "admin"
    }
});

const staffRequirementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: "General" },
    type: {
        type: String,
        enum: ["all", "teaching", "non-teaching", "contractual"],
        default: "all"
    },
    stage: {
        type: String,
        enum: ["admission", "post-admission", "joining", "interview"],
        default: "joining"
    },
    mandatory: { type: Boolean, default: false },
    gracePeriodDays: { type: Number, default: 0 },
    enforcement: {
        type: String,
        enum: ["hard_block", "soft_warning", "info_only"],
        default: "hard_block"
    }
});

const documentRuleSchema = new mongoose.Schema(
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
        categories: [documentCategorySchema],
        workflow: {
            verificationLevel: { type: String, enum: ["single", "multi"], default: "single" },
            autoReject: { type: Boolean, default: false },
            retentionYears: { type: Number, default: 5 },
            autoArchive: { type: Boolean, default: true },
            expiryAction: { type: String, enum: ["Archive", "Delete"], default: "Archive" }
        },
        // Provisional admission: allow student without docs for limited days
        provisionalAdmission: {
            allowed: { type: Boolean, default: false },
            maxValidityDays: { type: Number, default: 45 }
        },
        // Roles that can bypass Hard Block (override authority)
        overrideRoles: {
            type: [String],
            enum: ["Super Admin", "Principal", "Registrar", "Compliance Officer"],
            default: ["Super Admin"]
        },
        studentRules: [studentRequirementSchema],
        staffRules: [staffRequirementSchema],
    },
    { timestamps: true }
);

documentRuleSchema.index({ branchId: 1 }, { unique: true });

export default mongoose.model("DocumentRule", documentRuleSchema);
