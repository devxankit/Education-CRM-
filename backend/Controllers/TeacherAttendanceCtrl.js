import TeacherAttendance from "../Models/TeacherAttendanceModel.js";
import StaffAttendance from "../Models/StaffAttendanceModel.js";
import Teacher from "../Models/TeacherModel.js";
import Staff from "../Models/StaffModel.js";
import mongoose from "mongoose";

// ================= MARK TEACHER ATTENDANCE =================
export const markTeacherAttendance = async (req, res) => {
    try {
        const { teacherId, date, status, checkInTime, checkOutTime, remarks, employeeType } = req.body;
        const markedBy = req.user._id; // Staff member marking attendance
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;

        if (!teacherId || !date || !status) {
            return res.status(400).json({
                success: false,
                message: "Employee ID, date, and status are required"
            });
        }

        // Determine if it's a teacher or staff
        const isStaff = employeeType === 'staff';
        
        // Validate employee exists (teacher or staff)
        let employee = null;
        if (isStaff) {
            employee = await Staff.findOne({
                _id: teacherId,
                instituteId
            });
        } else {
            employee = await Teacher.findOne({
                _id: teacherId,
                instituteId,
                branchId
            });
        }

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: isStaff ? "Staff member not found" : "Teacher not found"
            });
        }

        // Parse date to start of day
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        let attendance;
        
        if (isStaff) {
            // Handle staff attendance
            attendance = await StaffAttendance.findOne({
                staffId: teacherId,
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
                attendance = new StaffAttendance({
                    instituteId,
                    branchId: branchId || instituteId,
                    staffId: teacherId,
                    date: attendanceDate,
                    status,
                    checkInTime: checkInTime ? new Date(checkInTime) : undefined,
                    checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
                    remarks,
                    markedBy
                });
                await attendance.save();
            }
        } else {
            // Handle teacher attendance
            attendance = await TeacherAttendance.findOne({
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
        }

        res.status(200).json({
            success: true,
            message: isStaff ? "Staff attendance marked successfully" : "Teacher attendance marked successfully",
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

        // Fetch teacher attendance
        const teacherAttendance = await TeacherAttendance.find({
            instituteId,
            branchId,
            date: attendanceDate
        })
          .populate('teacherId', 'firstName lastName employeeId department')
          .populate('markedBy', 'name')
          .sort({ createdAt: -1 });

        // Fetch staff attendance (branchId might be null for staff, so we check instituteId only)
        const staffAttendance = await StaffAttendance.find({
            instituteId,
            $or: [
                { branchId: branchId },
                { branchId: null }
            ],
            date: attendanceDate
        })
          .populate('staffId', 'name email')
          .populate('markedBy', 'name')
          .sort({ createdAt: -1 });

        // Transform to unified format
        const allAttendance = [
            ...teacherAttendance.map(att => ({
                ...att.toObject(),
                employeeId: att.teacherId?._id || att.teacherId,
                employeeType: 'teacher',
                employee: att.teacherId
            })),
            ...staffAttendance.map(att => ({
                ...att.toObject(),
                teacherId: att.staffId?._id || att.staffId, // Use teacherId field for compatibility
                employeeId: att.staffId?._id || att.staffId,
                employeeType: 'staff',
                employee: att.staffId
            }))
        ];

        res.status(200).json({
            success: true,
            data: allAttendance
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

// ================= GET ALL TEACHERS AND STAFF FOR ATTENDANCE =================
export const getTeachersForAttendance = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;

        // Fetch active teachers
        const teachers = await Teacher.find({
            instituteId,
            branchId,
            status: 'active'
        }).select('firstName lastName employeeId department designation phone email')
          .sort({ firstName: 1 });

        // Fetch active staff members
        const staffMembers = await Staff.find({
            instituteId,
            status: 'active'
        }).populate('roleId', 'name')
          .select('name email phone roleId')
          .sort({ name: 1 });

        // Transform teachers to include type
        const teachersList = teachers.map(teacher => ({
            _id: teacher._id,
            id: teacher._id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            employeeId: teacher.employeeId,
            department: teacher.department || 'N/A',
            designation: teacher.designation || 'Teacher',
            phone: teacher.phone,
            email: teacher.email,
            type: 'teacher',
            name: `${teacher.firstName} ${teacher.lastName}`
        }));

        // Transform staff to match teacher structure
        const staffList = staffMembers.map(staff => {
            // Extract name parts (assuming name is "FirstName LastName")
            const nameParts = (staff.name || '').split(' ');
            const firstName = nameParts[0] || staff.name || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            return {
                _id: staff._id,
                id: staff._id,
                firstName: firstName,
                lastName: lastName,
                employeeId: staff.email?.split('@')[0] || `STAFF-${staff._id.toString().slice(-6)}`,
                department: staff.roleId?.name || 'Staff',
                designation: staff.roleId?.name || 'Staff Member',
                phone: staff.phone || '',
                email: staff.email,
                type: 'staff',
                name: staff.name
            };
        });

        // Combine both lists
        const allEmployees = [...teachersList, ...staffList].sort((a, b) => {
            const nameA = a.name || `${a.firstName} ${a.lastName}`;
            const nameB = b.name || `${b.firstName} ${b.lastName}`;
            return nameA.localeCompare(nameB);
        });

        res.status(200).json({
            success: true,
            data: allEmployees
        });
    } catch (error) {
        console.error("Error fetching teachers and staff:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch teachers and staff"
        });
    }
};
