import mongoose from "mongoose";

const documentCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
    mandatory: { type: Boolean, default: false }
});

const studentRequirementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stage: {
        type: String,
        enum: ["admission", "post-admission", "exam"],
        default: "admission"
    },
    mandatory: { type: Boolean, default: false },
    verifier: {
        type: String,
        enum: ["admin", "registrar", "class-teacher"],
        default: "admin"
    }
});

const staffRequirementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ["all", "teaching", "non-teaching", "contractual"],
        default: "all"
    },
    mandatory: { type: Boolean, default: false }
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
        studentRules: [studentRequirementSchema],
        staffRules: [staffRequirementSchema],
    },
    { timestamps: true }
);

documentRuleSchema.index({ branchId: 1 }, { unique: true });

export default mongoose.model("DocumentRule", documentRuleSchema);
