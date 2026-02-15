import Parent from "../Models/ParentModel.js";
import Student from "../Models/StudentModel.js";
import Attendance from "../Models/AttendanceModel.js";
import Homework from "../Models/HomeworkModel.js";
import Notice from "../Models/NoticeModel.js";
import FeePayment from "../Models/FeePaymentModel.js";
import FeeStructure from "../Models/FeeStructureModel.js";
import Tax from "../Models/TaxModel.js";
import { calculateTax, calculateTaxFromRules } from "../Helpers/calculateTax.js";
import ExamResult from "../Models/ExamResultModel.js";
import Exam from "../Models/ExamModel.js";
import Teacher from "../Models/TeacherModel.js";
import SupportTicket from "../Models/SupportTicketModel.js";
import HomeworkSubmission from "../Models/HomeworkSubmissionModel.js";
import NoticeAcknowledgment from "../Models/NoticeAcknowledgmentModel.js";
import TeacherMapping from "../Models/TeacherMappingModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { sendLoginCredentialsEmail } from "../Helpers/SendMail.js";

// ================= CREATE PARENT =================
export const createParent = async (req, res) => {
    try {
        const { name, mobile, email, relationship, branchId, address, occupation, studentIds } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        const existingParent = await Parent.findOne({
            $or: [{ mobile }, { email: email || "no-email" }]
        });

        if (existingParent && (existingParent.mobile === mobile || (email && existingParent.email === email))) {
            return res.status(400).json({
                success: false,
                message: "Parent with this mobile or email already exists"
            });
        }

        const parentCode = `PRT-${Date.now().toString().slice(-6)}`;

        const parent = new Parent({
            instituteId,
            branchId,
            name,
            mobile,
            email,
            relationship,
            address,
            occupation,
            code: parentCode,
            password: "123456" // Default password
        });

        await parent.save();

        // Send Email if email is provided
        if (email) {
            await sendLoginCredentialsEmail(email, "123456", name, "Parent");
        }

        // If linking students during creation
        if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
            await Student.updateMany(
                { _id: { $in: studentIds } },
                { $set: { parentId: parent._id } }
            );
        }

        res.status(201).json({
            success: true,
            message: "Parent record created successfully",
            data: parent,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET PARENTS =================
export const getParents = async (req, res) => {
    try {
        const { branchId, searchQuery } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;

        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { mobile: { $regex: searchQuery, $options: 'i' } },
                { code: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const parents = await Parent.find(query).sort({ createdAt: -1 });

        // Link students count and data
        const parentsWithStudents = await Promise.all(parents.map(async (p) => {
            const students = await Student.find({
                $or: [
                    { parentId: p._id },
                    { parentMobile: p.mobile }
                ]
            }).select("firstName lastName classId sectionId").populate("classId sectionId", "name");

            return {
                ...p._doc,
                studentCount: students.length,
                linkedStudents: students.map(s => ({
                    id: s._id,
                    studentName: `${s.firstName} ${s.lastName}`,
                    class: `${s.classId?.name || ''}-${s.sectionId?.name || ''}`
                }))
            };
        }));

        res.status(200).json({
            success: true,
            data: parentsWithStudents,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE PARENT =================
export const updateParent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        delete updateData.password; // Don't allow password update here

        const parent = await Parent.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        res.status(200).json({
            success: true,
            message: "Parent record updated successfully",
            data: parent,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= PARENT LOGIN =================
export const loginParent = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        // Search by mobile OR email
        const parent = await Parent.findOne({
            $or: [
                { mobile: mobile },
                { email: mobile }
            ]
        });

        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        if (parent.status !== 'Active') {
            return res.status(403).json({
                success: false,
                message: `Your account is ${parent.status}`
            });
        }

        const isMatch = await parent.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(parent._id, "Parent");

        parent.lastLogin = new Date();
        await parent.save();

        res.status(200).json({
            success: true,
            message: "Parent login successful",
            data: {
                _id: parent._id,
                name: parent.name,
                mobile: parent.mobile,
                role: "Parent"
            },
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET LINKED STUDENTS =================
export const getLinkedStudents = async (req, res) => {
    try {
        const { parentId } = req.params;

        // Security check: Parents can only view their own linked students
        if (req.user.role === 'Parent' && req.user._id.toString() !== parentId) {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }

        const students = await Student.find({ parentId })
            .populate("classId", "name")
            .populate("sectionId", "name")
            .select("firstName lastName admissionNo classId sectionId");

        const linkedStudents = students.map(s => ({
            _id: s._id,
            studentName: `${s.firstName} ${s.lastName}`,
            admissionNo: s.admissionNo,
            class: `${s.classId?.name || 'N/A'} - ${s.sectionId?.name || 'N/A'}`
        }));

        res.status(200).json({
            success: true,
            data: linkedStudents
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LINK STUDENT =================
export const linkStudent = async (req, res) => {
    try {
        const { parentId } = req.params;
        const { studentId } = req.body;

        const student = await Student.findByIdAndUpdate(
            studentId,
            { parentId },
            { new: true }
        ).populate("classId", "name").populate("sectionId", "name");

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({
            success: true,
            message: "Student linked successfully",
            data: {
                _id: student._id,
                studentName: `${student.firstName} ${student.lastName}`,
                admissionNo: student.admissionNo,
                class: `${student.classId?.name || 'N/A'} - ${student.sectionId?.name || 'N/A'}`
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UNLINK STUDENT =================
export const unlinkStudent = async (req, res) => {
    try {
        const { parentId } = req.params;
        const { studentId } = req.body;

        const student = await Student.findByIdAndUpdate(
            studentId,
            { $unset: { parentId: "" } },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({
            success: true,
            message: "Student unlinked successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// =================================================================================
// ========================== PARENT PORTAL APIs ===================================
// =================================================================================

// ================= GET PARENT DASHBOARD =================
export const getParentDashboard = async (req, res) => {
    try {
        const parentId = req.user._id;
        const parent = await Parent.findById(parentId);

        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        // Get all linked students (children)
        const students = await Student.find({ parentId })
            .populate("classId", "name")
            .populate("sectionId", "name");

        // Build children data with academics
        const childrenData = await Promise.all(students.map(async (student) => {
            // Get attendance summary
            const attendanceRecords = await Attendance.find({
                "attendanceData.studentId": student._id
            });

            let presentDays = 0;
            let totalDays = 0;
            attendanceRecords.forEach(record => {
                const studentAttendance = record.attendanceData.find(
                    a => a.studentId.toString() === student._id.toString()
                );
                if (studentAttendance) {
                    totalDays++;
                    if (studentAttendance.status === "Present" || studentAttendance.status === "Late") presentDays++;
                }
            });
            const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

            // Get pending homework count (exclude submitted)
            const submittedHwIds = await HomeworkSubmission.find({
                studentId: student._id
            }).distinct("homeworkId");

            const pendingHomework = await Homework.countDocuments({
                classId: student.classId,
                sectionId: student.sectionId,
                dueDate: { $gte: new Date() },
                status: "published",
                _id: { $nin: submittedHwIds }
            });

            // Get latest exam result
            const latestResult = await ExamResult.findOne({ studentId: student._id })
                .sort({ createdAt: -1 })
                .populate("examId", "title");

            // Get fee summary (with tax)
            const feeStructures = await FeeStructure.find({
                applicableClasses: student.classId,
                status: "active"
            });

            let totalPaid = 0;
            let totalAmount = 0;
            let pendingFees = 0;
            let dueDate = null;

            if (feeStructures.length > 0) {
                // Get all relevant payments
                const feePayments = await FeePayment.find({
                    studentId: student._id,
                    feeStructureId: { $in: feeStructures.map(fs => fs._id) },
                    status: "Success"
                });

                // Fetch taxes for consistency
                const taxes = student.branchId ? await Tax.find({ branchId: student.branchId, isActive: true }).lean() : [];

                // Calculate totals across all structures
                for (const fs of feeStructures) {
                    const baseAmount = fs.totalAmount || 0;
                    const { totalTax } = calculateTaxFromRules(baseAmount, taxes, "fees");

                    totalAmount += (baseAmount + totalTax);

                    if (!dueDate || (fs.installments?.[0]?.dueDate && new Date(fs.installments[0].dueDate) < new Date(dueDate))) {
                        dueDate = fs.installments?.[0]?.dueDate;
                    }
                }

                totalPaid = feePayments.reduce((sum, p) => sum + p.amountPaid, 0);
                pendingFees = totalAmount - totalPaid;
            }

            // Generate alerts
            const alerts = [];
            if (attendancePercentage < 75) {
                alerts.push({
                    id: `alert-attendance-${student._id}`,
                    type: "attendance",
                    icon: "Clock",
                    title: "Low Attendance",
                    message: `Attendance dropped below 75%`,
                    cta: "Check"
                });
            }
            if (pendingHomework > 0) {
                alerts.push({
                    id: `alert-homework-${student._id}`,
                    type: "homework",
                    icon: "BookOpen",
                    title: "Homework Pending",
                    message: `${pendingHomework} homework assignment(s) due`,
                    cta: "View"
                });
            }
            if (pendingFees > 0) {
                alerts.push({
                    id: `alert-fee-${student._id}`,
                    type: "fee",
                    icon: "CreditCard",
                    title: "Fee Due",
                    message: `₹${pendingFees} pending`,
                    cta: "Pay Now"
                });
            }

            // Determine status
            let status = "On Track";
            if (attendancePercentage < 75 || pendingFees > 0) {
                status = "Action Required";
            } else if (pendingHomework > 2 || attendancePercentage < 85) {
                status = "Attention Needed";
            }

            return {
                id: student._id,
                name: `${student.firstName} ${student.lastName}`,
                class: student.classId?.name || "N/A",
                section: student.sectionId?.name || "N/A",
                avatar: student.documents?.photo?.url || null,
                rollNo: student.rollNo || "N/A",
                status,
                alerts,
                academics: {
                    attendance: attendancePercentage,
                    homeworkPending: pendingHomework,
                    lastResult: latestResult ? {
                        subject: latestResult.examId?.title || "Exam",
                        marks: `${latestResult.totalMarksObtained}/${latestResult.totalMaxMarks}`,
                        grade: latestResult.overallGrade || "N/A"
                    } : null
                },
                fees: {
                    total: totalAmount,
                    paid: totalPaid,
                    pending: pendingFees,
                    dueDate: dueDate || null
                }
            };
        }));

        // Get recent notices for parent
        const notices = await Notice.find({
            instituteId: parent.instituteId,
            $or: [
                { audiences: "All Parents" },
                { audiences: "All Students" }
            ],
            status: "PUBLISHED"
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title createdAt content");

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: parent._id,
                    name: parent.name,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parent.name)}&background=0D8ABC&color=fff`
                },
                children: childrenData,
                notices: notices.map(n => ({
                    id: n._id,
                    title: n.title,
                    date: n.createdAt,
                    description: n.content?.substring(0, 100) + "..."
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CHILD ATTENDANCE =================
export const getChildAttendance = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { studentId } = req.params;

        // Verify student belongs to parent
        const student = await Student.findOne({ _id: studentId, parentId });
        if (!student) {
            return res.status(403).json({ success: false, message: "Unauthorized access to student data" });
        }

        // Get all attendance records for this student
        const attendanceRecords = await Attendance.find({
            "attendanceData.studentId": studentId
        }).populate("subjectId", "name").sort({ date: -1 });

        let presentDays = 0;
        let absentDays = 0;
        let lateDays = 0;
        const history = [];
        const monthlyStats = {};

        attendanceRecords.forEach(record => {
            const studentAttendance = record.attendanceData.find(
                a => a.studentId.toString() === studentId
            );
            if (studentAttendance) {
                const month = new Date(record.date).toLocaleString("default", { month: "short" });
                if (!monthlyStats[month]) {
                    monthlyStats[month] = { present: 0, absent: 0, total: 0 };
                }
                monthlyStats[month].total++;

                if (studentAttendance.status === "Present") {
                    presentDays++;
                    monthlyStats[month].present++;
                } else if (studentAttendance.status === "Absent") {
                    absentDays++;
                    monthlyStats[month].absent++;
                } else if (studentAttendance.status === "Late") {
                    lateDays++;
                    monthlyStats[month].present++;
                }

                history.push({
                    date: record.date,
                    status: studentAttendance.status,
                    type: studentAttendance.remarks || "Regular",
                    subject: record.subjectId?.name || null
                });
            }
        });

        const totalDays = presentDays + absentDays + lateDays;
        const overallPercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

        // Convert monthly stats to array
        const monthly = Object.entries(monthlyStats).map(([month, stats]) => ({
            month,
            percentage: Math.round((stats.present / stats.total) * 100),
            present: stats.present,
            absent: stats.absent,
            isLow: (stats.present / stats.total) * 100 < 75
        }));

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    overall: overallPercentage,
                    required: 75,
                    totalDays: totalDays,
                    presentDays: presentDays,
                    absentDays: absentDays,
                },
                monthly: monthly.slice(0, 6),
                history: history.slice(0, 30)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CHILD HOMEWORK =================
export const getChildHomework = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { studentId } = req.params;

        // Verify student belongs to parent
        const student = await Student.findOne({ _id: studentId, parentId });
        if (!student) {
            return res.status(403).json({ success: false, message: "Unauthorized access to student data" });
        }

        // Get homework for student's class and section
        const homeworks = await Homework.find({
            classId: student.classId,
            sectionId: student.sectionId,
            status: "published"
        })
            .populate("subjectId", "name")
            .populate("teacherId", "firstName lastName")
            .sort({ dueDate: -1 });

        const today = new Date();

        // Use Promise.all to fetch submission status for each homework
        const homeworkList = await Promise.all(homeworks.map(async (hw) => {
            const submission = await HomeworkSubmission.findOne({
                homeworkId: hw._id,
                studentId: student._id
            });

            let status = "Pending";
            if (submission) {
                status = "Submitted";
            } else if (new Date(hw.dueDate) < today) {
                status = "Late";
            }

            return {
                id: hw._id,
                subject: hw.subjectId?.name || "N/A",
                title: hw.title,
                dueDate: hw.dueDate,
                status,
                teacher: hw.teacherId ? `${hw.teacherId.firstName} ${hw.teacherId.lastName}` : "N/A",
                description: hw.instructions,
                attachments: hw.attachments || []
            };
        }));

        res.status(200).json({
            success: true,
            data: homeworkList
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CHILD FEES =================
export const getChildFees = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { studentId } = req.params;

        // Verify student belongs to parent
        const student = await Student.findOne({ _id: studentId, parentId });
        if (!student) {
            return res.status(403).json({ success: false, message: "Unauthorized access to student data" });
        }

        // Get fee structure for student's class
        const feeStructures = await FeeStructure.find({
            applicableClasses: student.classId,
            status: "active"
        });

        // Get all payments for this student
        const payments = await FeePayment.find({
            studentId,
            status: "Success"
        }).sort({ paymentDate: -1 });

        // Fetch taxes for student's branch
        const branchId = student.branchId?.toString();
        const taxes = branchId ? await Tax.find({ branchId, isActive: true }).lean() : [];

        // Build breakdown by fee structure (with tax)
        let grandTotal = 0;
        let grandPaid = 0;
        const breakdown = feeStructures.map(fs => {
            const baseAmount = fs.totalAmount || 0;
            const { totalTax } = calculateTaxFromRules(baseAmount, taxes, "fees");
            const fsTotal = baseAmount + totalTax;

            const structurePayments = payments.filter(
                p => p.feeStructureId?.toString() === fs._id.toString()
            );
            const paidAmount = structurePayments.reduce((sum, p) => sum + p.amountPaid, 0);

            // Accumulate grand totals from active structures
            grandTotal += fsTotal;
            grandPaid += paidAmount;
            const pending = fsTotal - paidAmount;

            let remainingPaid = paidAmount;

            return {
                id: fs._id,
                head: fs.name,
                total: fsTotal,
                baseAmount,
                totalTax,
                paid: paidAmount,
                pending,
                status: pending <= 0 ? "Paid" : (paidAmount > 0 ? "Partial" : "Due"),
                installments: fs.installments?.map(inst => {
                    const proportionalTax = baseAmount > 0 ? Math.round((inst.amount / baseAmount) * totalTax) : 0;
                    const amountWithTax = inst.amount + proportionalTax;

                    let status = "Due";
                    if (remainingPaid >= amountWithTax) {
                        status = "Paid";
                        remainingPaid -= amountWithTax;
                    } else if (remainingPaid > 0) {
                        status = "Partial";
                        remainingPaid = 0;
                    } else if (new Date(inst.dueDate) < new Date()) {
                        status = "Overdue";
                    }

                    return {
                        term: inst.name,
                        amount: amountWithTax,
                        due: inst.dueDate,
                        status: status,
                        mode: null
                    };
                }) || []
            };
        });

        // Get receipts
        const receipts = payments.map(p => ({
            id: p.receiptNo || p._id,
            date: p.paymentDate,
            amount: p.amountPaid,
            mode: p.paymentMethod
        }));

        // Find next due date
        let nextDue = null;
        feeStructures.forEach(fs => {
            fs.installments?.forEach(inst => {
                if (new Date(inst.dueDate) > new Date()) {
                    if (!nextDue || new Date(inst.dueDate) < new Date(nextDue)) {
                        nextDue = inst.dueDate;
                    }
                }
            });
        });

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    total: grandTotal,
                    paid: grandPaid,
                    pending: grandTotal - grandPaid,
                    nextDue
                },
                breakdown,
                receipts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET PARENT NOTICES =================
export const getParentNotices = async (req, res) => {
    try {
        const parentId = req.user._id;
        const parent = await Parent.findById(parentId);

        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        // Get notices targeted to parents
        const notices = await Notice.find({
            instituteId: parent.instituteId,
            $or: [
                { audiences: "All Parents" },
                { audiences: "All Students" }, // Often relevant to parents too
                { audiences: { $exists: false } }
            ],
            status: "PUBLISHED"
        }).sort({ createdAt: -1 });

        // Get acknowledgments for this parent
        const acks = await NoticeAcknowledgment.find({
            userId: parentId,
            noticeId: { $in: notices.map(n => n._id) }
        });

        const ackMap = new Map();
        acks.forEach(ack => ackMap.set(ack.noticeId.toString(), ack.acknowledgedAt));

        res.status(200).json({
            success: true,
            data: notices.map(n => ({
                id: n._id,
                title: n.title,
                category: n.category,
                date: n.createdAt,
                content: n.content,
                priority: n.priority,
                attachments: n.attachments || [],
                requiresAck: n.ackRequired,
                ackStatus: ackMap.get(n._id.toString()) ? new Date(ackMap.get(n._id.toString())).toLocaleDateString() : null,
                isImportant: ["IMPORTANT", "URGENT"].includes(n.priority),
                isRead: !!ackMap.get(n._id.toString()), // Simple read status based on ack for now
                acknowledged: !!ackMap.get(n._id.toString())
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CHILD EXAM RESULTS =================
export const getChildExamResults = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { studentId } = req.params;

        // Verify student belongs to parent
        const student = await Student.findOne({ _id: studentId, parentId });
        if (!student) {
            return res.status(403).json({ success: false, message: "Unauthorized access to student data" });
        }

        // Get all exam results for student
        const results = await ExamResult.find({ studentId })
            .populate({
                path: "examId",
                select: "title examType startDate"
            })
            .populate({
                path: "results.subjectId",
                select: "name"
            })
            .sort({ createdAt: -1 });

        const examList = results.map((result, index) => ({
            id: result._id,
            title: result.examId?.title || "Exam",
            type: result.examId?.examType || "Term",
            date: result.examId?.startDate,
            status: result.overallStatus === "Pass" ? "Passed" : (result.overallStatus === "Fail" ? "Needs Improvement" : result.overallStatus),
            overall: `${result.percentage || 0}%`,
            grade: result.overallGrade || "N/A",
            isLatest: index === 0,
            totalMarks: result.totalMaxMarks,
            obtainedMarks: result.totalMarksObtained,
            remarks: result.remarks,
            subjects: result.results?.map(r => ({
                name: r.subjectId?.name || "Subject",
                marks: r.marksObtained,
                total: r.totalMarks,
                grade: r.grade || "N/A",
                remark: r.remarks || ""
            })) || []
        }));

        res.status(200).json({
            success: true,
            data: examList
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CHILD TEACHERS =================
export const getChildTeachers = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { studentId } = req.params;

        // Verify student belongs to parent
        const student = await Student.findOne({ _id: studentId, parentId })
            .populate("classId", "name")
            .populate("sectionId", "name");
        if (!student) {
            return res.status(403).json({ success: false, message: "Unauthorized access to student data" });
        }

        // Get teachers for this section via TeacherMapping
        const mappings = await TeacherMapping.find({
            sectionId: student.sectionId?._id || student.sectionId,
            status: "active"
        })
            .populate("teacherId", "name email phone qualifications experience")
            .populate("subjectId", "name");

        const teachers = mappings.map(mapping => {
            const teacher = mapping.teacherId;
            return {
                id: teacher._id,
                name: teacher.name,
                subject: mapping.subjectId?.name || "Multiple Subjects",
                qualification: teacher.qualifications || "N/A",
                experience: teacher.experience || "N/A",
                email: teacher.email,
                phone: teacher.phone,
                isClassTeacher: false, // Could be derived if Class model stores class teacher logic
                forClass: `${student.classId?.name || ''}-${student.sectionId?.name || ''}`
            };
        });

        res.status(200).json({
            success: true,
            data: teachers
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET PARENT PROFILE =================
export const getParentProfile = async (req, res) => {
    try {
        const parentId = req.user._id;
        const parent = await Parent.findById(parentId).select("-password");

        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        // Get linked children count
        const childrenCount = await Student.countDocuments({ parentId });

        res.status(200).json({
            success: true,
            data: {
                ...parent._doc,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parent.name)}&background=0D8ABC&color=fff`,
                childrenCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE PARENT PROFILE =================
export const updateParentProfile = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { name, email, address, occupation } = req.body;

        const parent = await Parent.findByIdAndUpdate(
            parentId,
            { $set: { name, email, address, occupation } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: parent
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= ACKNOWLEDGE NOTICE =================
export const acknowledgeNotice = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { noticeId } = req.params;

        const notice = await Notice.findById(noticeId);
        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        // Check if already acknowledged
        const existingAck = await NoticeAcknowledgment.findOne({
            noticeId,
            userId: parentId
        });

        if (existingAck) {
            return res.status(200).json({ success: true, message: "Already acknowledged" });
        }

        const newAck = new NoticeAcknowledgment({
            noticeId,
            userId: parentId,
            userType: "Parent",
            acknowledgedAt: new Date()
        });

        await newAck.save();

        res.status(200).json({
            success: true,
            message: "Notice acknowledged successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CHILD DOCUMENTS =================
export const getChildDocuments = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { studentId } = req.params;

        const student = await Student.findOne({ _id: studentId, parentId });
        if (!student) {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }

        // Return student documents
        const docs = [];
        if (student.documents) {
            Object.entries(student.documents).forEach(([key, value]) => {
                // Determine status for frontend
                let status = "Not Generated";
                if (value.url) {
                    status = "Available";
                } else if (value.status === "in_review") {
                    status = "Pending Upload";
                }

                // Infer type from URL or default
                let type = "Document";
                if (key.toLowerCase().includes("cert")) type = "Certificate";
                else if (key.toLowerCase().includes("mark") || key.toLowerCase().includes("card")) type = "Academic";
                else if (key.toLowerCase().includes("medical")) type = "Medical";

                // Only include if url exists or status is meaningful (not just empty placeholder)
                if (value.url || value.status) {
                    docs.push({
                        id: key,
                        name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(), // Camel to Title Case
                        url: value.url,
                        type: type,
                        date: value.date || student.updatedAt,
                        status: status
                    });
                }
            });
        }

        res.status(200).json({
            success: true,
            data: docs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= PAY CHILD FEE =================
export const payChildFee = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { studentId } = req.params;
        const { feeStructureId, amount, paymentMethod, transactionId } = req.body;

        const student = await Student.findOne({ _id: studentId, parentId });
        if (!student) {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }

        const payment = new FeePayment({
            instituteId: student.instituteId,
            branchId: student.branchId,
            studentId,
            feeStructureId,
            amountPaid: amount,
            paymentMethod,
            transactionId,
            paymentDate: new Date(),
            status: "Success",
            receiptNo: `REC-${Date.now()}`
        });

        await payment.save();

        res.status(200).json({
            success: true,
            message: "Payment recorded successfully",
            data: payment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CHANGE PARENT PASSWORD =================
export const changeParentPassword = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({ success: false, message: "Parent not found" });
        }

        const isMatch = await parent.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid current password" });
        }

        parent.password = newPassword;
        await parent.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CHILD TICKETS =================
export const getChildTickets = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { studentId } = req.params;

        const student = await Student.findOne({ _id: studentId, parentId });
        if (!student) {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }

        const tickets = await SupportTicket.find({
            studentId,
            raisedBy: parentId,
            raisedByType: "Parent"
        })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CREATE CHILD TICKET =================
export const createChildTicket = async (req, res) => {
    try {
        const parentId = req.user._id;
        const { studentId } = req.params;
        const { category, topic, details, priority, attachment } = req.body;

        const student = await Student.findOne({ _id: studentId, parentId });
        if (!student) {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }

        const ticket = new SupportTicket({
            instituteId: student.instituteId,
            studentId,
            raisedBy: parentId,
            raisedByType: "Parent",
            category,
            topic,
            details,
            priority: priority || "Normal",
            attachment
        });

        await ticket.save();

        res.status(201).json({ success: true, message: "Ticket raised successfully", data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
