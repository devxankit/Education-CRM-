import TimetableRule from "../Models/TimetableRuleModel.js";

// ================= GET TIMETABLE RULES BY BRANCH + ACADEMIC YEAR =================
export const getTimetableRules = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const { branchId, academicYearId } = req.query;

        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required",
            });
        }

        const ayId = academicYearId && academicYearId !== "all" ? academicYearId : null;
        let rules = await TimetableRule.findOne({ instituteId, branchId, academicYearId: ayId });

        if (!rules) {
            rules = new TimetableRule({ instituteId, branchId, academicYearId: ayId });
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

// ================= UPDATE TIMETABLE RULES BY BRANCH + ACADEMIC YEAR =================
export const updateTimetableRules = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const { branchId, academicYearId } = req.query;
        const updateData = req.body;

        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required",
            });
        }

        const ayId = academicYearId && academicYearId !== "all" ? academicYearId : null;
        const rules = await TimetableRule.findOneAndUpdate(
            { instituteId, branchId, academicYearId: ayId },
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

// ================= TOGGLE LOCK BY BRANCH + ACADEMIC YEAR =================
export const toggleTimetableLock = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const { branchId, academicYearId } = req.query;
        const { isLocked } = req.body;

        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required",
            });
        }

        const ayId = req.query.academicYearId && req.query.academicYearId !== "all" ? req.query.academicYearId : null;
        const rules = await TimetableRule.findOneAndUpdate(
            { instituteId, branchId, academicYearId: ayId },
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
