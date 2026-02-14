import Class from "../Models/ClassModel.js";
import Section from "../Models/SectionModel.js";
import Student from "../Models/StudentModel.js";

// ================= CLASS CONTROLLERS =================

export const createClass = async (req, res) => {
    try {
        const { name, level, board, branchId, capacity } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const newClass = new Class({
            instituteId,
            branchId,
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
        const { branchId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        const query = { instituteId, status: "active" };
        if (branchId && branchId !== 'main') {
            if (branchId.length !== 24) {
                return res.status(200).json({ success: true, data: [] });
            }
            query.branchId = branchId;
        } else if (branchId === 'main') {
            // Keep 'main' as special - no branchId filter for institute-wide
        }

        const classes = await Class.find(query);

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

        if (classId.length !== 24 && classId !== 'main') {
            return res.status(200).json({ success: true, data: [] });
        }

        const instituteId = req.user.instituteId || req.user._id;
        const query = { instituteId };
        if (classId !== 'main') {
            query.classId = classId;
        }

        const classData = await Class.findById(classId);
        const sections = await Section.find(query).populate('teacherId', 'name');

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
        ).populate('teacherId', 'name');

        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
