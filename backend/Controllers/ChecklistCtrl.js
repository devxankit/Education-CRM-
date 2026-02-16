import Checklist from "../Models/ChecklistModel.js";

// ================= CREATE OR UPDATE CHECKLIST =================
export const saveChecklist = async (req, res) => {
    try {
        const { id, branchId, title, targetRole, description, isActive, items } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        let checklist;
        if (id) {
            checklist = await Checklist.findOneAndUpdate(
                { _id: id, instituteId },
                { branchId, title, targetRole, description, isActive, items },
                { new: true, runValidators: true }
            );
        } else {
            checklist = new Checklist({
                instituteId,
                branchId,
                title,
                targetRole,
                description,
                isActive,
                items
            });
            await checklist.save();
        }

        res.status(200).json({
            success: true,
            message: "Checklist saved successfully",
            data: checklist,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CHECKLISTS =================
export const getChecklists = async (req, res) => {
    try {
        const { branchId, targetRole } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (targetRole) query.targetRole = targetRole;

        const checklists = await Checklist.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: checklists,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE CHECKLIST =================
export const deleteChecklist = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const checklist = await Checklist.findOneAndDelete({ _id: id, instituteId });

        if (!checklist) {
            return res.status(404).json({ success: false, message: "Checklist not found" });
        }

        res.status(200).json({
            success: true,
            message: "Checklist deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= TOGGLE STATUS =================
export const toggleChecklistStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const checklist = await Checklist.findOne({ _id: id, instituteId });
        if (!checklist) {
            return res.status(404).json({ success: false, message: "Checklist not found" });
        }

        checklist.isActive = !checklist.isActive;
        await checklist.save();

        res.status(200).json({
            success: true,
            message: `Checklist ${checklist.isActive ? 'activated' : 'deactivated'} successfully`,
            data: checklist,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
