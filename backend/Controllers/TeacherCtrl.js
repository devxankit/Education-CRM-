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
import Exam from "../Models/ExamModel.js";
import ExamResult from "../Models/ExamResultModel.js";
import HomeworkSubmission from "../Models/HomeworkSubmissionModel.js";

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

        // Format response
        const formattedExams = exams.map(exam => {
            // Filter subjects to only those the teacher teaches
            const teacherSubjectIds = mappings.map(m => m.subjectId?.toString());
            const relevantSubjects = exam.subjects.filter(s =>
                teacherSubjectIds.includes(s.subjectId?._id?.toString())
            );

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
        });

        res.status(200).json({
            success: true,
            data: formattedExams
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET EXAM BY ID =================
export const getExamById = async (req, res) => {
    try {
        const { id } = req.params;

        const exam = await Exam.findById(id)
            .populate("classes", "name")
            .populate("subjects.subjectId", "name code")
            .populate("branchId", "name")
            .populate("academicYearId", "name");

        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        res.status(200).json({
            success: true,
            data: exam
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET EXAM STUDENTS (for marks entry) =================
export const getExamStudents = async (req, res) => {
    try {
        const { examId, classId, subjectId } = req.query;

        if (!examId || !classId || !subjectId) {
            return res.status(400).json({
                success: false,
                message: "examId, classId, and subjectId are required"
            });
        }

        // Get students in the class
        const students = await Student.find({
            classId,
            status: "active"
        }).select("firstName lastName admissionNo rollNo gender photo sectionId");

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
        const { examId, classId, subjectId, marksData, maxMarks, passingMarks } = req.body;
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;

        if (!examId || !classId || !subjectId || !marksData || !Array.isArray(marksData)) {
            return res.status(400).json({
                success: false,
                message: "examId, classId, subjectId, and marksData are required"
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
        );

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
        const classIds = mappings.map(m => m.classId);
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
            const dateStr = record.date.toISOString().split('T')[0];
            const presentCount = record.students.filter(s => s.status === 'Present').length;
            const totalCount = record.students.length;
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
