import Subject from "../Models/SubjectModel.js";

// ================= CREATE SUBJECT =================
export const createSubject = async (req, res) => {
    try {
        const { name, code, type, category, level, branchId, classIds, courseIds } = req.body;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const subject = new Subject({
            instituteId,
            branchId,
            name,
            code: code ? code.toUpperCase() : `SUB_${name.substring(0, 3).toUpperCase()}_${Date.now().toString().slice(-4)}`,
            type,
            category,
            level,
            classIds,
            courseIds
        });

        await subject.save();

        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: subject,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ALL SUBJECTS =================
export const getSubjects = async (req, res) => {
    try {
        const { branchId, level } = req.query;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        let query = { instituteId, branchId };
        if (level && level !== 'all') {
            query.level = level;
        }

        const subjects = await Subject.find(query)
            .populate("classIds", "name")
            .populate("courseIds", "name")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: subjects,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE SUBJECT =================
export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate("classIds", "name").populate("courseIds", "name");

        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            data: subject,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE SUBJECT =================
export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByIdAndDelete(id);

        if (!subject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
