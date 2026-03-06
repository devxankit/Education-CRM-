import mongoose from "mongoose";
import Holiday from "../Models/HolidayModel.js";

// ================= ADD HOLIDAY =================
export const createHoliday = async (req, res) => {
    try {
        const {
            name, type, startDate, endDate, isRange,
            applicableTo, branchId, academicYearId, description
        } = req.body;

        const instituteId = req.user._id;

        const holiday = new Holiday({
            instituteId,
            branchId: branchId || "all",
            academicYearId: academicYearId || null,
            name,
            type,
            startDate,
            endDate: isRange ? endDate : startDate,
            isRange,
            applicableTo,
            description
        });

        await holiday.save();

        res.status(201).json({
            success: true,
            message: "Holiday added successfully",
            data: holiday,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL HOLIDAYS =================
export const getHolidays = async (req, res) => {
    try {
        const instituteId = req.role === "institute" ? req.user._id : req.user.instituteId;
        const { branchId, academicYearId, year, applicableTo } = req.query;

        let query = { instituteId };

        if (req.role !== "institute") {
            const userBranchId = req.user.branchId ? String(req.user.branchId) : null;
            if (userBranchId) {
                query.$or = [{ branchId: "all" }, { branchId: userBranchId }];
            }
        } else if (branchId && branchId !== "all") {
            query.$or = [{ branchId: "all" }, { branchId }];
        }

        if (academicYearId && academicYearId !== "all" && mongoose.Types.ObjectId.isValid(academicYearId)) {
            query.academicYearId = { $in: [new mongoose.Types.ObjectId(academicYearId), null] };
        }

        if (req.role === "student" || req.role === "parent") {
            query.applicableTo = "students";
        } else if (req.role === "teacher") {
            query.applicableTo = "teachers";
        } else if (req.role === "staff") {
            query.applicableTo = "staff";
        } else if (applicableTo) {
            query.applicableTo = applicableTo;
        }

        if (year) {
            const start = new Date(`${year}-01-01`);
            const end = new Date(`${year}-12-31`);
            query.startDate = { $gte: start, $lte: end };
        }

        const holidays = await Holiday.find(query).sort({ startDate: 1 });

        res.status(200).json({
            success: true,
            data: holidays,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE HOLIDAY =================
export const updateHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (updateData.academicYearId === '') updateData.academicYearId = null;
        if (!updateData.isRange) {
            updateData.endDate = updateData.startDate;
        }

        const holiday = await Holiday.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!holiday) {
            return res.status(404).json({
                success: false,
                message: "Holiday not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Holiday updated successfully",
            data: holiday,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= DELETE HOLIDAY =================
export const deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        const holiday = await Holiday.findByIdAndDelete(id);

        if (!holiday) {
            return res.status(404).json({
                success: false,
                message: "Holiday not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Holiday deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
