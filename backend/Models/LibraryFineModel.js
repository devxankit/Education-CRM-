import mongoose from "mongoose";

const libraryFineSchema = new mongoose.Schema(
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
        issueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BookIssue",
        },
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LibraryMember",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["unpaid", "paid", "waived"],
            default: "unpaid",
        },
        paymentDate: {
            type: Date,
        },
        transactionId: {
            type: String,
        },
    },
    { timestamps: true }
);

libraryFineSchema.index({ instituteId: 1, branchId: 1 });
libraryFineSchema.index({ memberId: 1, status: 1 });

export default mongoose.model("LibraryFine", libraryFineSchema);
