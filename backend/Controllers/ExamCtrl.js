import Exam from "../Models/ExamModel.js";
import ExamPolicy from "../Models/ExamPolicyModel.js";
import Class from "../Models/ClassModel.js";
import Subject from "../Models/SubjectModel.js";
import Branch from "../Models/BranchModel.js";
import asyncHandler from "express-async-handler";

/**
 * @desc Get all exams for an institute/branch
 * @route GET /api/v1/exams
 * @access Private/Admin
 */
export const getExams = asyncHandler(async (req, res) => {
    const instituteId = req.user.instituteId || req.user._id;
    const { branchId, academicYearId, status } = req.query;

    const query = { instituteId };
    if (branchId) query.branchId = branchId;
    if (academicYearId) query.academicYearId = academicYearId;
    if (status) query.status = status;

    const exams = await Exam.find(query)
        .populate("classes", "name")
        .populate("courses", "name code")
        .populate("academicYearId", "name")
        .populate("subjects.subjectId", "name code")
        .sort({ startDate: -1 });

    res.status(200).json({ success: true, data: exams });
});

/**
 * @desc Create a new exam
 * @route POST /api/v1/exams
 * @access Private/Admin
 */
export const createExam = asyncHandler(async (req, res) => {
    const instituteId = req.user.instituteId || req.user._id;
    let branchId = req.user.branchId || req.user.branch || req.body.branchId;

    if (!branchId && req.role === 'institute') {
        const firstBranch = await Branch.findOne({ instituteId, isActive: true });
        if (firstBranch) {
            branchId = firstBranch._id;
        }
    }

    const {
        academicYearId,
        examName,
        examType,
        startDate,
        endDate,
        description,
        classes,
        courses,
        subjects,
        status
    } = req.body;

    const hasClasses = classes && classes.length > 0;
    const hasCourses = courses && courses.length > 0;
    if (!academicYearId || !examName || !startDate || !endDate) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    if (!hasClasses && !hasCourses) {
        return res.status(400).json({ success: false, message: "Please select at least one class or course" });
    }

    if (!branchId) {
        return res.status(400).json({ success: false, message: "Branch ID is required to create an exam." });
    }

    // Check if the exam type is valid as per policy
    const policy = await ExamPolicy.findOne({ instituteId, academicYearId });
    if (policy) {
        const policyExamType = policy.examTypes.find(t => t.isIncluded && (t.name === examType || t.name === examName));

        if (policyExamType) {
            // If the exam matches a policy type, ensure subjects follow the maxMarks
            subjects.forEach(sub => {
                if (!sub.maxMarks) sub.maxMarks = policyExamType.maxMarks;
            });
        }
    }

    const exam = new Exam({
        instituteId,
        branchId,
        academicYearId,
        examName,
        examType,
        startDate,
        endDate,
        description,
        classes: classes || [],
        courses: courses || [],
        subjects,
        status: status || "Published"
    });

    await exam.save();
    res.status(201).json({ success: true, message: "Exam created successfully", data: exam });
});

/**
 * @desc Get exam by ID
 * @route GET /api/v1/exams/:id
 * @access Private/Admin
 */
export const getExamById = asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id)
        .populate("classes", "name")
        .populate("courses", "name code")
        .populate("academicYearId", "name")
        .populate("subjects.subjectId", "name code");

    if (!exam) {
        return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({ success: true, data: exam });
});

/**
 * @desc Update exam
 * @route PUT /api/v1/exams/:id
 * @access Private/Admin
 */
export const updateExam = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const exam = await Exam.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

    if (!exam) {
        return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({ success: true, message: "Exam updated successfully", data: exam });
});

/**
 * @desc Delete exam
 * @route DELETE /api/v1/exams/:id
 * @access Private/Admin
 */
export const deleteExam = asyncHandler(async (req, res) => {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
        return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({ success: true, message: "Exam deleted successfully" });
});
