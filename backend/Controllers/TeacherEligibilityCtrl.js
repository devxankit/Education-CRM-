
import Teacher from "../Models/TeacherModel.js";

// ================= ADD ELIGIBLE SUBJECT =================
export const addEligibleSubject = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { subjectId } = req.body;

        const teacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { $addToSet: { eligibleSubjects: subjectId } },
            { new: true }
        ).populate("eligibleSubjects", "name code type");

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.status(200).json({
            success: true,
            message: "Subject added to eligibility",
            data: teacher.eligibleSubjects
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= REMOVE ELIGIBLE SUBJECT =================
export const removeEligibleSubject = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { subjectId } = req.body;

        const teacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { $pull: { eligibleSubjects: subjectId } },
            { new: true }
        ).populate("eligibleSubjects", "name code type");

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.status(200).json({
            success: true,
            message: "Subject removed from eligibility",
            data: teacher.eligibleSubjects
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ELIGIBLE SUBJECTS =================
export const getEligibleSubjects = async (req, res) => {
    try {
        const { teacherId } = req.params;

        const teacher = await Teacher.findById(teacherId)
            .populate("eligibleSubjects", "name code type category");

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.status(200).json({
            success: true,
            data: teacher.eligibleSubjects || []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
