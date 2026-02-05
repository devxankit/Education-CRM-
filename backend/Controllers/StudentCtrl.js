import Student from "../Models/StudentModel.js";
import Class from "../Models/ClassModel.js";
import Section from "../Models/SectionModel.js";
import Parent from "../Models/ParentModel.js";
import Sequence from "../Models/SequenceModel.js";
import TeacherMapping from "../Models/TeacherMappingModel.js";
import Timetable from "../Models/TimetableModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";
import { generateRandomPassword } from "../Helpers/generateRandomPassword.js";
import { sendParentCredentialsEmail } from "../Helpers/SendMail.js";
import Notice from "../Models/NoticeModel.js";
import Homework from "../Models/HomeworkModel.js";
import Attendance from "../Models/AttendanceModel.js";
import Exam from "../Models/ExamModel.js";
import ExamResult from "../Models/ExamResultModel.js";
import FeeStructure from "../Models/FeeStructureModel.js";
import FeePayment from "../Models/FeePaymentModel.js";
import HomeworkSubmission from "../Models/HomeworkSubmissionModel.js";
import SupportTicket from "../Models/SupportTicketModel.js";
import LearningMaterial from "../Models/LearningMaterialModel.js";

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

        // 6. Mock Today's Classes (Real one would query Timetable)
        const todayClasses = [
            { id: 1, subject: 'Mathematics', time: '09:00 AM', teacher: 'Dr. Sharma', room: 'Room 302', status: 'upcoming' },
            { id: 2, subject: 'Physics', time: '10:30 AM', teacher: 'Prof. Verma', room: 'Lab 1', status: 'upcoming' },
            { id: 3, subject: 'History', time: '01:00 PM', teacher: 'Ms. Iyer', room: 'Room 105', status: 'upcoming' }
        ];

        // 7. Performance Mock (Real one from Exams)
        const performance = {
            currentGPA: "8.4",
            previousGPA: "8.2",
            rank: "5th",
            totalStudents: "45",
            attendanceTrend: "+2%"
        };

        res.status(200).json({
            success: true,
            data: {
                studentProfile: {
                    firstName: student.firstName,
                    lastName: student.lastName,
                    admissionNo: student.admissionNo,
                    rollNo: student.rollNo,
                    className: student.classId?.name,
                    sectionName: student.sectionId?.name,
                    branchName: student.branchId?.name,
                    photo: student.documents?.photo?.url
                },
                stats: {
                    attendance: Math.round(attendancePercentage),
                    homework: homework.length,
                    notices: notices.length,
                    exams: 2 // Mock
                },
                alerts: notices.map(n => ({
                    id: n._id,
                    type: n.priority === 'High' ? 'Important' : 'Notice',
                    title: n.title,
                    message: n.content.substring(0, 50) + "...",
                    date: n.publishDate
                })),
                todayClasses,
                performance,
                recentHomework: homework
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

        // 1. Internal Unique Check (parentEmail)
        if (admissionData.parentEmail) {
            const existingStudent = await Student.findOne({ parentEmail: admissionData.parentEmail });
            if (existingStudent) {
                return res.status(400).json({ success: false, message: "Student with this parent email already exists" });
            }
        }

        // 1.1 Capacity Check
        if (admissionData.sectionId && admissionData.classId) {
            const classData = await Class.findById(admissionData.classId);
            const section = await Section.findById(admissionData.sectionId);

            if (classData && section) {
                const studentCount = await Student.countDocuments({ sectionId: admissionData.sectionId, status: 'active' });
                // Use class capacity for all its sections
                const studentCapacity = classData.capacity || 40;

                if (studentCount >= studentCapacity) {
                    return res.status(400).json({
                        success: false,
                        message: `Section '${section.name}' is full. Class '${classData.name}' limited to ${studentCapacity} students per section.`
                    });
                }
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
                    }
                }
            });
            await Promise.all(uploadPromises);
        }

        // 4. Create/Find Parent and generate password if parentEmail and parentMobile are provided
        let parentId = admissionData.parentId;
        let parentPassword = null;
        let parentCreated = false;

        if (admissionData.parentEmail && admissionData.parentMobile) {
            // Check if parent already exists with this mobile
            let parent = await Parent.findOne({
                mobile: admissionData.parentMobile,
                instituteId
            });

            if (!parent) {
                // Generate random password for new parent
                parentPassword = "123456";
                const parentCode = `PRT-${Date.now().toString().slice(-6)}`;

                // Create new parent
                parent = new Parent({
                    instituteId,
                    branchId: admissionData.branchId,
                    name: admissionData.parentName || admissionData.fatherName || admissionData.guardianName || "Parent",
                    mobile: admissionData.parentMobile,
                    email: admissionData.parentEmail,
                    relationship: admissionData.parentRelationship || "Father",
                    address: admissionData.address,
                    occupation: admissionData.parentOccupation,
                    code: parentCode,
                    password: parentPassword // Will be hashed by model pre-save hook
                });

                await parent.save();
                parentCreated = true;
                console.log(`Parent created: ${parent._id} with mobile: ${admissionData.parentMobile}`);
            }

            parentId = parent._id;
        }

        // 5. Create Student
        // Sanitize empty IDs
        const sanitizeFields = ['parentId', 'classId', 'sectionId', 'branchId'];
        sanitizeFields.forEach(field => {
            if (admissionData[field] === "") delete admissionData[field];
        });

        const student = new Student({
            ...admissionData,
            admissionNo,
            instituteId,
            branchId: admissionData.branchId,
            parentId: admissionData.parentId || parentId, // Use generated or provided
            password: admissionData.password || '12345678' // Default password for portal login
        });

        await student.save();

        // 6. Send credentials email to parent if new parent was created
        if (parentCreated && admissionData.parentEmail && parentPassword) {
            const studentName = `${admissionData.firstName} ${admissionData.lastName || ''}`.trim();
            const parentName = admissionData.parentName || admissionData.fatherName || admissionData.guardianName || "Parent";

            // Send email asynchronously (don't block response)
            sendParentCredentialsEmail(
                admissionData.parentEmail,
                parentPassword,
                parentName,
                studentName,
                admissionNo
            ).then(() => {
                console.log(`Credentials email sent to ${admissionData.parentEmail}`);
            }).catch(err => {
                console.error(`Failed to send email to ${admissionData.parentEmail}:`, err);
            });
        }

        res.status(201).json({
            success: true,
            message: parentCreated
                ? "Student admitted successfully. Login credentials sent to parent email."
                : "Student admitted successfully",
            data: student,
            parentLinked: !!parentId,
            emailSent: parentCreated && !!admissionData.parentEmail
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

        // Internal Unique Check (parentEmail) if email is being changed
        if (updateData.parentEmail) {
            const existingStudent = await Student.findOne({
                parentEmail: updateData.parentEmail,
                _id: { $ne: id }
            });
            if (existingStudent) {
                return res.status(400).json({ success: false, message: "Another student with this parent email already exists" });
            }
        }

        // Handle Cloudinary Document Uploads
        if (updateData.documents) {
            const instituteId = req.user.instituteId || req.user._id;
            const uploadPromises = Object.keys(updateData.documents).map(async (key) => {
                const doc = updateData.documents[key];
                if (doc && doc.base64) {
                    try {
                        const cloudinaryUrl = await uploadBase64ToCloudinary(doc.base64, `students/documents/${instituteId}`);
                        doc.url = cloudinaryUrl;
                        delete doc.base64; // Remove base64 from object before saving to DB
                    } catch (uploadError) {
                        console.error(`Error uploading updated ${key} to Cloudinary:`, uploadError);
                    }
                }
            });
            await Promise.all(uploadPromises);
        }

        // Sanitize empty IDs to prevent CastError
        const sanitizeFields = ['parentId', 'classId', 'sectionId', 'branchId'];
        sanitizeFields.forEach(field => {
            if (updateData[field] === "") delete updateData[field];
        });

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
        const { identifier, password } = req.body;

        // Search by admissionNo or parentEmail
        const student = await Student.findOne({
            $or: [
                { admissionNo: identifier },
                { parentEmail: identifier?.toLowerCase() }
            ]
        });

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

        // Use findByIdAndUpdate to avoid triggering validation on other fields (like parentId empty strings)
        await Student.findByIdAndUpdate(student._id, {
            $set: { lastLogin: new Date() }
        });

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

        const studentData = await Student.findById(studentId)
            .populate("classId", "name level")
            .populate("sectionId", "name")
            .populate("branchId", "name board");

        if (!studentData) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Fetch all active subjects and teachers for this student's section
        const subjects = await TeacherMapping.find({
            sectionId: studentData.sectionId,
            status: "active"
        })
            .populate("subjectId", "name code type description")
            .populate("teacherId", "firstName lastName email phone photo")
            .populate("academicYearId", "name");

        // Fetch timetable for this section
        const timetableData = await Timetable.findOne({
            sectionId: studentData.sectionId,
            status: "active"
        })
            .populate("schedule.Mon.subjectId schedule.Mon.teacherId")
            .populate("schedule.Tue.subjectId schedule.Tue.teacherId")
            .populate("schedule.Wed.subjectId schedule.Wed.teacherId")
            .populate("schedule.Thu.subjectId schedule.Thu.teacherId")
            .populate("schedule.Fri.subjectId schedule.Fri.teacherId")
            .populate("schedule.Sat.subjectId schedule.Sat.teacherId");

        // Transform timetable to frontend format
        const formattedTimetable = {
            Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []
        };

        if (timetableData && timetableData.schedule) {
            Object.keys(formattedTimetable).forEach(day => {
                if (timetableData.schedule[day]) {
                    formattedTimetable[day] = timetableData.schedule[day].map(item => ({
                        id: item._id,
                        time: `${item.startTime} - ${item.endTime}`,
                        subject: item.subjectId?.name || "N/A",
                        teacher: item.teacherId ? `${item.teacherId.firstName} ${item.teacherId.lastName}` : "N/A",
                        room: item.room || "N/A",
                        type: item.type || "offline",
                        link: item.link
                    }));
                }
            });
        }

        const academicData = {
            classInfo: {
                className: studentData.classId?.name || "N/A",
                section: studentData.sectionId?.name || "N/A",
                academicYear: subjects[0]?.academicYearId?.name || "2023-24",
                medium: studentData.branchId?.board || "English",
                stream: studentData.classId?.level || "N/A",
                admissionDate: studentData.admissionDate
            },
            subjects: subjects.map(m => {
                const subjectColors = [
                    'bg-blue-50 text-blue-600',
                    'bg-purple-50 text-purple-600',
                    'bg-emerald-50 text-emerald-600',
                    'bg-orange-50 text-orange-600',
                    'bg-rose-50 text-rose-600',
                    'bg-indigo-50 text-indigo-600'
                ];
                const randomIndex = Math.floor(Math.random() * subjectColors.length);

                return {
                    id: m._id,
                    subjectId: m.subjectId?._id,
                    name: m.subjectId?.name || "Unknown Subject",
                    code: m.subjectId?.code || "N/A",
                    type: m.subjectId?.type || "Internal",
                    description: m.subjectId?.description,
                    teacher: m.teacherId ? `${m.teacherId.firstName || ''} ${m.teacherId.lastName || ''}`.trim() : "TBA",
                    color: subjectColors[randomIndex],
                    classesPerWeek: 4 // Default placeholder
                };
            }),
            timetable: formattedTimetable,
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

// ================= GET STUDENT HOMEWORK =================
export const getStudentHomework = async (req, res) => {
    try {
        const studentId = req.user._id;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const homework = await Homework.find({
            classId: student.classId,
            sectionId: student.sectionId,
            status: "published"
        })
            .populate("subjectId", "name code")
            .populate("teacherId", "firstName lastName")
            .sort({ dueDate: 1 });

        // Check submission status for each homework
        const homeworkWithStatus = await Promise.all(homework.map(async (hw) => {
            const submission = await HomeworkSubmission.findOne({
                homeworkId: hw._id,
                studentId: studentId
            });
            return {
                ...hw.toObject(),
                submissionStatus: submission ? (submission.status || "Submitted") : "Pending",
                marks: submission?.marks,
                feedback: submission?.feedback
            };
        }));

        res.status(200).json({
            success: true,
            data: homeworkWithStatus
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= SUBMIT HOMEWORK =================
export const submitHomework = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { homeworkId, content, attachments } = req.body;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const homework = await Homework.findById(homeworkId);
        if (!homework) {
            return res.status(404).json({ success: false, message: "Homework not found" });
        }

        // Handle file uploads if any
        let uploadedAttachments = [];
        if (attachments && attachments.length > 0) {
            const uploadPromises = attachments.map(async (att) => {
                if (att.base64) {
                    const url = await uploadBase64ToCloudinary(att.base64, `students/homework/${studentId}`);
                    return { name: att.name, url };
                }
                return att;
            });
            uploadedAttachments = await Promise.all(uploadPromises);
        }

        const submission = await HomeworkSubmission.findOneAndUpdate(
            { homeworkId, studentId },
            {
                instituteId: student.instituteId,
                branchId: student.branchId,
                homeworkId,
                studentId,
                content,
                attachments: uploadedAttachments,
                submissionDate: new Date(),
                status: new Date() > homework.dueDate ? "Late" : "Submitted"
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: "Homework submitted successfully",
            data: submission
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET LEARNING MATERIALS (NOTES) =================
export const getLearningMaterials = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { type, subjectId } = req.query;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        let query = {
            classId: student.classId,
            status: "Published",
            $or: [
                { sectionId: student.sectionId },
                { sectionId: { $exists: false } },
                { sectionId: null }
            ]
        };

        if (type) query.type = type;
        if (subjectId) query.subjectId = subjectId;

        const materials = await LearningMaterial.find(query)
            .populate("subjectId", "name code")
            .populate("teacherId", "firstName lastName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: materials
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CREATE SUPPORT TICKET =================
export const createSupportTicket = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { category, topic, details, priority } = req.body;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const ticket = new SupportTicket({
            instituteId: student.instituteId,
            studentId,
            category,
            topic,
            details,
            priority: priority || "Normal"
        });

        await ticket.save();

        res.status(201).json({
            success: true,
            message: "Support ticket created successfully",
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET SUPPORT TICKETS =================
export const getSupportTickets = async (req, res) => {
    try {
        const studentId = req.user._id;
        const tickets = await SupportTicket.find({ studentId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
