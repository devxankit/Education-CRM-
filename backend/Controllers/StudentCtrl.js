import Student from "../Models/StudentModel.js";
import Class from "../Models/ClassModel.js";
import Section from "../Models/SectionModel.js";
import Parent from "../Models/ParentModel.js";
import Sequence from "../Models/SequenceModel.js";
import AdmissionRule from "../Models/AdmissionRuleModel.js";
import AcademicYear from "../Models/AcademicYearModel.js";
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
import { calculateTax } from "../Helpers/calculateTax.js";
import HomeworkSubmission from "../Models/HomeworkSubmissionModel.js";
import SupportTicket from "../Models/SupportTicketModel.js";
import LearningMaterial from "../Models/LearningMaterialModel.js";
import Role from "../Models/RoleModel.js";
import { logFinancial, logUserActivity, logDataChange } from "../Helpers/logger.js";

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

        // 2. Get Homework for this student's class/section (only if student is active)
        let homework = [];
        if (student.status === 'active') {
            const homeworkQuery = {
                classId,
                sectionId,
                status: "published"
            };

            // Filter by academic year if student has one assigned
            if (student.academicYearId) {
                homeworkQuery.academicYearId = student.academicYearId;
            }

            // Only show homework assigned AFTER student's admission date
            if (student.admissionDate) {
                homeworkQuery.createdAt = { $gte: student.admissionDate };
            }

            homework = await Homework.find(homeworkQuery)
                .populate("subjectId", "name code")
                .populate("teacherId", "firstName lastName")
                .sort({ createdAt: -1 })
                .limit(5);
        }

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
        const attendanceStatus = attendancePercentage >= 75 ? "Good" : attendancePercentage >= 50 ? "Track" : "Low";

        // 6. Today's Classes from Timetable (real data)
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const todayKey = days[new Date().getDay()];
        let todayClasses = [];
        const timetableDoc = await Timetable.findOne({ sectionId, status: "active" })
            .populate(`schedule.${todayKey}.subjectId`, "name")
            .populate(`schedule.${todayKey}.teacherId`, "firstName lastName");
        if (timetableDoc && timetableDoc.schedule && timetableDoc.schedule[todayKey] && timetableDoc.schedule[todayKey].length > 0) {
            const daySlots = timetableDoc.schedule[todayKey]
                .map((item, i) => ({
                    id: item._id ? item._id.toString() : `${timetableDoc._id}_${i}`,
                    subject: item.subjectId?.name || "N/A",
                    teacher: (student.status === 'in_review' || student.status === 'pending')
                        ? "N/A"
                        : (item.teacherId ? `${(item.teacherId.firstName || "").trim()} ${(item.teacherId.lastName || "").trim()}`.trim() || "N/A" : "N/A"),
                    time: item.startTime || "--",
                    room: item.room || "N/A",
                    mode: item.type === "online" ? "online" : "offline",
                    link: item.link || null
                }))
                .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
            todayClasses = daySlots;
        }

        // 7. Next exam (nearest upcoming) – Exam uses startDate and classes array
        const now = new Date();
        const upcomingExams = await Exam.find({
            instituteId,
            status: "Published",
            startDate: { $gte: now },
            $or: [{ classes: classId }, { classes: { $size: 0 } }]
        })
            .sort({ startDate: 1 })
            .limit(1)
            .populate("subjects.subjectId", "name");
        const nextExam = upcomingExams[0];
        const nextExamStart = nextExam?.startDate ? new Date(nextExam.startDate) : null;
        const nextExamDaysLeft = nextExamStart ? Math.ceil((nextExamStart - now) / (1000 * 60 * 60 * 24)) : null;
        const nextExamLabel = nextExam ? (nextExam.examName || (nextExam.subjects?.[0]?.subjectId?.name) || "Exam") + " – " + (nextExamStart ? nextExamStart.toLocaleDateString() : "") : null;

        // 8. New notes/materials count (this week) – LearningMaterial has classId
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newMaterialsCount = await LearningMaterial.countDocuments({
            instituteId,
            classId,
            status: "Published",
            createdAt: { $gte: weekAgo }
        });

        // 9. Performance (optional mock if no results yet)
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
                    attendance: {
                        percentage: Math.round(attendancePercentage),
                        status: attendanceStatus
                    },
                    homework: {
                        pending: (await Promise.all(homework.map(async (hw) => {
                            const sub = await HomeworkSubmission.findOne({ homeworkId: hw._id, studentId });
                            return sub ? 1 : 0;
                        }))).filter(x => x === 0).length,
                        nextDue: homework[0]?.dueDate ? new Date(homework[0].dueDate).toLocaleDateString() : null,
                        link: "/student/homework"
                    },
                    exams: {
                        daysLeft: nextExamDaysLeft,
                        nextExam: nextExamLabel,
                        link: "/student/exams"
                    },
                    materials: {
                        newCount: newMaterialsCount,
                        link: "/student/notes"
                    }
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

        // 0. Resolve Branch ID
        let branchId = admissionData.branchId;

        // Fetch class/section data early to get branchId if not provided
        let classData = null;
        let sectionData = null;
        if (admissionData.classId) {
            classData = await Class.findById(admissionData.classId);
            if (classData && !branchId) branchId = classData.branchId;
        }
        if (admissionData.sectionId) {
            sectionData = await Section.findById(admissionData.sectionId);
        }

        // Fallback to staff's branch if still not found and not 'all'
        if (!branchId && req.user.branchId && req.user.branchId !== "all") {
            branchId = req.user.branchId;
        }

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required for admission" });
        }

        // 0.1 Admission Policy Check
        let academicYearId = admissionData.academicYearId;
        if (!academicYearId) {
            const activeYear = await AcademicYear.findOne({ instituteId, status: "active" }).sort({ startDate: -1 });
            academicYearId = activeYear?._id?.toString();
        }
        // Block admission if academic year is closed
        if (academicYearId) {
            const ay = await AcademicYear.findById(academicYearId);
            if (ay && ay.status === "closed") {
                return res.status(403).json({
                    success: false,
                    message: "Admissions are closed for this academic year. Please select an active academic year."
                });
            }
        }
        const admissionRule = academicYearId
            ? await AdmissionRule.findOne({ instituteId, academicYearId })
            : null;

        if (admissionRule) {
            const { window: win, seatCapacity: seat, eligibility: elig } = admissionRule;

            // Window: Admissions closed
            if (win && win.isOpen === false) {
                return res.status(403).json({
                    success: false,
                    message: "Admissions are currently closed for this academic year."
                });
            }

            // Window: Date range
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (win?.startDate) {
                const start = new Date(win.startDate);
                start.setHours(0, 0, 0, 0);
                if (today < start) {
                    return res.status(403).json({
                        success: false,
                        message: `Admission window opens on ${start.toLocaleDateString()}.`
                    });
                }
            }
            let isLateApplication = false;
            if (win?.endDate) {
                const end = new Date(win.endDate);
                end.setHours(23, 59, 59, 999);
                if (today > end) {
                    if (!win.allowLate) {
                        return res.status(403).json({
                            success: false,
                            message: "Admission window has closed. Late applications are not allowed."
                        });
                    }
                    isLateApplication = true;
                }
            }

            // Eligibility: age and class
            if (classData && elig && Array.isArray(elig) && elig.length > 0) {
                const className = (classData.name || "").trim().toLowerCase();
                const rule = elig.find((e) => (e.class || "").trim().toLowerCase() === className);
                if (rule) {
                    const dob = admissionData.dob ? new Date(admissionData.dob) : null;
                    if (dob) {
                        const ageYears = (today - dob) / (365.25 * 24 * 60 * 60 * 1000);
                        if (rule.minAge != null && ageYears < rule.minAge) {
                            return res.status(400).json({
                                success: false,
                                message: `Minimum age for ${classData.name} is ${rule.minAge} years.`
                            });
                        }
                        if (rule.maxAge != null && rule.maxAge > 0 && ageYears > rule.maxAge) {
                            return res.status(400).json({
                                success: false,
                                message: `Maximum age for ${classData.name} is ${rule.maxAge} years.`
                            });
                        }
                    }
                    if (rule.prevClassRequired && !(admissionData.lastClass || "").trim()) {
                        return res.status(400).json({
                            success: false,
                            message: `Previous class/transfer certificate is required for ${classData.name}.`
                        });
                    }
                }
            }

            // Capacity & Waitlist (applied when we have section)
            if (classData && sectionData && seat) {
                const studentCount = await Student.countDocuments({
                    sectionId: admissionData.sectionId,
                    status: { $nin: ["withdrawn", "alumni"] }
                });
                const sectionCapacity = sectionData.capacity ?? classData.capacity ?? 40;
                const isFull = studentCount >= sectionCapacity;

                if (isFull) {
                    if (seat.strictCapacity) {
                        if (seat.waitlistEnabled) {
                            // Allow creation as waitlisted
                            admissionData._forceStatus = "waitlisted";
                        } else {
                            return res.status(400).json({
                                success: false,
                                message: `Section '${sectionData.name}' is full. Class '${classData.name}' limited to ${sectionCapacity} students.`
                            });
                        }
                    }
                }
            }
            admissionData._isLateApplication = isLateApplication;
        }

        // 1. Internal Unique Check (parentEmail)
        if (admissionData.parentEmail) {
            const existingStudent = await Student.findOne({ parentEmail: admissionData.parentEmail });
            if (existingStudent) {
                return res.status(400).json({ success: false, message: "Student with this parent email already exists" });
            }
        }

        // 1.1 Capacity Check (skip if policy allowed waitlist)
        if (classData && sectionData && !admissionData._forceStatus) {
            const studentCount = await Student.countDocuments({ sectionId: admissionData.sectionId, status: { $nin: ['withdrawn', 'alumni'] } });
            const studentCapacity = sectionData.capacity ?? classData.capacity ?? 40;

            if (studentCount >= studentCapacity) {
                return res.status(400).json({
                    success: false,
                    message: `Section '${sectionData.name}' is full. Class '${classData.name}' limited to ${studentCapacity} students per section.`
                });
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

        // 3. Handle Cloudinary Document Uploads + Workflow Policy
        const workflow = admissionRule?.workflow;
        // Only admin/institute get active status and approved docs; staff remains in_review
        const isAdminOrInstitute = ['institute', 'admin'].includes((req.role || '').toLowerCase());
        const defaultDocStatus = isAdminOrInstitute ? 'approved' : 'in_review';
        const defaultStudentStatus = isAdminOrInstitute ? 'active' : 'in_review';

        if (admissionData.documents) {
            const keys = Object.keys(admissionData.documents);
            for (const key of keys) {
                const doc = admissionData.documents[key];
                // Set default status based on who's creating the record
                doc.status = defaultDocStatus;
                doc.date = new Date().toISOString();

                if (doc && doc.base64) {
                    try {
                        const cloudinaryUrl = await uploadBase64ToCloudinary(doc.base64, `students/documents/${instituteId}`);
                        doc.url = cloudinaryUrl;
                        delete doc.base64; // Remove base64 from object before saving to DB
                    } catch (uploadError) {
                        console.error(`Error uploading ${key} to Cloudinary:`, uploadError);
                    }
                }
            }
        }

        // 4. Create/Find Parent
        let parentId = admissionData.parentId;
        let parentPassword = null;
        let parentCreated = false;

        if (!parentId && admissionData.parentEmail && admissionData.parentMobile) {
            let parent = await Parent.findOne({
                mobile: admissionData.parentMobile,
                instituteId
            });

            if (!parent) {
                parentPassword = "123456";
                const parentCode = `PRT-${Date.now().toString().slice(-6)}`;

                parent = new Parent({
                    instituteId,
                    branchId, // Use the resolved branchId
                    name: admissionData.parentName || "Parent",
                    mobile: admissionData.parentMobile,
                    email: admissionData.parentEmail,
                    relationship: admissionData.parentRelationship || "Father",
                    address: admissionData.address,
                    occupation: admissionData.parentOccupation,
                    code: parentCode,
                    password: parentPassword
                });

                await parent.save();
                parentCreated = true;
            }
            parentId = parent._id;
        }

        // 5. Create Student
        const sanitizeFields = ['parentId', 'classId', 'sectionId', 'courseId', 'branchId'];
        sanitizeFields.forEach(field => {
            if (admissionData[field] === "") delete admissionData[field];
        });

        // Validation: Class and Course cannot be selected together
        if (admissionData.classId && admissionData.courseId) {
            return res.status(400).json({
                success: false,
                message: "Cannot select both Class and Course/Program. Please select either Class or Course, not both."
            });
        }

        const forceStatus = admissionData._forceStatus;
        const isLate = admissionData._isLateApplication;
        delete admissionData._forceStatus;
        delete admissionData._isLateApplication;

        const studentStatus = forceStatus || defaultStudentStatus;

        const resolvedAcademicYearId = academicYearId || classData?.academicYearId;

        const student = new Student({
            ...admissionData,
            admissionNo,
            instituteId,
            branchId, // Use the resolved branchId
            academicYearId: resolvedAcademicYearId || undefined,
            parentId: admissionData.parentId || parentId,
            password: admissionData.password || '12345678',
            status: studentStatus,
            isLateApplication: isLate || false
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

        const msgWaitlist = studentStatus === 'waitlisted' ? " (Waitlisted - section is full)" : "";
        const msgLate = isLate ? " (Late application)" : "";
        const studentObj = student.toObject ? student.toObject() : student;
        res.status(201).json({
            success: true,
            message: (parentCreated
                ? "Student admitted successfully. Login credentials sent to parent email."
                : "Student admitted successfully") + msgWaitlist + msgLate,
            data: studentObj,
            parentLinked: !!parentId,
            emailSent: parentCreated && !!admissionData.parentEmail,
            waitlisted: studentStatus === 'waitlisted',
            isLateApplication: isLate
        });
    } catch (error) {
        console.error("Admission Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= RECORD FEE PAYMENT (Admin/Institute) =================
export const recordFeePayment = async (req, res) => {
    try {
        const { id: studentId } = req.params;
        const { feeStructureId, amount, paymentMethod = 'Cash', remarks } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!feeStructureId || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "feeStructureId and amount are required" });
        }

        const student = await Student.findById(studentId);
        if (!student || student.instituteId?.toString() !== instituteId?.toString()) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const feeStructure = await FeeStructure.findById(feeStructureId);
        if (!feeStructure || feeStructure.instituteId?.toString() !== instituteId?.toString()) {
            return res.status(404).json({ success: false, message: "Fee structure not found" });
        }

        const payment = new FeePayment({
            instituteId: student.instituteId,
            branchId: student.branchId,
            studentId,
            academicYearId: feeStructure.academicYearId,
            feeStructureId,
            amountPaid: Number(amount),
            paymentMethod: paymentMethod || 'Cash',
            paymentDate: new Date(),
            status: 'Success',
            receiptNo: `REC-${Date.now()}-${studentId.toString().slice(-4)}`,
            remarks: remarks || ''
        });

        await payment.save();

        logFinancial(req, { branchId: student.branchId, type: "fee_payment", amount: Number(amount), referenceType: "FeePayment", referenceId: payment._id, description: `Fee payment ₹${Number(amount)} - ${payment.receiptNo}` });
        logUserActivity(req, { branchId: student.branchId, action: "fee_payment_recorded", entityType: "FeePayment", entityId: payment._id, description: `Fee ₹${Number(amount)} recorded for student` });

        res.status(201).json({
            success: true,
            message: "Payment recorded successfully",
            data: { payment, receiptNo: payment.receiptNo }
        });
    } catch (error) {
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
                teacher: (student.status === 'in_review' || student.status === 'pending')
                    ? 'Not Assigned'
                    : (m.teacherId
                        ? `${m.teacherId.firstName || ''} ${m.teacherId.lastName || ''}`.trim()
                        : 'Not Assigned')
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
        const sanitizeFields = ['parentId', 'classId', 'sectionId', 'courseId', 'branchId'];
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

        const changedFields = Object.keys(updateData).filter(k => !['documents', 'base64'].includes(k));
        if (changedFields.length) {
            logDataChange(req, { entityType: "Student", entityId: student._id, action: "update", changedFields, newValue: updateData, description: "Student details updated" });
            logUserActivity(req, { branchId: student.branchId, action: "student_updated", entityType: "Student", entityId: student._id, description: "Student record updated" });
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

// ================= CONFIRM ADMISSION (Workflow Policy) =================
export const confirmAdmission = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }
        if (student.instituteId?.toString() !== instituteId?.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }
        if (student.status === "active") {
            return res.status(400).json({ success: false, message: "Student is already confirmed." });
        }
        if (student.status === "waitlisted") {
            return res.status(400).json({ success: false, message: "Waitlisted students cannot be confirmed until promoted." });
        }

        const activeYear = await AcademicYear.findOne({ instituteId, status: "active" }).sort({ startDate: -1 });
        const academicYearId = activeYear?._id?.toString();
        const admissionRule = academicYearId
            ? await AdmissionRule.findOne({ instituteId, academicYearId })
            : null;

        const workflow = admissionRule?.workflow;
        if (workflow) {
            const approvalRequired = (workflow.approval || "admin").toLowerCase();
            const userRole = (req.role || "institute").toLowerCase();
            let staffRole = "";
            if (req.role === "staff" && req.user?.roleId) {
                const roleObj = req.user.roleId?.code ? req.user.roleId : await Role.findById(req.user.roleId).select("code name");
                staffRole = (roleObj?.code || roleObj?.name || "").toLowerCase();
            }
            const hasApprovalRole =
                userRole === "institute" || staffRole.includes(approvalRequired);
            if (!hasApprovalRole) {
                return res.status(403).json({
                    success: false,
                    message: `Only ${approvalRequired} can confirm admission as per policy.`,
                });
            }

            if (workflow.requireDocs && student.documents) {
                const docKeys = Object.keys(student.documents);
                const pending = docKeys.filter((k) => {
                    const d = student.documents[k];
                    return d && (d.url || d.name) && d.status !== "approved";
                });
                if (pending.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Document verification pending. All documents must be approved before confirmation.",
                    });
                }
            }

            if (workflow.requireFee) {
                const paid = await FeePayment.findOne({
                    studentId: student._id,
                    status: "Success",
                });
                if (!paid) {
                    return res.status(400).json({
                        success: false,
                        message: "Fee payment is required before confirmation. Please record at least one fee payment.",
                    });
                }
            }
        }

        student.status = "active";
        await student.save();

        res.status(200).json({
            success: true,
            message: "Admission confirmed successfully",
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
            .populate("subjectId", "name code")
            .populate("teacherId", "firstName lastName")
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
                subjectId: record.subjectId?._id,
                subjectName: record.subjectId?.name || "General",
                subjectCode: record.subjectId?.code,
                markedBy: record.teacherId ? `${record.teacherId.firstName} ${record.teacherId.lastName}` : "System",
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

        const baseAmount = feeStructure.totalAmount || 0;
        const branchId = feeStructure.branchId || student.branchId;
        const instituteId = feeStructure.instituteId || student.instituteId;
        const { totalTax } = await calculateTax(baseAmount, branchId, "fee", instituteId);
        const totalFee = baseAmount + totalTax;

        const totalPaid = payments.reduce((acc, curr) => acc + curr.amountPaid, 0);
        const balance = totalFee - totalPaid;

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalFee,
                    baseAmount,
                    totalTax,
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
                    teacher: (studentData.status === 'in_review' || studentData.status === 'pending')
                        ? "Not Assigned"
                        : (m.teacherId ? `${m.teacherId.firstName || ''} ${m.teacherId.lastName || ''}`.trim() : "Not Assigned"),
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

        // Only active students should see homework
        if (student.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Your admission status is ${student.status}. Please contact admin for activation.`
            });
        }

        // Build homework query with proper filters
        const homeworkQuery = {
            classId: student.classId,
            sectionId: student.sectionId,
            status: "published"
        };

        // Filter by academic year if student has one assigned
        if (student.academicYearId) {
            homeworkQuery.academicYearId = student.academicYearId;
        }

        // Only show homework assigned AFTER student's admission date
        // This prevents showing old homework from before student joined
        if (student.admissionDate) {
            homeworkQuery.createdAt = { $gte: student.admissionDate };
        }

        const homework = await Homework.find(homeworkQuery)
            .populate("subjectId", "name code")
            .populate("teacherId", "firstName lastName")
            .sort({ dueDate: 1 });

        // Check submission status for each homework
        const homeworkWithStatus = await Promise.all(homework.map(async (hw) => {
            const submission = await HomeworkSubmission.findOne({
                homeworkId: hw._id,
                studentId: studentId
            });

            let status = "Pending";
            if (submission) {
                status = submission.status || "Submitted";
            } else if (new Date() > hw.dueDate) {
                status = "Overdue";
            }

            return {
                ...hw.toObject(),
                submissionStatus: status,
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

        const isLate = new Date() > homework.dueDate;
        const submissionStatus = isLate ? "Late" : "Submitted";

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
                status: submissionStatus
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: isLate
                ? "Homework submitted successfully (marked as Late - submitted after due date)"
                : "Homework submitted successfully",
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

        if (!student.branchId) {
            return res.status(400).json({ success: false, message: "You must be assigned to a branch to raise a ticket" });
        }

        const classDoc = student.classId ? await Class.findById(student.classId).select("academicYearId").lean() : null;
        const ticket = new SupportTicket({
            instituteId: student.instituteId,
            studentId,
            branchId: student.branchId,
            academicYearId: classDoc?.academicYearId || null,
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

// ================= GET STUDENT NOTIFICATIONS =================
export const getStudentNotifications = async (req, res) => {
    try {
        // For now returning empty array as Notification model is not implemented
        // or can be linked to other models like Notices/Announcements in future
        res.status(200).json({
            success: true,
            data: []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE STUDENT PROFILE (BY STUDENT) =================
export const updateStudentProfile = async (req, res) => {
    try {
        const id = req.user._id;
        const {
            firstName, middleName, lastName,
            dob, gender, bloodGroup,
            nationality, religion, category,
            address, city, state, pincode,
            photo // Base64 if uploading new
        } = req.body;

        const updateData = {
            firstName, middleName, lastName,
            dob, gender, bloodGroup,
            nationality, religion, category,
            address, city, state, pincode
        };

        // Handle Photo Upload
        if (photo && photo.base64) {
            const instituteId = req.user.instituteId;
            try {
                const cloudinaryUrl = await uploadBase64ToCloudinary(photo.base64, `students/photos/${instituteId}`);
                updateData["documents.photo"] = {
                    name: photo.name || "profile-photo",
                    url: cloudinaryUrl,
                    status: "verified",
                    date: new Date().toISOString()
                };
            } catch (uploadError) {
                console.error("Error uploading photo to Cloudinary:", uploadError);
            }
        }

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
            message: "Profile updated successfully",
            data: student,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
