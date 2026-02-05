import Timetable from "../Models/TimetableModel.js";

// ================= CREATE OR UPDATE TIMETABLE =================
export const upsertTimetable = async (req, res) => {
    try {
        const {
            academicYearId,
            branchId,
            classId,
            sectionId,
            schedule
        } = req.body;

        const instituteId = req.user.instituteId || req.user._id;

        const timetable = await Timetable.findOneAndUpdate(
            { academicYearId, sectionId },
            {
                instituteId,
                branchId,
                classId,
                academicYearId,
                sectionId,
                schedule,
                status: "active"
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Timetable saved successfully",
            data: timetable,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TIMETABLE BY CONTEXT =================
export const getTimetable = async (req, res) => {
    try {
        const { academicYearId, sectionId } = req.query;

        if (!academicYearId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Academic Year and Section are required"
            });
        }

        const timetable = await Timetable.findOne({ academicYearId, sectionId })
            .populate("schedule.Mon.subjectId schedule.Mon.teacherId")
            .populate("schedule.Tue.subjectId schedule.Tue.teacherId")
            .populate("schedule.Wed.subjectId schedule.Wed.teacherId")
            .populate("schedule.Thu.subjectId schedule.Thu.teacherId")
            .populate("schedule.Fri.subjectId schedule.Fri.teacherId")
            .populate("schedule.Sat.subjectId schedule.Sat.teacherId")
            .populate("schedule.Sun.subjectId schedule.Sun.teacherId");

        res.status(200).json({
            success: true,
            data: timetable || { schedule: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] } },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE TIMETABLE =================
export const deleteTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        await Timetable.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Timetable deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
