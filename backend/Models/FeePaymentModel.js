import mongoose from "mongoose";

const feePaymentSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        feeStructureId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FeeStructure",
            required: true,
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        amountPaid: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Cheque", "Bank Transfer", "Online", "Other"],
            required: true,
        },
        transactionId: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Success", "Pending", "Failed"],
            default: "Success",
        },
        remarks: {
            type: String,
            trim: true,
        },
        receiptNo: {
            type: String,
            unique: true,
        }
    },
    { timestamps: true }
);

export default mongoose.model("FeePayment", feePaymentSchema);
