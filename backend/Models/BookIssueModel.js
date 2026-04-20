import mongoose from "mongoose";

const bookIssueSchema = new mongoose.Schema(
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
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LibraryMember",
            required: true,
        },
        issueDate: {
            type: Date,
            default: Date.now,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["issued", "returned", "overdue", "lost"],
            default: "issued",
        },
        fineAmount: {
            type: Number,
            default: 0,
        },
        remarks: {
            type: String,
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff", // User who performed the issue
        },
    },
    { timestamps: true }
);

bookIssueSchema.index({ instituteId: 1, branchId: 1 });
bookIssueSchema.index({ memberId: 1 });
bookIssueSchema.index({ bookId: 1 });

export default mongoose.model("BookIssue", bookIssueSchema);
