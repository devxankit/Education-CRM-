import Teacher from "../Models/TeacherModel.js";
import TeacherMapping from "../Models/TeacherMappingModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { generateRandomPassword } from "../Helpers/generateRandomPassword.js";
import { sendLoginCredentialsEmail, sendTeacherResetOtpEmail } from "../Helpers/SendMail.js";
import Section from "../Models/SectionModel.js";
import Subject from "../Models/SubjectModel.js";
import Class from "../Models/ClassModel.js";
import Student from "../Models/StudentModel.js";
import Homework from "../Models/HomeworkModel.js";
import Notice from "../Models/NoticeModel.js";
import Timetable from "../Models/TimetableModel.js";
import Attendance from "../Models/AttendanceModel.js";
import Exam from "../Models/ExamModel.js";
import ExamResult from "../Models/ExamResultModel.js";
import HomeworkSubmission from "../Models/HomeworkSubmissionModel.js";
import Payroll from "../Models/PayrollModel.js";
import SupportTicket from "../Models/SupportTicketModel.js";
import AcademicYear from "../Models/AcademicYearModel.js";
import ClassCompletion from "../Models/ClassCompletionModel.js";
import LearningMaterial from "../Models/LearningMaterialModel.js";
import { uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";

// ================= GET ACADEMIC YEARS (for teacher's branch) =================
export const getTeacherAcademicYears = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;

        const teacher = await Teacher.findById(teacherId).select("branchId");
        const branchId = teacher?.branchId?._id || teacher?.branchId;

        const query = { instituteId };
        if (branchId) {
            query.$or = [{ branchId }, { branchId: null }];
        }

        const academicYears = await AcademicYear.find(query)
            .select("name startDate endDate status")
            .sort({ startDate: -1 });

        res.status(200).json({
            success: true,
            data: academicYears
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

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

        // 4. Get Recent Notices
        const recentNotices = await Notice.find({
            instituteId,
            status: "PUBLISHED"
        })
            .sort({ publishDate: -1 })
            .limit(5);

        // 5. Get Today's Schedule from Timetable with Completion Status
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = days[new Date().getDay()];
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        const tomorrow = new Date(todayDate);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get timetables for assigned classes (sectionIds already declared above)
        const timetables = await Timetable.find({
            instituteId,
            sectionId: { $in: sectionIds },
            status: "active"
        });

        // Get today's completions
        const completions = await ClassCompletion.find({
            teacherId,
            date: {
                $gte: todayDate,
                $lt: tomorrow
            }
        });

        // Build completion map
        const completionMap = {};
        completions.forEach(comp => {
            const key = `${comp.classId}_${comp.sectionId}_${comp.subjectId}_${comp.day}_${comp.startTime}`;
            completionMap[key] = comp;
        });

        const todayClasses = [];
        timetables.forEach(tt => {
            const dailySchedule = tt.schedule[today] || [];
            dailySchedule.forEach(item => {
                // Find matching mapping
                const mapping = mappings.find(m => 
                    (m.classId?._id || m.classId)?.toString() === tt.classId?.toString() &&
                    (m.sectionId?._id || m.sectionId)?.toString() === tt.sectionId?.toString() &&
                    (m.subjectId?._id || m.subjectId)?.toString() === item.subjectId?.toString() &&
                    (item.teacherId?._id || item.teacherId)?.toString() === teacherId.toString()
                );

                if (mapping) {
                    // Use mapping.subjectId as it's guaranteed to exist and match
                    const subjectId = mapping.subjectId?._id || mapping.subjectId;
                    const key = `${tt.classId}_${tt.sectionId}_${subjectId}_${today}_${item.startTime}`;
                    const completion = completionMap[key];

                    todayClasses.push({
                        id: `${mapping._id}_${today}_${item.startTime}`,
                        classId: tt.classId?._id || tt.classId,
                        sectionId: tt.sectionId?._id || tt.sectionId,
                        subjectId: subjectId, // Use from mapping to ensure it's always present
                        classSection: `${tt.classId?.name || "N/A"} ${tt.sectionId?.name || "N/A"}`,
                        subject: mapping.subjectId?.name || "N/A",
                        time: `${item.startTime} - ${item.endTime}`,
                        room: item.room || "TBD",
                        status: completion ? "Marked" : "Pending",
                        completionId: completion?._id
                    });
                }
            });
        });

        // Sort by start time
        todayClasses.sort((a, b) => {
            const timeA = a.time.split(" - ")[0];
            const timeB = b.time.split(" - ")[0];
            return timeA.localeCompare(timeB);
        });

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalClasses,
                    totalSubjects: uniqueSubjects,
                    totalStudents,
                    totalHomeworks
                },
                recentNotices,
                todayClasses // Replaced classStats with real today's schedule
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
            academicLevel, teachingStatus, status,
            address, documents
        } = req.body;
        let { employeeId } = req.body;
        const instituteId = req.role === 'institute' ? req.user._id : req.user.instituteId;

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

        const teacherData = {
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
            roleId,
            experience,
            joiningDate: joiningDate || new Date(),
            teachingStatus: teachingStatus || 'Active',
            status: status || 'active',
            address,
            documents,
            passwordChangedAt: new Date()
        };
        if (academicLevel && academicLevel.trim()) teacherData.academicLevel = academicLevel;

        const teacher = new Teacher(teacherData);

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

        // Remove empty enum values to avoid validation errors
        if (updateData.academicLevel === '' || updateData.academicLevel === undefined) {
            delete updateData.academicLevel;
        }

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

// ================= TEACHER FORGOT PASSWORD (Send OTP) =================
export const forgotTeacherPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.trim()) {
            return res.status(400).json({ success: false, message: "Please enter your email" });
        }
        const emailLower = email.trim().toLowerCase();
        const teacher = await Teacher.findOne({ email: emailLower });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "No teacher found with this email" });
        }
        if (teacher.status !== 'active') {
            return res.status(403).json({ success: false, message: `Your account is ${teacher.status}` });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await Teacher.findByIdAndUpdate(teacher._id, {
            $set: { resetPasswordOtp: otp, resetPasswordOtpExpires: expiresAt }
        });
        const fullName = `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() || "Teacher";
        const sent = await sendTeacherResetOtpEmail(teacher.email, otp, fullName);
        if (!sent) {
            return res.status(500).json({ success: false, message: "Failed to send OTP. Try again later." });
        }
        res.status(200).json({
            success: true,
            message: "OTP sent to your registered email",
            email: teacher.email.replace(/(.{3}).*(@.*)/, "$1***$2")
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= TEACHER RESET PASSWORD (Verify OTP + set new password) =================
export const resetTeacherPasswordWithOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: "Email, OTP and new password are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }
        const emailLower = email.trim().toLowerCase();
        const teacher = await Teacher.findOne({ email: emailLower });
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }
        if (!teacher.resetPasswordOtp || teacher.resetPasswordOtp !== String(otp).trim()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }
        if (!teacher.resetPasswordOtpExpires || new Date() > teacher.resetPasswordOtpExpires) {
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }
        teacher.password = newPassword;
        teacher.resetPasswordOtp = undefined;
        teacher.resetPasswordOtpExpires = undefined;
        await teacher.save();
        res.status(200).json({ success: true, message: "Password reset successfully. You can now login." });
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
                select: "name phone email",
            })
            .populate({
                path: "instituteId",
                select: "phone email",
            });

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

// ================= UPDATE TEACHER PROFILE (own profile) =================
export const updateTeacherProfile = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const { photo, firstName, lastName, phone } = req.body;

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        if (firstName !== undefined) teacher.firstName = firstName;
        if (lastName !== undefined) teacher.lastName = lastName;
        if (phone !== undefined) teacher.phone = phone;

        if (photo && (typeof photo === 'string' && photo.startsWith('data:image'))) {
            const uploadedUrl = await uploadBase64ToCloudinary(photo, 'teacher_profiles');
            teacher.photo = uploadedUrl;
        }

        await teacher.save();

        const updated = await Teacher.findById(teacherId)
            .select("-password")
            .populate({ path: "branchId", select: "name phone email" })
            .populate({ path: "instituteId", select: "phone email" });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHER ASSIGNED CLASSES & SUBJECTS =================
// Returns: 1) Class Teacher sections (for Attendance)  2) TeacherMapping subject-class (for Homework, Classes)
export const getTeacherClasses = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;

        if (!teacherId) {
            return res.status(200).json({
                success: true,
                message: "No classes assigned.",
                data: { subjects: [], totalClasses: 0, totalSubjects: 0 }
            });
        }

        const subjectsArray = [];
        const seenSectionKeys = new Set();
        let totalClassesCount = 0;

        // 1. Class Teacher sections (Section.teacherId) - for Attendance
        const classTeacherSections = await Section.find({
            instituteId,
            teacherId,
            status: "active"
        })
            .populate("classId", "name capacity")
            .populate("branchId", "name");

        const ctClasses = [];
        for (const sec of classTeacherSections) {
            const classId = sec.classId?._id;
            const sectionId = sec._id;
            if (!classId || seenSectionKeys.has(sectionId.toString())) continue;
            seenSectionKeys.add(sectionId.toString());

            const studentCount = await Student.countDocuments({ sectionId, status: "active" });
            ctClasses.push({
                classId,
                sectionId,
                className: sec.classId?.name || "N/A",
                sectionName: sec.name,
                fullClassName: `${sec.classId?.name || "N/A"}-${sec.name}`,
                studentCount,
                schedule: "Daily"
            });
        }
        if (ctClasses.length > 0) {
            subjectsArray.push({
                subjectId: null,
                subjectName: "Class Teacher",
                subjectCode: "CT",
                academicYear: "N/A",
                status: "ACTIVE",
                classesCount: ctClasses.length,
                totalStudents: ctClasses.reduce((s, c) => s + (c.studentCount || 0), 0),
                classes: ctClasses
            });
            totalClassesCount += ctClasses.length;
        }

        // 2. TeacherMapping (subject-wise) - for Homework, assigned subjects like Maths, Physics
        const mappings = await TeacherMapping.find({ teacherId, status: "active" })
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("subjectId", "name code")
            .populate("courseId", "name")
            .populate("academicYearId", "name");

        const validMappings = mappings.filter(m => m.sectionId && (m.classId || m.courseId));
        const subjectGroups = {};

        for (const m of validMappings) {
            const subjectId = m.subjectId?._id?.toString() || "unknown";
            if (!subjectGroups[subjectId]) {
                subjectGroups[subjectId] = {
                    subjectId,
                    subjectName: m.subjectId?.name || "N/A",
                    subjectCode: m.subjectId?.code || "N/A",
                    academicYear: m.academicYearId?.name || "N/A",
                    status: "ACTIVE",
                    classesCount: 0,
                    totalStudents: 0,
                    classes: []
                };
            }

            const sectionId = m.sectionId?._id;
            const studentCount = sectionId
                ? await Student.countDocuments({ sectionId, status: "active" })
                : 0;

            subjectGroups[subjectId].classes.push({
                classId: m.classId?._id,
                sectionId,
                className: m.classId?.name || m.courseId?.name || "N/A",
                sectionName: m.sectionId?.name || "N/A",
                fullClassName: `${m.classId?.name || m.courseId?.name || "N/A"}-${m.sectionId?.name || ""}`,
                studentCount,
                schedule: "Daily"
            });
            subjectGroups[subjectId].classesCount += 1;
            subjectGroups[subjectId].totalStudents += studentCount;
        }

        const mappingSubjects = Object.values(subjectGroups);
        subjectsArray.push(...mappingSubjects);
        totalClassesCount += mappingSubjects.reduce((s, sub) => s + sub.classesCount, 0);

        res.status(200).json({
            success: true,
            data: {
                subjects: subjectsArray,
                totalSubjects: subjectsArray.length,
                totalClasses: totalClassesCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENT DETAIL (Profile + Attendance History) =================
export const getStudentDetail = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { classId, sectionId } = req.query;
        const teacherId = req.user._id;

        if (!studentId) {
            return res.status(400).json({ success: false, message: "Student ID is required" });
        }

        const student = await Student.findById(studentId)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("branchId", "name")
            .select("firstName lastName middleName admissionNo rollNo gender dob bloodGroup address city state pincode admissionDate documents status parentId classId sectionId branchId");

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const sClassId = student.classId?._id?.toString() || student.classId?.toString();
        const sSectionId = student.sectionId?._id?.toString() || student.sectionId?.toString();

        // Use query params if provided (from ClassDetail context), else use student's class/section
        const checkClassId = classId || sClassId;
        const checkSectionId = sectionId || sSectionId;

        if (!checkClassId || !checkSectionId) {
            return res.status(400).json({ success: false, message: "Student class/section not found" });
        }

        const section = await Section.findOne({ _id: checkSectionId });
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }
        // Only Class Teacher can view student details (not Subject Teacher)
        const isClassTeacher = section.teacherId?.toString() === teacherId.toString();
        if (!isClassTeacher) {
            return res.status(403).json({ success: false, message: "Only Class Teacher can view student details for this class" });
        }
        // Verify student belongs to this section
        if (sClassId !== checkClassId || sSectionId !== checkSectionId) {
            return res.status(403).json({ success: false, message: "Student does not belong to this class" });
        }

        // Fetch attendance history for this student (class+section, filter by student)
        const attendanceRecords = await Attendance.find({
            classId: checkClassId,
            sectionId: checkSectionId,
            "attendanceData.studentId": studentId
        })
            .populate("subjectId", "name")
            .sort({ date: -1 })
            .limit(90); // Last ~3 months

        const attendanceHistory = attendanceRecords.map((rec) => {
            const entry = rec.attendanceData.find(e => e.studentId?.toString() === studentId);
            return {
                _id: rec._id,
                date: rec.date,
                status: entry?.status || "Present",
                subjectId: rec.subjectId?._id,
                subjectName: rec.subjectId?.name || "General",
                remarks: entry?.remarks
            };
        });

        const photoUrl = student.documents?.photo?.url || null;

        res.status(200).json({
            success: true,
            data: {
                profile: {
                    _id: student._id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    middleName: student.middleName,
                    admissionNo: student.admissionNo,
                    rollNo: student.rollNo,
                    gender: student.gender,
                    dob: student.dob,
                    bloodGroup: student.bloodGroup,
                    address: student.address,
                    city: student.city,
                    state: student.state,
                    pincode: student.pincode,
                    admissionDate: student.admissionDate,
                    status: student.status,
                    className: student.classId?.name,
                    sectionName: student.sectionId?.name,
                    branchName: student.branchId?.name,
                    photo: photoUrl
                },
                attendanceHistory
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
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;

        if (!classId || !sectionId) {
            return res.status(400).json({ success: false, message: "Class ID and Section ID are required" });
        }

        // Allow if teacher is Class Teacher (Section.teacherId) OR assigned via TeacherMapping (subject teacher)
        const section = await Section.findOne({ _id: sectionId });
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found." });
        }
        const isClassTeacher = section.teacherId?.toString() === teacherId.toString();
        const isSubjectTeacher = await TeacherMapping.exists({ teacherId, sectionId, status: "active" });
        if (!isClassTeacher && !isSubjectTeacher) {
            return res.status(403).json({ success: false, message: "You are not assigned to this section." });
        }

        const students = await Student.find({
            instituteId,
            classId,
            sectionId,
            status: "active"
        }).select("firstName lastName admissionNo rollNo gender documents");

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

        let uploadedAttachments = [];
        if (attachments && attachments.length > 0) {
            for (const att of attachments) {
                if (att.base64) {
                    try {
                        const url = await uploadBase64ToCloudinary(att.base64, `teachers/homework/${instituteId}`);
                        uploadedAttachments.push({ name: att.name || "attachment", url });
                    } catch (uploadErr) {
                        console.error("Homework attachment upload error:", uploadErr);
                    }
                } else if (att.url) {
                    uploadedAttachments.push({ name: att.name || "attachment", url: att.url });
                }
            }
        }

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
            attachments: uploadedAttachments,
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

        // Add counts for each homework
        const homeworksWithCounts = await Promise.all(homeworks.map(async (hw) => {
            const submissionCount = await HomeworkSubmission.countDocuments({ homeworkId: hw._id });
            const classId = hw.classId?._id || hw.classId;
            const sectionId = hw.sectionId?._id || hw.sectionId;
            const totalStudents = await Student.countDocuments({
                classId,
                sectionId,
                status: 'active'
            });
            return {
                ...hw.toObject(),
                submissionCount,
                totalStudents
            };
        }));

        res.status(200).json({
            success: true,
            data: homeworksWithCounts
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

        // Get submission count
        const submissionCount = await HomeworkSubmission.countDocuments({ homeworkId: id });

        // Get total students in the class/section
        const totalStudents = await Student.countDocuments({
            classId: homework.classId,
            sectionId: homework.sectionId,
            status: 'active'
        });

        res.status(200).json({
            success: true,
            data: {
                ...homework.toObject(),
                submissionCount,
                totalStudents
            }
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

        // ONLY Class Teacher can mark attendance (not Subject Teacher)
        const section = await Section.findOne({ _id: sectionId });
        if (!section) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }
        const isClassTeacher = section.teacherId?.toString() === teacherId.toString();
        if (!isClassTeacher) {
            return res.status(403).json({
                success: false,
                message: "Only Class Teacher can mark attendance for this class."
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

// ================= GET TEACHER EXAMS =================
export const getTeacherExams = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;

        // Get teacher's assigned classes
        const mappings = await TeacherMapping.find({ teacherId, status: "active" });
        const classIds = [...new Set(mappings.map(m => m.classId?.toString()).filter(id => id))];

        if (classIds.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: "No classes assigned"
            });
        }

        // Find exams that include teacher's classes
        const exams = await Exam.find({
            instituteId,
            classes: { $in: classIds },
            status: { $in: ["Published", "Completed"] }
        })
            .populate("classes", "name")
            .populate("subjects.subjectId", "name code")
            .sort({ startDate: -1 });

        // Format response - only include exams where teacher has at least one assigned subject
        const formattedExams = exams.map(exam => {
            // Filter subjects: teacher must be assigned to this subject FOR one of the exam's classes
            const examClassIds = (exam.classes || []).map(c => c._id?.toString()).filter(id => id);

            const relevantSubjects = (exam.subjects || []).filter(s => {
                const subId = s.subjectId?._id ? s.subjectId._id.toString() : s.subjectId?.toString();
                if (!subId) return false;
                return mappings.some(m => {
                    const mSubId = m.subjectId?.toString();
                    const mClassId = m.classId?.toString();
                    return mSubId === subId && mClassId && examClassIds.includes(mClassId);
                });
            });

            if (relevantSubjects.length === 0) return null;

            return {
                _id: exam._id,
                examName: exam.examName,
                examType: exam.examType,
                startDate: exam.startDate,
                endDate: exam.endDate,
                description: exam.description,
                status: exam.status,
                classes: exam.classes,
                subjects: relevantSubjects.map(s => ({
                    subjectId: s.subjectId?._id,
                    subjectName: s.subjectId?.name,
                    date: s.date,
                    maxMarks: s.maxMarks,
                    passingMarks: s.passingMarks
                }))
            };
        }).filter(Boolean);

        res.status(200).json({
            success: true,
            data: formattedExams
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET EXAM BY ID (teacher - only if assigned to at least one subject) =================
export const getExamById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user._id;

        const exam = await Exam.findById(id)
            .populate("classes", "name")
            .populate("subjects.subjectId", "name code")
            .populate("branchId", "name")
            .populate("academicYearId", "name");

        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // Filter subjects: teacher must be assigned to this subject FOR one of the exam's classes
        const mappings = await TeacherMapping.find({ teacherId, status: "active" });
        const examClassIds = (exam.classes || []).map(c => c._id?.toString()).filter(id => id);

        const relevantSubjects = (exam.subjects || []).filter(s => {
            const subId = s.subjectId?._id ? s.subjectId._id.toString() : s.subjectId?.toString();
            if (!subId) return false;
            return mappings.some(m => {
                const mSubId = m.subjectId?.toString();
                const mClassId = m.classId?.toString();
                return mSubId === subId && mClassId && examClassIds.includes(mClassId);
            });
        });

        if (relevantSubjects.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to any subject in this exam."
            });
        }

        // Return exam with only assigned subjects (same shape as getTeacherExams)
        const data = {
            _id: exam._id,
            examName: exam.examName,
            examType: exam.examType,
            startDate: exam.startDate,
            endDate: exam.endDate,
            description: exam.description,
            status: exam.status,
            classes: exam.classes,
            branchId: exam.branchId,
            academicYearId: exam.academicYearId,
            subjects: relevantSubjects.map(s => ({
                subjectId: s.subjectId?._id,
                subjectName: s.subjectId?.name,
                subjectCode: s.subjectId?.code,
                date: s.date,
                maxMarks: s.maxMarks,
                passingMarks: s.passingMarks
            }))
        };

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET EXAM STUDENTS (for marks entry) =================
export const getExamStudents = async (req, res) => {
    try {
        const { examId, classId, subjectId, sectionId } = req.query;
        const teacherId = req.user._id;

        if (!examId || !classId || !subjectId) {
            return res.status(400).json({
                success: false,
                message: "examId, classId, and subjectId are required"
            });
        }

        // CRITICAL: Verify teacher is assigned to this subject for this class/section
        const assignmentQuery = {
            teacherId,
            classId,
            subjectId,
            status: "active"
        };
        
        // If sectionId is provided, use it; otherwise check any section
        if (sectionId) {
            assignmentQuery.sectionId = sectionId;
        }
        
        const isAssigned = await TeacherMapping.findOne(assignmentQuery);

        if (!isAssigned) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to teach this subject for this class. Only assigned teachers can view/enter marks."
            });
        }

        // Get students in the class/section
        const studentQuery = { classId, status: "active" };
        if (sectionId) {
            studentQuery.sectionId = sectionId;
        }
        const students = await Student.find(studentQuery)
            .select("firstName lastName admissionNo rollNo gender photo sectionId");

        // Get existing results for these students in this exam/subject
        const existingResults = await ExamResult.find({
            examId,
            studentId: { $in: students.map(s => s._id) }
        });

        // Map students with their marks if already entered
        const studentsWithMarks = students.map(student => {
            const result = existingResults.find(r =>
                r.studentId.toString() === student._id.toString()
            );
            const subjectResult = result?.results?.find(r =>
                r.subjectId?.toString() === subjectId
            );

            return {
                _id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                admissionNo: student.admissionNo,
                rollNo: student.rollNo,
                gender: student.gender,
                photo: student.photo,
                marksObtained: subjectResult?.marksObtained ?? null,
                status: subjectResult?.status ?? null,
                remarks: subjectResult?.remarks ?? ""
            };
        });

        res.status(200).json({
            success: true,
            data: studentsWithMarks
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= SUBMIT EXAM MARKS =================
export const submitMarks = async (req, res) => {
    try {
        const { examId, classId, subjectId, marksData, maxMarks, passingMarks, sectionId } = req.body;
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;

        if (!examId || !classId || !subjectId || !marksData || !Array.isArray(marksData)) {
            return res.status(400).json({
                success: false,
                message: "examId, classId, subjectId, and marksData are required"
            });
        }

        // CRITICAL: Verify teacher is assigned to this subject for this class/section
        const assignmentQuery = {
            teacherId,
            classId,
            subjectId,
            status: "active"
        };
        
        // If sectionId is provided, use it; otherwise check any section
        if (sectionId) {
            assignmentQuery.sectionId = sectionId;
        }
        
        const isAssigned = await TeacherMapping.findOne(assignmentQuery);

        if (!isAssigned) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to teach this subject for this class. Only assigned teachers can enter marks."
            });
        }

        const results = [];

        for (const entry of marksData) {
            const { studentId, marksObtained, status, remarks } = entry;

            // Determine pass/fail
            const entryStatus = status || (marksObtained >= passingMarks ? "Pass" : "Fail");

            // Calculate grade (simple grading)
            let grade = "F";
            const percentage = (marksObtained / maxMarks) * 100;
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B+";
            else if (percentage >= 60) grade = "B";
            else if (percentage >= 50) grade = "C";
            else if (percentage >= 40) grade = "D";

            // Find or create exam result for this student
            let examResult = await ExamResult.findOne({ examId, studentId });

            if (examResult) {
                // Update existing result
                const existingSubjectIndex = examResult.results.findIndex(
                    r => r.subjectId?.toString() === subjectId
                );

                if (existingSubjectIndex > -1) {
                    examResult.results[existingSubjectIndex] = {
                        subjectId,
                        marksObtained,
                        totalMarks: maxMarks,
                        grade,
                        remarks: remarks || "",
                        status: entryStatus
                    };
                } else {
                    examResult.results.push({
                        subjectId,
                        marksObtained,
                        totalMarks: maxMarks,
                        grade,
                        remarks: remarks || "",
                        status: entryStatus
                    });
                }

                // Recalculate totals
                examResult.totalMarksObtained = examResult.results.reduce((sum, r) => sum + (r.marksObtained || 0), 0);
                examResult.totalMaxMarks = examResult.results.reduce((sum, r) => sum + (r.totalMarks || 0), 0);
                examResult.percentage = (examResult.totalMarksObtained / examResult.totalMaxMarks) * 100;

                await examResult.save();
                results.push(examResult);
            } else {
                // Create new result
                examResult = new ExamResult({
                    instituteId,
                    branchId,
                    examId,
                    studentId,
                    results: [{
                        subjectId,
                        marksObtained,
                        totalMarks: maxMarks,
                        grade,
                        remarks: remarks || "",
                        status: entryStatus
                    }],
                    totalMarksObtained: marksObtained,
                    totalMaxMarks: maxMarks,
                    percentage: (marksObtained / maxMarks) * 100
                });

                await examResult.save();
                results.push(examResult);
            }
        }

        res.status(200).json({
            success: true,
            message: "Marks submitted successfully",
            data: {
                count: results.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET HOMEWORK SUBMISSIONS =================
export const getHomeworkSubmissions = async (req, res) => {
    try {
        const { homeworkId } = req.params;

        const submissions = await HomeworkSubmission.find({ homeworkId })
            .populate("studentId", "firstName lastName admissionNo rollNo photo")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: submissions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GRADE SUBMISSION =================
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks, feedback } = req.body;
        const teacherId = req.user._id;

        const submission = await HomeworkSubmission.findByIdAndUpdate(
            submissionId,
            {
                marks,
                feedback,
                status: "Graded",
                gradedBy: teacherId,
                gradedAt: new Date()
            },
            { new: true }
        ).populate("studentId", "firstName lastName admissionNo rollNo photo");

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        res.status(200).json({
            success: true,
            message: "Submission graded successfully",
            data: submission
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHER ANALYTICS =================
export const getTeacherAnalytics = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;

        // 1. Get Teacher Mappings
        const mappings = await TeacherMapping.find({ teacherId, status: "active" });
        const classIds = mappings.map(m => m.classId).filter(Boolean);
        const uniqueClassIds = [...new Set(classIds.map(id => id.toString()))];

        // 2. Attendance Stats (last 7 days average)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setHours(0, 0, 0, 0);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Simple aggregation for attendance
        const attendanceRecords = await Attendance.find({
            instituteId,
            classId: { $in: uniqueClassIds },
            date: { $gte: sevenDaysAgo }
        });

        // Calculate avg attendance per day
        const dailyStats = {};
        attendanceRecords.forEach(record => {
            const arr = record.attendanceData || [];
            const dateStr = record.date.toISOString().split('T')[0];
            const presentCount = arr.filter(s => s.status === 'Present' || s.status === 'Late').length;
            const totalCount = arr.length;
            const percentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

            if (!dailyStats[dateStr]) dailyStats[dateStr] = [];
            dailyStats[dateStr].push(percentage);
        });

        const attendanceTrend = Object.keys(dailyStats).map(date => ({
            date,
            avgAttendance: Math.round(dailyStats[date].reduce((a, b) => a + b, 0) / dailyStats[date].length)
        })).sort((a, b) => a.date.localeCompare(b.date));

        // 3. Homework Stats
        const totalHomeworks = await Homework.countDocuments({ teacherId });
        const recentHomeworks = await Homework.find({ teacherId }).limit(5).sort({ createdAt: -1 });

        const formattedHomeworks = [];
        for (const hw of recentHomeworks) {
            const submissionCount = await HomeworkSubmission.countDocuments({ homeworkId: hw._id });
            formattedHomeworks.push({
                ...hw._doc,
                submissionCount
            });
        }

        // 4. Exam Performance
        const recentExams = await Exam.find({ classes: { $in: uniqueClassIds } }).limit(2).sort({ startDate: -1 });
        const examPerformance = [];
        for (const exam of recentExams) {
            const results = await ExamResult.find({ examId: exam._id });
            const avgPercentage = results.length > 0
                ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length
                : 0;

            examPerformance.push({
                examName: exam.examName,
                avgPercentage: Math.round(avgPercentage)
            });
        }

        res.status(200).json({
            success: true,
            data: {
                attendanceTrend,
                homeworkStats: {
                    total: totalHomeworks,
                    recent: formattedHomeworks
                },
                examPerformance
            }
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHER PAYROLL HISTORY =================
export const getTeacherPayrollHistory = async (req, res) => {
    try {
        const teacherId = req.user._id;

        const payrolls = await Payroll.find({
            employeeId: teacherId,
            employeeType: "teacher",
            status: { $ne: "cancelled" }
        })
            .sort({ year: -1, month: -1 });

        res.status(200).json({
            success: true,
            data: payrolls
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= MARK CLASS COMPLETION =================
export const markClassCompletion = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;
        const {
            classId,
            sectionId,
            courseId,
            subjectId,
            day,
            startTime,
            endTime,
            room,
            date,
            status = "Completed",
            actualStartTime,
            actualEndTime,
            topicsCovered,
            remarks,
            totalStudents,
            presentStudents,
            absentStudents,
            academicYearId
        } = req.body;

        // Validation
        if (!subjectId || !day || !startTime || !endTime || !date) {
            return res.status(400).json({
                success: false,
                message: "subjectId, day, startTime, endTime, and date are required"
            });
        }

        // Verify teacher is assigned to this class/subject
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        const branchId = teacher.branchId?._id || teacher.branchId;

        // Get academicYearId from TeacherMapping or use provided one
        let finalAcademicYearId = academicYearId;
        
        // Check if teacher is assigned via TeacherMapping and get academicYearId
        const mappingQuery = {
            teacherId,
            subjectId,
            status: "active"
        };
        
        if (sectionId) {
            mappingQuery.sectionId = sectionId;
            if (classId) mappingQuery.classId = classId;
        } else if (courseId) {
            mappingQuery.courseId = courseId;
        }
        
        const mapping = await TeacherMapping.findOne(mappingQuery).select("academicYearId");
        
        if (!mapping) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to teach this class/subject"
            });
        }
        
        // Use academicYearId from mapping if not provided
        if (!finalAcademicYearId && mapping.academicYearId) {
            finalAcademicYearId = mapping.academicYearId?._id || mapping.academicYearId;
        }
        
        // Fallback to teacher's academicYearId if still not found
        if (!finalAcademicYearId) {
            finalAcademicYearId = teacher.academicYearId?._id || teacher.academicYearId;
        }
        
        // Final validation - academicYearId is required
        if (!finalAcademicYearId) {
            return res.status(400).json({
                success: false,
                message: "Academic Year ID is required. Please ensure you are assigned to a class with an academic year."
            });
        }

        // Check for duplicate entry
        const existing = await ClassCompletion.findOne({
            teacherId,
            classId,
            sectionId,
            subjectId,
            day,
            date: new Date(date),
            startTime
        });

        if (existing) {
            // Update existing entry
            existing.status = status;
            existing.actualStartTime = actualStartTime || existing.actualStartTime;
            existing.actualEndTime = actualEndTime || existing.actualEndTime;
            existing.topicsCovered = topicsCovered || existing.topicsCovered;
            existing.remarks = remarks || existing.remarks;
            existing.totalStudents = totalStudents || existing.totalStudents;
            existing.presentStudents = presentStudents || existing.presentStudents;
            existing.absentStudents = absentStudents || existing.absentStudents;
            await existing.save();

            return res.status(200).json({
                success: true,
                message: "Class completion updated successfully",
                data: existing
            });
        }

        // Create new entry
        const completion = new ClassCompletion({
            instituteId,
            branchId,
            academicYearId: finalAcademicYearId,
            teacherId,
            classId,
            sectionId,
            courseId,
            subjectId,
            day,
            startTime,
            endTime,
            room,
            date: new Date(date),
            status,
            actualStartTime,
            actualEndTime,
            topicsCovered,
            remarks,
            totalStudents: totalStudents || 0,
            presentStudents: presentStudents || 0,
            absentStudents: absentStudents || 0
        });

        await completion.save();

        res.status(201).json({
            success: true,
            message: "Class completion marked successfully",
            data: completion
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CLASS COMPLETIONS =================
export const getClassCompletions = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const { startDate, endDate, classId, sectionId, subjectId } = req.query;

        const query = { teacherId };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        if (classId) query.classId = classId;
        if (sectionId) query.sectionId = sectionId;
        if (subjectId) query.subjectId = subjectId;

        const completions = await ClassCompletion.find(query)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("subjectId", "name code")
            .populate("courseId", "name code")
            .sort({ date: -1, startTime: 1 });

        res.status(200).json({
            success: true,
            data: completions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TODAY'S CLASSES WITH COMPLETION STATUS =================
export const getTodayClassesWithCompletion = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get teacher's assigned classes
        const mappings = await TeacherMapping.find({
            teacherId,
            status: "active"
        }).populate("classId", "name")
          .populate("sectionId", "name")
          .populate("subjectId", "name code")
          .populate("academicYearId", "name");

        if (mappings.length === 0) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        // Get timetables for assigned classes
        const sectionIds = mappings.map(m => m.sectionId?._id || m.sectionId).filter(Boolean);
        const timetables = await Timetable.find({
            instituteId,
            sectionId: { $in: sectionIds },
            status: "active"
        });

        // Get today's day name
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const todayDay = dayNames[new Date().getDay()];

        // Get today's completions
        const completions = await ClassCompletion.find({
            teacherId,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        // Build completion map for quick lookup
        const completionMap = {};
        completions.forEach(comp => {
            const key = `${comp.classId}_${comp.sectionId}_${comp.subjectId}_${comp.day}_${comp.startTime}`;
            completionMap[key] = comp;
        });

        // Build today's classes list
        const todayClasses = [];
        timetables.forEach(timetable => {
            const daySchedule = timetable.schedule[todayDay] || [];
            daySchedule.forEach(period => {
                // Find matching mapping
                const mapping = mappings.find(m => 
                    (m.classId?._id || m.classId)?.toString() === timetable.classId?.toString() &&
                    (m.sectionId?._id || m.sectionId)?.toString() === timetable.sectionId?.toString() &&
                    (m.subjectId?._id || m.subjectId)?.toString() === period.subjectId?.toString() &&
                    (period.teacherId?._id || period.teacherId)?.toString() === teacherId.toString()
                );

                if (mapping) {
                    // Use mapping.subjectId as it's guaranteed to exist and match
                    const subjectId = mapping.subjectId?._id || mapping.subjectId;
                    const key = `${timetable.classId}_${timetable.sectionId}_${subjectId}_${todayDay}_${period.startTime}`;
                    const completion = completionMap[key];

                    todayClasses.push({
                        id: `${mapping._id}_${todayDay}_${period.startTime}`,
                        classId: timetable.classId?._id || timetable.classId,
                        sectionId: timetable.sectionId?._id || timetable.sectionId,
                        subjectId: subjectId, // Use from mapping to ensure it's always present
                        className: timetable.classId?.name || mapping.classId?.name,
                        sectionName: timetable.sectionId?.name || mapping.sectionId?.name,
                        subject: mapping.subjectId?.name || "N/A",
                        classSection: `${timetable.classId?.name || mapping.classId?.name} ${timetable.sectionId?.name || mapping.sectionId?.name}`,
                        time: `${period.startTime} - ${period.endTime}`,
                        room: period.room || "TBD",
                        status: completion ? "Marked" : "Pending",
                        completionId: completion?._id,
                        topicsCovered: completion?.topicsCovered,
                        remarks: completion?.remarks
                    });
                }
            });
        });

        // Sort by time
        todayClasses.sort((a, b) => {
            const timeA = a.time.split(" - ")[0];
            const timeB = b.time.split(" - ")[0];
            return timeA.localeCompare(timeB);
        });

        res.status(200).json({
            success: true,
            data: todayClasses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TEACHER LEARNING MATERIALS (Resources) =================
export const getTeacherLearningMaterials = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const { type, subjectId, classId } = req.query;

        const query = { teacherId };

        if (type) query.type = type;
        if (subjectId) query.subjectId = subjectId;
        if (classId) query.classId = classId;

        const materials = await LearningMaterial.find(query)
            .populate("subjectId", "name code")
            .populate("classId", "name")
            .populate("sectionId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: materials
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
