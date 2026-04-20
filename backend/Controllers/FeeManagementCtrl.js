import Student from "../Models/StudentModel.js";
import FeeStructure from "../Models/FeeStructureModel.js";
import FeePayment from "../Models/FeePaymentModel.js";
import { calculateTax } from "../Helpers/calculateTax.js";

/**
 * Get Fee status for students based on filters
 */
export const getFeeManagementStatus = async (req, res) => {
    try {
        const { branchId, academicYearId, classId, sectionId, courseId, status } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (academicYearId) query.academicYearId = academicYearId;
        if (classId) query.classId = classId;
        if (sectionId) query.sectionId = sectionId;
        if (courseId) query.courseId = courseId;
        if (status) query.status = status;

        // Fetch students
        const students = await Student.find(query)
            .populate("classId", "name")
            .populate("sectionId", "name")
            .populate("courseId", "name")
            .populate("branchId", "name")
            .select("firstName lastName admissionNo rollNo classId sectionId courseId branchId status")
            .lean();

        // Get all applicable fee structures for these students
        // To be efficient, we'll fetch all fee structures for this institute
        const allFeeStructures = await FeeStructure.find({ instituteId, status: "active" }).lean();

        // Get all payments for these students
        const studentIds = students.map(s => s._id);
        const allPayments = await FeePayment.find({ studentId: { $in: studentIds } }).lean();

        // Process each student to calculate fee status
        const feeStatusData = await Promise.all(students.map(async (student) => {
            // Find applicable fee structure
            // Priority: Course-specific structure if student is in a course, otherwise Class-specific
            let studentFeeStructure = null;
            if (student.courseId) {
                studentFeeStructure = allFeeStructures.find(fs => 
                    fs.applicableCourses?.some(c => c.toString() === student.courseId._id.toString())
                );
            }
            if (!studentFeeStructure && student.classId) {
                studentFeeStructure = allFeeStructures.find(fs => 
                    fs.applicableClasses?.some(c => c.toString() === student.classId._id.toString())
                );
            }

            if (!studentFeeStructure) {
                return {
                    ...student,
                    feeStatus: {
                        totalFee: 0,
                        paid: 0,
                        balance: 0,
                        status: "No Structure"
                    }
                };
            }

            // Calculate total fee including tax
            const baseAmount = studentFeeStructure.totalAmount || 0;
            const branch = student.branchId?._id || branchId;
            const { totalTax } = await calculateTax(baseAmount, branch, "fee", instituteId);
            const totalFee = baseAmount + totalTax;

            // Calculate paid amount
            const studentPayments = allPayments.filter(p => p.studentId.toString() === student._id.toString());
            const paid = studentPayments.reduce((acc, p) => acc + (p.amountPaid || 0), 0);

            const balance = totalFee - paid;
            let paymentStatus = "Pending";
            if (balance <= 0 && totalFee > 0) paymentStatus = "Paid";
            else if (paid > 0) paymentStatus = "Partial";

            return {
                ...student,
                feeStatus: {
                    totalFee,
                    paid,
                    balance,
                    status: paymentStatus,
                    structureName: studentFeeStructure.name
                }
            };
        }));

        res.status(200).json({
            success: true,
            count: feeStatusData.length,
            data: feeStatusData
        });

    } catch (error) {
        console.error("Error in getFeeManagementStatus:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
