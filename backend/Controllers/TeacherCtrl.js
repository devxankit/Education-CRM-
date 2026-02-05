import Teacher from "../Models/TeacherModel.js";
import TeacherMapping from "../Models/TeacherMappingModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { generateRandomPassword } from "../Helpers/generateRandomPassword.js";
import { sendLoginCredentialsEmail } from "../Helpers/SendMail.js";
import Section from "../Models/SectionModel.js";
import Subject from "../Models/SubjectModel.js";
import Class from "../Models/ClassModel.js";
import Student from "../Models/StudentModel.js";
import Homework from "../Models/HomeworkModel.js";
import Notice from "../Models/NoticeModel.js";
import Attendance from "../Models/AttendanceModel.js";

// ================= TEACHER DASHBOARD =================
export const getTeacherDashboard = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;

        // 1. Get Teacher Mappings (Classes & Subjects)
        const mappings = await TeacherMapping.find({ teacherId, status: "active" })
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("subjectId", "name");

        const totalClasses = mappings.length;
        const uniqueSubjects = [...new Set(mappings.map(m => m.subjectId?._id?.toString()))].filter(id => id).length;

        // 2. Get Total Students (Unique students in assigned sections)
        const sectionIds = [...new Set(mappings.map(m => m.sectionId?._id))].filter(id => id);
        const totalStudents = await Student.countDocuments({
            sectionId: { $in: sectionIds },
            status: "active"
        });

        // 3. Get Homework Stats
        const totalHomeworks = await Homework.countDocuments({ teacherId });
        const recentHomeworks = await Homework.find({ teacherId })
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("subjectId", "name")
            .sort({ createdAt: -1 })
            .limit(5);

        // 4. Get Recent Notices
        const recentNotices = await Notice.find({
            instituteId,
            status: "PUBLISHED"
        })
            .sort({ publishDate: -1 })
            .limit(5);

        // 5. Class Distribution for Chart
        const classStats = await Promise.all(mappings.map(async (m) => {
            const studentCount = m.sectionId?._id
                ? await Student.countDocuments({ sectionId: m.sectionId._id, status: "active" })
                : 0;
            return {
                className: `${m.classId?.name || "N/A"} - ${m.sectionId?.name || "N/A"}`,
                subjectName: m.subjectId?.name || "N/A",
                studentCount
            };
        }));

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalClasses,
                    totalSubjects: uniqueSubjects,
                    totalStudents,
                    totalHomeworks
                },
                recentHomeworks,
                recentNotices,
                classStats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CREATE TEACHER =================
export const createTeacher = async (req, res) => {
    try {
        const {
            firstName, lastName, email,
            phone, branchId, department,
            designation, roleId, experience, joiningDate,
            academicLevel, teachingStatus, status
        } = req.body;
        let { employeeId } = req.body;
        const instituteId = req.user._id;

        // Generate Random Employee ID if not provided
        if (!employeeId) {
            employeeId = "EMP" + Math.floor(100000 + Math.random() * 900000);
        }

        const existingTeacher = await Teacher.findOne({
            $or: [{ email }, { employeeId }]
        });

        if (existingTeacher) {
            return res.status(400).json({
                success: false,
                message: "Teacher with this email or Employee ID already exists"
            });
        }

        // Generate Random Password
        // const generatedPassword = generateRandomPassword();
        const generatedPassword = "123456"

        const teacher = new Teacher({
            instituteId,
            branchId,
            employeeId,
            firstName,
            lastName,
            email,
            password: generatedPassword,
            phone,
            department,
            designation,
            academicLevel,
            roleId,
            experience,
            joiningDate: joiningDate || new Date(),
            teachingStatus: teachingStatus || 'Active',
            status: status || 'active',
            passwordChangedAt: new Date()
        });

        await teacher.save();

        // Send Email
        const fullName = `${firstName} ${lastName}`;
        sendLoginCredentialsEmail(email, generatedPassword, fullName, "Teacher");

        res.status(201).json({
            success: true,
            message: "Teacher added successfully and credentials sent to email",
            data: {
                _id: teacher._id,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                employeeId: teacher.employeeId
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHERS =================
export const getTeachers = async (req, res) => {
    try {
        const { branchId, department } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (department) query.department = department;

        const teachers = await Teacher.find(query)
            // .populate("roleId", "name")
            .populate("eligibleSubjects", "name code type")
            .sort({ firstName: 1 });

        // Get subject counts for each teacher
        const teachersWithSubjects = await Promise.all(
            teachers.map(async (teacher) => {
                const subjectCount = await TeacherMapping.countDocuments({
                    teacherId: teacher._id,
                    status: 'active'
                });

                return {
                    ...teacher.toObject(),
                    eligibleSubjectsCount: subjectCount
                };
            })
        );

        res.status(200).json({
            success: true,
            data: teachersWithSubjects,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE TEACHER =================
export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent password update via this route
        delete updateData.password;

        const teacher = await Teacher.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.status(200).json({
            success: true,
            message: "Teacher profile updated successfully",
            data: teacher,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= TEACHER LOGIN =================
export const loginTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        if (teacher.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Your account is ${teacher.status}`
            });
        }

        const isMatch = await teacher.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(teacher._id, "Teacher");

        teacher.lastLogin = new Date();
        await teacher.save();

        res.status(200).json({
            success: true,
            message: "Teacher login successful",
            data: {
                _id: teacher._id,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                role: "Teacher"
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHER PROFILE =================
export const getTeacherProfile = async (req, res) => {
    try {
        const teacherId = req.user._id;

        const teacher = await Teacher.findById(teacherId)
            .select("-password")
            .populate({
                path: "branchId",
                select: "name",
            })


        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHER ASSIGNED CLASSES & SUBJECTS =================
export const getTeacherClasses = async (req, res) => {
    try {
        const teacherId = req.user._id;

        // Fetch all mappings for this teacher
        const mappings = await TeacherMapping.find({ teacherId, status: "active" })
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("subjectId", "name code")
            .populate("courseId", "name")
            .populate("academicYearId", "name");

        if (!mappings || mappings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No classes or subjects assigned yet.",
                data: {
                    subjects: [],
                    totalClasses: 0,
                    totalSubjects: 0
                }
            });
        }

        // Group by Subject
        const subjectGroups = {};

        for (const m of mappings) {
            const subjectId = m.subjectId?._id?.toString() || "unknown";

            if (!subjectGroups[subjectId]) {
                subjectGroups[subjectId] = {
                    subjectId: subjectId,
                    subjectName: m.subjectId?.name || "N/A",
                    subjectCode: m.subjectId?.code || "N/A",
                    academicYear: m.academicYearId?.name || "N/A",
                    status: m.status?.toUpperCase() || "ACTIVE",
                    classesCount: 0,
                    totalStudents: 0,
                    classes: []
                };
            }

            const sectionId = m.sectionId?._id;

            // Fetch student count for this section
            const studentCount = sectionId
                ? await Student.countDocuments({ sectionId, status: "active" })
                : 0;

            subjectGroups[subjectId].classes.push({
                classId: m.classId?._id,
                sectionId: sectionId,
                className: m.classId?.name || m.courseId?.name || "N/A",
                sectionName: m.sectionId?.name || "N/A",
                fullClassName: `${m.classId?.name || m.courseId?.name || "N/A"}-${m.sectionId?.name || ""}`,
                studentCount,
                schedule: "Daily" // Day info placeholder
            });

            subjectGroups[subjectId].classesCount += 1;
            subjectGroups[subjectId].totalStudents += studentCount;
        }

        const subjectsArray = Object.values(subjectGroups);

        res.status(200).json({
            success: true,
            data: {
                subjects: subjectsArray,
                totalSubjects: subjectsArray.length,
                totalClasses: mappings.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CLASS STUDENTS =================
export const getClassStudents = async (req, res) => {
    try {
        const { classId, sectionId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        if (!classId || !sectionId) {
            return res.status(400).json({ success: false, message: "Class ID and Section ID are required" });
        }

        const students = await Student.find({
            instituteId,
            classId,
            sectionId,
            status: "active"
        }).select("firstName lastName admissionNo rollNo gender photo");

        res.status(200).json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CREATE HOMEWORK =================
export const createHomework = async (req, res) => {
    try {
        const {
            classId, sectionId, subjectId, title,
            instructions, dueDate, attachments, status,
            academicYearId, branchId
        } = req.body;
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;

        const homework = new Homework({
            instituteId,
            branchId,
            teacherId,
            classId,
            sectionId,
            subjectId,
            title,
            instructions,
            dueDate,
            attachments,
            status: status || "published",
            academicYearId
        });

        await homework.save();

        res.status(201).json({
            success: true,
            message: "Homework created successfully",
            data: homework
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHER HOMEWORKS =================
export const getHomeworks = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const { classId, sectionId, subjectId } = req.query;

        let query = { teacherId };
        if (classId) query.classId = classId;
        if (sectionId) query.sectionId = sectionId;
        if (subjectId) query.subjectId = subjectId;

        const homeworks = await Homework.find(query)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("subjectId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: homeworks
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET HOMEWORK BY ID =================
export const getHomeworkById = async (req, res) => {
    try {
        const { id } = req.params;
        const homework = await Homework.findById(id)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("subjectId", "name")
            .populate("academicYearId", "name");

        if (!homework) {
            return res.status(404).json({ success: false, message: "Homework not found" });
        }

        res.status(200).json({
            success: true,
            data: homework
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE HOMEWORK =================
export const updateHomework = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const homework = await Homework.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!homework) {
            return res.status(404).json({ success: false, message: "Homework not found" });
        }

        res.status(200).json({
            success: true,
            message: "Homework updated successfully",
            data: homework
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE HOMEWORK =================
export const deleteHomework = async (req, res) => {
    try {
        const { id } = req.params;
        const homework = await Homework.findByIdAndDelete(id);

        if (!homework) {
            return res.status(404).json({ success: false, message: "Homework not found" });
        }

        res.status(200).json({
            success: true,
            message: "Homework deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= MARK ATTENDANCE =================
export const markAttendance = async (req, res) => {
    try {
        const {
            classId, sectionId, subjectId, date,
            attendanceData, academicYearId, branchId
        } = req.body;
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;

        // Use start of day for date consistency
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        // RESTRICTION: Teachers can only mark/update attendance for TODAY
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (req.role.toLowerCase() === 'teacher' && attendanceDate.getTime() !== today.getTime()) {
            return res.status(403).json({
                success: false,
                message: "Teachers are only allowed to mark or update attendance for today's date."
            });
        }

        // Check if attendance already exists for this date/class/section/subject
        const query = {
            classId,
            sectionId,
            date: attendanceDate
        };
        if (subjectId) query.subjectId = subjectId;

        let attendance = await Attendance.findOne(query);

        if (attendance) {
            // Update existing attendance
            attendance.attendanceData = attendanceData;
            attendance.teacherId = teacherId;
            await attendance.save();
        } else {
            // Create new record
            attendance = new Attendance({
                instituteId,
                branchId,
                teacherId,
                classId,
                sectionId,
                subjectId,
                date: attendanceDate,
                academicYearId,
                attendanceData,
                status: "Submitted"
            });
            await attendance.save();
        }

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            data: attendance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ATTENDANCE HISTORY =================
export const getAttendanceHistory = async (req, res) => {
    try {
        const { classId, sectionId, subjectId, startDate, endDate } = req.query;
        const teacherId = req.user._id;

        let query = { teacherId };
        if (classId) query.classId = classId;
        if (sectionId) query.sectionId = sectionId;
        if (subjectId) query.subjectId = subjectId;

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const history = await Attendance.find(query)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("subjectId", "name")
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ATTENDANCE BY DATE =================
export const getAttendanceByDate = async (req, res) => {
    try {
        const { classId, sectionId, subjectId, date } = req.query;

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const query = {
            classId,
            sectionId,
            date: attendanceDate
        };
        if (subjectId) query.subjectId = subjectId;

        const attendance = await Attendance.findOne(query)
            .populate("attendanceData.studentId", "firstName lastName admissionNo rollNo photo");

        if (!attendance) {
            return res.status(200).json({
                success: true,
                message: "No attendance record found for this date",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
