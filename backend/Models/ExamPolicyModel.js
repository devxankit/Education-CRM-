import mongoose from "mongoose";

const examPolicySchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            default: null, // null = applies to all branches (legacy)
        },
        // Exam Types & Weightage
        examTypes: [
            {
                name: { type: String, required: true },
                weightage: { type: Number, required: true }, // Should sum to 100 for included types
                maxMarks: { type: Number, required: true },
                isIncluded: { type: Boolean, default: true },
            }
        ],
        // Grading System
        gradingScale: [
            {
                label: { type: String, required: true }, // e.g., "A+", "A"
                minPercentage: { type: Number, required: true },
                maxPercentage: { type: Number, required: true },
                gradePoints: { type: Number, required: true },
            }
        ],
        // Promotion Rules
        promotionCriteria: {
            minAttendancePercentage: { type: Number, default: 75 },
            failSubjectLimit: { type: Number, default: 2 },
            maxGraceMarks: { type: Number, default: 10 },
            allowConditionalPromotion: { type: Boolean, default: true },
        },
        // Result Visibility & Publication
        visibilityRules: {
            autoPublishResults: { type: Boolean, default: false },
            publishDate: { type: Date },
            showGraceMarksToParents: { type: Boolean, default: false },
            showRankInReportCard: { type: Boolean, default: true },
            showPercentile: { type: Boolean, default: false },
            allowParentView: { type: Boolean, default: true },
        },
        isLocked: {
            type: Boolean,
            default: true,
        },
        lastUnlockedReason: {
            type: String,
        },
        unlockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff", // or Manager/Admin
        },
        version: {
            type: String,
            default: "1.0",
        },
    },
    { timestamps: true }
);

// Unique: one policy per institute + academic year + branch (branchId null = institute-wide)
examPolicySchema.index({ instituteId: 1, academicYearId: 1, branchId: 1 }, { unique: true });

export default mongoose.model("ExamPolicy", examPolicySchema);
