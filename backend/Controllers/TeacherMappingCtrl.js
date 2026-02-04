import TeacherMapping from "../Models/TeacherMappingModel.js";
import Subject from "../Models/SubjectModel.js";

// ================= ASSIGN/UPDATE TEACHER MAPPING =================
export const assignTeacher = async (req, res) => {
    try {
        const {
            academicYearId, branchId, classId, courseId,
            sectionId, subjectId, teacherId
        } = req.body;

        const instituteId = req.user._id;

        const mapping = await TeacherMapping.findOneAndUpdate(
            { academicYearId, sectionId, subjectId },
            {
                $set: {
                    instituteId,
                    branchId,
                    classId,
                    courseId,
                    teacherId,
                    status: "active"
                }
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Teacher assigned successfully",
            data: mapping,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET MAPPINGS BY CONTEXT =================
export const getMappings = async (req, res) => {
    try {
        const { academicYearId, sectionId, classId, courseId } = req.query;
        const instituteId = req.user._id;

        if (!academicYearId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Academic Year and Section are required"
            });
        }

        // 1. Get all subjects that are mapped to this class/course
        let subjectQuery = { instituteId };
        if (classId) subjectQuery.classIds = classId;
        if (courseId) subjectQuery.courseIds = courseId;

        const subjects = await Subject.find(subjectQuery).select("name code type category");

        // 2. Get existing mappings for this section in this year
        const existingMappings = await TeacherMapping.find({
            academicYearId,
            sectionId
        }).populate("teacherId", "firstName lastName email");

        // 3. Merge subjects with mappings
        const result = subjects.map(sub => {
            const mapping = existingMappings.find(m => m.subjectId.toString() === sub._id.toString());
            const teacherFullName = mapping?.teacherId
                ? `${mapping.teacherId.firstName || ''} ${mapping.teacherId.lastName || ''}`.trim()
                : null;

            return {
                subjectId: sub._id,
                subjectName: sub.name,
                subjectCode: sub.code,
                type: sub.type,
                category: sub.category,
                teacherId: mapping ? mapping.teacherId?._id : null,
                teacherName: teacherFullName || null
            };
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= REMOVE MAPPING =================
export const removeMapping = async (req, res) => {
    try {
        const { id } = req.params; // Mapping ID
        await TeacherMapping.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Mapping removed successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= REMOVE BY CONTEXT (Deselect) =================
export const removeMappingByContext = async (req, res) => {
    try {
        const { academicYearId, sectionId, subjectId } = req.body;
        await TeacherMapping.findOneAndDelete({ academicYearId, sectionId, subjectId });

        res.status(200).json({
            success: true,
            message: "Assignment removed successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
