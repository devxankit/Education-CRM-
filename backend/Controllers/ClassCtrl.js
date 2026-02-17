import Class from "../Models/ClassModel.js";
import Section from "../Models/SectionModel.js";
import Student from "../Models/StudentModel.js";
import Course from "../Models/CourseModel.js";

// ================= CLASS CONTROLLERS =================

export const createClass = async (req, res) => {
    try {
        const { name, level, board, branchId, academicYearId, capacity } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }
        if (!academicYearId) {
            return res.status(400).json({ success: false, message: "Academic Year is required" });
        }

        const newClass = new Class({
            instituteId,
            branchId,
            academicYearId: academicYearId || null,
            name,
            level,
            board,
            capacity
        });

        await newClass.save();

        res.status(201).json({
            success: true,
            message: "Class created successfully",
            data: newClass,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getClasses = async (req, res) => {
    try {
        const { branchId, academicYearId, includeArchived } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        const query = { instituteId };
        if (includeArchived !== 'true') {
            query.status = 'active';
        }
        if (branchId && branchId !== 'main') {
            if (branchId.length !== 24) {
                return res.status(200).json({ success: true, data: [] });
            }
            query.branchId = branchId;
        }
        if (academicYearId && academicYearId.length === 24) {
            query.$or = [
                { academicYearId },
                { academicYearId: null },
                { academicYearId: { $exists: false } }
            ];
        }

        const classes = await Class.find(query)
            .populate('academicYearId', 'name');

        res.status(200).json({
            success: true,
            data: classes,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedClass = await Class.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Class updated successfully",
            data: updatedClass,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= SECTION CONTROLLERS =================

export const createSection = async (req, res) => {
    try {
        const { classId, name, capacity, teacherId } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }

        const section = new Section({
            instituteId,
            branchId: classData.branchId,
            classId,
            name,
            capacity: classData.capacity || 40,
            teacherId: teacherId || null
        });

        await section.save();

        res.status(201).json({
            success: true,
            message: "Section created successfully",
            data: section,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSectionsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { includeInactive } = req.query;

        if (classId.length !== 24 && classId !== 'main') {
            return res.status(200).json({ success: true, data: [] });
        }

        const instituteId = req.user.instituteId || req.user._id;
        const query = { instituteId };
        if (classId !== 'main') {
            query.classId = classId;
        }
        // By default return only active sections (for dropdowns); management pages pass includeInactive=true
        if (includeInactive !== 'true') {
            query.status = 'active';
        }

        const classData = await Class.findById(classId);
        const sections = await Section.find(query).populate('teacherId', 'firstName lastName employeeId');

        // Add actual student count for each section and override capacity with class capacity
        const sectionsWithCount = await Promise.all(sections.map(async (sec) => {
            const count = await Student.countDocuments({ sectionId: sec._id, status: 'active' });
            const secObj = sec.toObject();
            return {
                ...secObj,
                studentCount: count,
                capacity: classData ? classData.capacity : secObj.capacity // Override with class capacity
            };
        }));

        res.status(200).json({
            success: true,
            data: sectionsWithCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSection = await Section.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('teacherId', 'firstName lastName employeeId');

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CLASS TEACHER ASSIGNMENT =================
export const getSectionsForClassTeacherAssignment = async (req, res) => {
    try {
        const { branchId, academicYearId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId || !academicYearId) {
            return res.status(400).json({
                success: false,
                message: "branchId and academicYearId are required",
            });
        }

        const classQuery = { instituteId, branchId };
        classQuery.$or = [
            { academicYearId },
            { academicYearId: null },
            { academicYearId: { $exists: false } },
        ];

        const classes = await Class.find(classQuery)
            .sort({ name: 1 })
            .populate("academicYearId", "name");

        const classIds = classes.map((c) => c._id);

        const sections = await Section.find({
            instituteId,
            classId: { $in: classIds },
        })
            .populate("classId", "name academicYearId")
            .populate("teacherId", "firstName lastName employeeId email")
            .sort({ "classId.name": 1, name: 1 });

        const sectionsWithCount = await Promise.all(
            sections.map(async (sec) => {
                const count = await Student.countDocuments({
                    sectionId: sec._id,
                    status: { $nin: ["withdrawn", "alumni"] },
                });
                const secObj = sec.toObject();
                return { ...secObj, studentCount: count };
            })
        );

        const courseQuery = { instituteId, branchId, status: "active" };
        courseQuery.$or = [
            { academicYearId },
            { academicYearId: null },
            { academicYearId: { $exists: false } },
        ];
        const courses = await Course.find(courseQuery)
            .populate("teacherId", "firstName lastName employeeId email")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: { classes, sections: sectionsWithCount, courses },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
