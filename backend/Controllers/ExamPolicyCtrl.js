import ExamPolicy from "../Models/ExamPolicyModel.js";
import asyncHandler from "express-async-handler";

/**
 * @desc Get Exam Policy for current institute/academic year
 * @route GET /api/v1/exam-policies
 * @access Private/Admin
 */
export const getExamPolicy = asyncHandler(async (req, res) => {
    const instituteId = req.user.instituteId || req.user._id;
    const { academicYearId, branchId } = req.query;

    if (!academicYearId) {
        return res.status(400).json({ success: false, message: "Academic Year ID is required" });
    }

    const branchFilter = branchId ? branchId : null;
    let policy = await ExamPolicy.findOne({ instituteId, academicYearId, branchId: branchFilter });
    if (!policy && branchFilter) {
        policy = await ExamPolicy.findOne({ instituteId, academicYearId, branchId: null });
    }

    if (!policy) {
        // Return a template or default if none exists
        return res.status(200).json({
            success: true,
            message: "No policy found, providing defaults",
            data: {
                instituteId,
                academicYearId,
                branchId: branchFilter,
                examTypes: [],
                gradingScale: [],
                promotionCriteria: {
                    minAttendancePercentage: 75,
                    failSubjectLimit: 2,
                    maxGraceMarks: 10,
                    allowConditionalPromotion: true,
                },
                visibilityRules: {
                    autoPublishResults: false,
                    showGraceMarksToParents: false,
                    showRankInReportCard: true,
                    showPercentile: false,
                    allowParentView: true,
                },
                isLocked: false, // Default to unlocked for first setup
            }
        });
    }

    res.status(200).json({ success: true, data: policy });
});

/**
 * @desc Create or Update Exam Policy
 * @route POST /api/v1/exam-policies
 * @access Private/Admin
 */
export const saveExamPolicy = asyncHandler(async (req, res) => {
    const instituteId = req.user.instituteId || req.user._id;
    const { academicYearId, branchId, examTypes, gradingScale, promotionCriteria, visibilityRules } = req.body;

    if (!academicYearId) {
        return res.status(400).json({ success: false, message: "Academic Year ID is required" });
    }

    const branchFilter = branchId || null;
    let policy = await ExamPolicy.findOne({ instituteId, academicYearId, branchId: branchFilter });

    if (policy && policy.isLocked) {
        return res.status(403).json({ success: false, message: "Policy is locked. Please unlock it with a reason to make changes." });
    }

    // Validation: Weightage sum
    if (examTypes && examTypes.length > 0) {
        const totalWeight = examTypes.reduce((sum, item) => item.isIncluded ? sum + Number(item.weightage) : sum, 0);
        if (totalWeight !== 100) {
            return res.status(400).json({ success: false, message: `Total weightage of included exams must be 100%. Current: ${totalWeight}%` });
        }
    }

    if (policy) {
        // Update
        policy = await ExamPolicy.findByIdAndUpdate(
            policy._id,
            {
                $set: {
                    examTypes,
                    gradingScale,
                    promotionCriteria,
                    visibilityRules,
                    version: (parseFloat(policy.version) + 0.1).toFixed(1)
                }
            },
            { new: true, runValidators: true }
        );
    } else {
        // Create
        policy = new ExamPolicy({
            instituteId,
            academicYearId,
            branchId: branchFilter,
            examTypes,
            gradingScale,
            promotionCriteria,
            visibilityRules,
            isLocked: true // Lock automatically after first save?
        });
        await policy.save();
    }

    res.status(200).json({ success: true, message: "Exam policy saved successfully", data: policy });
});

/**
 * @desc Unlock Exam Policy for modifications
 * @route POST /api/v1/exam-policies/unlock
 * @access Private/Admin
 */
export const unlockExamPolicy = asyncHandler(async (req, res) => {
    const instituteId = req.user.instituteId || req.user._id;
    const { academicYearId, branchId, reason } = req.body;

    if (!reason || reason.length < 5) {
        return res.status(400).json({ success: false, message: "Valid reason (minimum 5 characters) required for audit trail" });
    }

    const branchFilter = branchId || null;
    let policy = await ExamPolicy.findOne({ instituteId, academicYearId, branchId: branchFilter });
    if (!policy && branchFilter) {
        policy = await ExamPolicy.findOne({ instituteId, academicYearId, branchId: null });
    }

    if (!policy) {
        return res.status(404).json({ success: false, message: "No policy found to unlock" });
    }

    policy.isLocked = false;
    policy.lastUnlockedReason = reason;
    policy.unlockedBy = req.user._id;
    await policy.save();

    res.status(200).json({ success: true, message: "Policy unlocked successfully", data: policy });
});

/**
 * @desc Lock Exam Policy
 * @route POST /api/v1/exam-policies/lock
 * @access Private/Admin
 */
export const lockExamPolicy = asyncHandler(async (req, res) => {
    const instituteId = req.user.instituteId || req.user._id;
    const { academicYearId, branchId } = req.body;

    const branchFilter = branchId || null;
    let policy = await ExamPolicy.findOne({ instituteId, academicYearId, branchId: branchFilter });
    if (!policy && branchFilter) {
        policy = await ExamPolicy.findOne({ instituteId, academicYearId, branchId: null });
    }

    if (!policy) {
        return res.status(404).json({ success: false, message: "No policy found to lock" });
    }

    // Optional: Final validation check before locking
    const totalWeight = policy.examTypes.reduce((sum, item) => item.isIncluded ? sum + Number(item.weightage) : sum, 0);
    if (totalWeight !== 100) {
        return res.status(400).json({ success: false, message: "Weightage must sum to 100% before locking." });
    }

    policy.isLocked = true;
    await policy.save();

    res.status(200).json({ success: true, message: "Policy locked and activated", data: policy });
});
