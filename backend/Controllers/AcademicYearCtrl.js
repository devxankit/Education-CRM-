import AcademicYear from "../Models/AcademicYearModel.js";

// ================= CREATE ACADEMIC YEAR =================
export const createAcademicYear = async (req, res) => {
    try {
        const { name, startDate, endDate } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        const academicYear = new AcademicYear({
            instituteId,
            name,
            startDate,
            endDate,
            createdBy: instituteId
        });

        await academicYear.save();

        res.status(201).json({
            success: true,
            message: "Academic Year created successfully",
            data: academicYear,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL ACADEMIC YEARS =================
export const getAcademicYears = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const academicYears = await AcademicYear.find({ instituteId }).sort({ startDate: -1 });

        res.status(200).json({
            success: true,
            data: academicYears,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= ACTIVATE YEAR =================
export const activateAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        // First, deactivate any currently active year
        await AcademicYear.updateMany(
            { instituteId, status: "active" },
            { $set: { status: "closed" } } // Or "upcoming" depending on business logic, usually closed.
        );

        const academicYear = await AcademicYear.findByIdAndUpdate(
            id,
            { $set: { status: "active" } },
            { new: true }
        );

        if (!academicYear) {
            return res.status(404).json({
                success: false,
                message: "Academic Year not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Academic Year activated successfully",
            data: academicYear,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= CLOSE YEAR =================
export const closeAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;

        const academicYear = await AcademicYear.findByIdAndUpdate(
            id,
            { $set: { status: "closed" } },
            { new: true }
        );

        if (!academicYear) {
            return res.status(404).json({
                success: false,
                message: "Academic Year not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Academic Year closed successfully",
            data: academicYear,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= DELETE YEAR =================
export const deleteAcademicYear = async (req, res) => {
    try {
        const { id } = req.params;

        const academicYear = await AcademicYear.findById(id);
        if (academicYear.status === "active") {
            return res.status(400).json({
                success: false,
                message: "Cannot delete an active academic year"
            });
        }

        await AcademicYear.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Academic Year deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
