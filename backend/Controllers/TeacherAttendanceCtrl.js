import TeacherAttendance from "../Models/TeacherAttendanceModel.js";
import Teacher from "../Models/TeacherModel.js";
import mongoose from "mongoose";

// ================= MARK TEACHER ATTENDANCE =================
export const markTeacherAttendance = async (req, res) => {
    try {
        const { teacherId, date, status, checkInTime, checkOutTime, remarks } = req.body;
        const markedBy = req.user._id; // Staff member marking attendance
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;

        if (!teacherId || !date || !status) {
            return res.status(400).json({
                success: false,
                message: "Teacher ID, date, and status are required"
            });
        }

        // Validate teacher exists
        const teacher = await Teacher.findOne({
            _id: teacherId,
            instituteId,
            branchId
        });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        // Parse date to start of day
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        // Check if attendance already exists
        let attendance = await TeacherAttendance.findOne({
            teacherId,
            date: attendanceDate
        });

        if (attendance) {
            // Update existing attendance
            attendance.status = status;
            attendance.checkInTime = checkInTime ? new Date(checkInTime) : attendance.checkInTime;
            attendance.checkOutTime = checkOutTime ? new Date(checkOutTime) : attendance.checkOutTime;
            attendance.remarks = remarks || attendance.remarks;
            attendance.markedBy = markedBy;
            await attendance.save();
        } else {
            // Create new attendance record
            attendance = new TeacherAttendance({
                instituteId,
                branchId,
                teacherId,
                date: attendanceDate,
                status,
                checkInTime: checkInTime ? new Date(checkInTime) : undefined,
                checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
                remarks,
                markedBy
            });
            await attendance.save();
        }

        res.status(200).json({
            success: true,
            message: "Teacher attendance marked successfully",
            data: attendance
        });
    } catch (error) {
        console.error("Error marking teacher attendance:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to mark teacher attendance"
        });
    }
};

// ================= GET TEACHER ATTENDANCE BY DATE =================
export const getTeacherAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required"
            });
        }

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const attendance = await TeacherAttendance.find({
            instituteId,
            branchId,
            date: attendanceDate
        }).populate('teacherId', 'firstName lastName employeeId department')
          .populate('markedBy', 'name')
          .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        console.error("Error fetching teacher attendance:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch teacher attendance"
        });
    }
};

// ================= GET TEACHER ATTENDANCE HISTORY =================
export const getTeacherAttendanceHistory = async (req, res) => {
    try {
        const { teacherId, startDate, endDate } = req.query;
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;

        const query = { instituteId, branchId };

        if (teacherId) {
            query.teacherId = teacherId;
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        const attendance = await TeacherAttendance.find(query)
            .populate('teacherId', 'firstName lastName employeeId department')
            .populate('markedBy', 'name')
            .sort({ date: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        console.error("Error fetching teacher attendance history:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch teacher attendance history"
        });
    }
};

// ================= GET ALL TEACHERS FOR ATTENDANCE =================
export const getTeachersForAttendance = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;

        const teachers = await Teacher.find({
            instituteId,
            branchId,
            status: 'active'
        }).select('firstName lastName employeeId department designation phone email')
          .sort({ firstName: 1 });

        res.status(200).json({
            success: true,
            data: teachers
        });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch teachers"
        });
    }
};
