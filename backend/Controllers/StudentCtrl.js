import Student from "../Models/StudentModel.js";
import Sequence from "../Models/SequenceModel.js";
import TeacherMapping from "../Models/TeacherMappingModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";
import Notice from "../Models/NoticeModel.js";
import Homework from "../Models/HomeworkModel.js";
import Attendance from "../Models/AttendanceModel.js";
import Exam from "../Models/ExamModel.js";
import ExamResult from "../Models/ExamResultModel.js";
import FeeStructure from "../Models/FeeStructureModel.js";
import FeePayment from "../Models/FeePaymentModel.js";

// ================= STUDENT DASHBOARD =================
export const getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user._id;
        const instituteId = req.user.instituteId || req.user._id;

        // 1. Get Student Data (with class and section)
        const student = await Student.findById(studentId)
            .populate("classId", "name level")
            .populate("sectionId", "name")
            .populate("branchId", "name");

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const { classId, sectionId } = student;

        // 2. Get Homework for this student's class/section
        const homework = await Homework.find({
            classId,
            sectionId,
            status: "published"
        })
            .populate("subjectId", "name code")
            .populate("teacherId", "firstName lastName")
            .sort({ createdAt: -1 })
            .limit(5);

        // 3. Get Recent Notices
        const notices = await Notice.find({
            instituteId,
            status: "PUBLISHED",
            $or: [
                { audiences: "All Students" },
                { targetClasses: classId },
                { targetSections: sectionId }
            ]
        })
            .sort({ publishDate: -1 })
            .limit(5);

        // 4. Attendance Stats (Current Month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const attendanceRecords = await Attendance.find({
            classId,
            sectionId,
            date: { $gte: startOfMonth },
            "attendanceData.studentId": studentId
        });

        let attendanceStats = {
            total: attendanceRecords.length,
            present: 0,
            absent: 0,
            late: 0,
            halfDay: 0
        };

        attendanceRecords.forEach(record => {
            const studentEntry = record.attendanceData.find(
                entry => entry.studentId.toString() === studentId.toString()
            );
            if (studentEntry) {
                if (studentEntry.status === "Present") attendanceStats.present++;
                else if (studentEntry.status === "Absent") attendanceStats.absent++;
                else if (studentEntry.status === "Late") attendanceStats.late++;
                else if (studentEntry.status === "Half-Day") attendanceStats.halfDay++;
            }
        });

        // 5. Calculate Attendance Percentage
        const attendancePercentage = attendanceStats.total > 0
            ? ((attendanceStats.present + attendanceStats.late + attendanceStats.halfDay * 0.5) / attendanceStats.total) * 100
            : 0;

        res.status(200).json({
            success: true,
            data: {
                student: {
                    firstName: student.firstName,
                    lastName: student.lastName,
                    admissionNo: student.admissionNo,
                    rollNo: student.rollNo,
                    className: student.classId?.name,
                    sectionName: student.sectionId?.name,
                    branchName: student.branchId?.name,
                    photo: student.documents?.photo?.url
                },
                summary: {
                    attendancePercentage: Math.round(attendancePercentage),
                    pendingHomework: homework.length, // Placeholder logic
                    recentHomework: homework,
                    recentNotices: notices,
                    monthlyAttendance: attendanceStats
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= ADMIT STUDENT (CREATE) =================
export const admitStudent = async (req, res) => {
    try {
        const admissionData = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        // 1. Internal Unique Check (Email)
        if (admissionData.email) {
            const existingStudent = await Student.findOne({ email: admissionData.email });
            if (existingStudent) {
                return res.status(400).json({ success: false, message: "Student with this email already exists" });
            }
        }

        // 2. Generate Sequential Admission Number
        const currentYear = new Date().getFullYear().toString();
        const sequence = await Sequence.findOneAndUpdate(
            { instituteId, type: 'admission', year: currentYear },
            { $inc: { sequenceValue: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const admissionNo = `${sequence.prefix || 'ADM'}-${currentYear}-${sequence.sequenceValue.toString().padStart(4, '0')}`;

        // 3. Handle Cloudinary Document Uploads
        if (admissionData.documents) {
            const uploadPromises = Object.keys(admissionData.documents).map(async (key) => {
                const doc = admissionData.documents[key];
                if (doc && doc.base64) {
                    try {
                        const cloudinaryUrl = await uploadBase64ToCloudinary(doc.base64, `students/documents/${instituteId}`);
                        doc.url = cloudinaryUrl;
                        delete doc.base64; // Remove base64 from object before saving to DB
                    } catch (uploadError) {
                        console.error(`Error uploading ${key} to Cloudinary:`, uploadError);
                        // Optionally set an error status or keep going
                    }
                }
            });
            await Promise.all(uploadPromises);
        }

        // 4. Create Student
        const student = new Student({
            ...admissionData,
            admissionNo,
            instituteId,
            branchId: admissionData.branchId
        });

        await student.save();

        res.status(201).json({
            success: true,
            message: "Student admitted successfully",
            data: student,
        });
    } catch (error) {
        console.error("Admission Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENTS =================
export const getStudents = async (req, res) => {
    try {
        const { branchId, classId, sectionId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (classId) query.classId = classId;
        if (sectionId) query.sectionId = sectionId;

        const students = await Student.find(query)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("parentId")
            .sort({ firstName: 1 });

        res.status(200).json({
            success: true,
            data: students,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENT BY ID =================
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const student = await Student.findOne({ _id: id, instituteId })
            .populate("branchId", "name code city phone")
            .populate("classId", "name level board")
            .populate("sectionId", "name capacity")
            .populate("parentId");

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Fetch subjects for this student's section
        let subjects = [];
        if (student.sectionId) {
            const mappings = await TeacherMapping.find({
                sectionId: student.sectionId._id
            })
                .populate("subjectId", "name code type")
                .populate("teacherId", "firstName lastName");

            subjects = mappings.map(m => ({
                _id: m.subjectId?._id,
                name: m.subjectId?.name,
                code: m.subjectId?.code,
                type: m.subjectId?.type,
                teacher: m.teacherId
                    ? `${m.teacherId.firstName || ''} ${m.teacherId.lastName || ''}`.trim()
                    : 'Not Assigned'
            }));
        }

        res.status(200).json({
            success: true,
            data: {
                ...student.toObject(),
                subjects
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE STUDENT =================
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent password update via this route
        delete updateData.password;

        const student = await Student.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({
            success: true,
            message: "Student record updated successfully",
            data: student,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= STUDENT LOGIN =================
export const loginStudent = async (req, res) => {
    try {
        const { admissionNo, password } = req.body;

        const student = await Student.findOne({ admissionNo });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        if (student.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Your status is ${student.status}`
            });
        }

        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(student._id, "Student");

        student.lastLogin = new Date();
        await student.save();

        res.status(200).json({
            success: true,
            message: "Student login successful",
            data: {
                _id: student._id,
                firstName: student.firstName,
                lastName: student.lastName,
                admissionNo: student.admissionNo,
                role: "Student"
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENT EXAMS =================
export const getStudentExams = async (req, res) => {
    try {
        const studentId = req.user._id;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const exams = await Exam.find({
            classes: student.classId,
            status: "Published"
        })
            .populate("subjects.subjectId", "name code type")
            .sort({ startDate: 1 });

        res.status(200).json({
            success: true,
            data: exams
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENT RESULTS =================
export const getStudentResults = async (req, res) => {
    try {
        const studentId = req.user._id;

        const results = await ExamResult.find({ studentId })
            .populate("examId", "examName examType startDate endDate")
            .populate("results.subjectId", "name code")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET MY ATTENDANCE =================
export const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { startDate, endDate } = req.query;

        let query = {
            "attendanceData.studentId": studentId
        };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const attendanceRecords = await Attendance.find(query)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .sort({ date: -1 });

        // Transform data to only show this student's status for each date
        const transformedAttendance = attendanceRecords.map(record => {
            const myEntry = record.attendanceData.find(
                entry => entry.studentId.toString() === studentId.toString()
            );
            return {
                _id: record._id,
                date: record.date,
                className: record.classId?.name,
                sectionName: record.sectionId?.name,
                status: myEntry ? myEntry.status : "N/A",
                remarks: myEntry ? myEntry.remarks : ""
            };
        });

        res.status(200).json({
            success: true,
            data: transformedAttendance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENT FEES =================
export const getStudentFees = async (req, res) => {
    try {
        const studentId = req.user._id;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Find applicable fee structure for student's class
        const feeStructure = await FeeStructure.findOne({
            applicableClasses: student.classId,
            status: "active"
        }).populate("academicYearId", "name");

        if (!feeStructure) {
            return res.status(200).json({
                success: true,
                message: "No active fee structure found for your class.",
                data: {
                    summary: { totalFee: 0, totalPaid: 0, balance: 0 },
                    payments: [],
                    structure: null
                }
            });
        }

        // Get payment history
        const payments = await FeePayment.find({ studentId })
            .sort({ paymentDate: -1 });

        const totalPaid = payments.reduce((acc, curr) => acc + curr.amountPaid, 0);
        const totalFee = feeStructure.totalAmount;
        const balance = totalFee - totalPaid;

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalFee,
                    totalPaid,
                    balance
                },
                payments,
                structure: feeStructure
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET MY NOTICES =================
export const getMyNotices = async (req, res) => {
    try {
        const studentId = req.user._id;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const notices = await Notice.find({
            status: "PUBLISHED",
            $or: [
                { audiences: "All Students" },
                { targetClasses: student.classId },
                { targetSections: student.sectionId }
            ]
        })
            .populate("branchId", "name")
            .sort({ publishDate: -1 });

        res.status(200).json({
            success: true,
            data: notices
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENT PROFILE =================
export const getStudentProfile = async (req, res) => {
    try {
        const studentId = req.user._id;

        const student = await Student.findById(studentId)
            .populate("branchId", "name code city phone address")
            .populate("classId", "name level board")
            .populate("sectionId", "name capacity")
            .populate("parentId")
            .select("-password");

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STUDENT ACADEMICS =================
export const getStudentAcademics = async (req, res) => {
    try {
        const studentId = req.user._id;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Fetch all active subjects and teachers for this student's section
        const subjects = await TeacherMapping.find({
            sectionId: student.sectionId,
            status: "active"
        })
            .populate("subjectId", "name code type description")
            .populate("teacherId", "firstName lastName email phone photo")
            .populate("classId", "name")
            .populate("academicYearId", "name");

        const academicData = {
            currentClass: student.classId,
            currentSection: student.sectionId,
            subjects: subjects.map(m => ({
                subjectId: m.subjectId?._id,
                name: m.subjectId?.name,
                code: m.subjectId?.code,
                type: m.subjectId?.type,
                description: m.subjectId?.description,
                teacher: m.teacherId ? {
                    _id: m.teacherId._id,
                    name: `${m.teacherId.firstName || ''} ${m.teacherId.lastName || ''}`.trim(),
                    email: m.teacherId.email,
                    photo: m.teacherId.photo
                } : null
            })),
            totalSubjects: subjects.length
        };

        res.status(200).json({
            success: true,
            data: academicData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
