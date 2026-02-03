import TimetableRule from "../Models/TimetableRuleModel.js";

// ================= GET TIMETABLE RULES BY BRANCH =================
export const getTimetableRules = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const { branchId } = req.query;

        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required",
            });
        }

        let rules = await TimetableRule.findOne({ instituteId, branchId });

        // If no rules exist yet, create default rules for this branch
        if (!rules) {
            rules = new TimetableRule({ instituteId, branchId });
            await rules.save();
        }

        res.status(200).json({
            success: true,
            data: rules,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE TIMETABLE RULES BY BRANCH =================
export const updateTimetableRules = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const { branchId } = req.query;
        const updateData = req.body;

        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required",
            });
        }

        const rules = await TimetableRule.findOneAndUpdate(
            { instituteId, branchId },
            { $set: updateData },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Timetable rules updated successfully",
            data: rules,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= TOGGLE LOCK BY BRANCH =================
export const toggleTimetableLock = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const { branchId } = req.query;
        const { isLocked } = req.body;

        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required",
            });
        }

        const rules = await TimetableRule.findOneAndUpdate(
            { instituteId, branchId },
            { $set: { isLocked } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Timetable rules ${isLocked ? 'locked' : 'unlocked'} successfully`,
            data: rules,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
