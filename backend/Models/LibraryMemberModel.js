import mongoose from "mongoose";

const libraryMemberSchema = new mongoose.Schema(
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
        memberType: {
            type: String,
            enum: ["student", "teacher", "staff"],
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
        },
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
        },
        libraryCardNo: {
            type: String,
            required: true,
            unique: true,
        },
        joinDate: {
            type: Date,
            default: Date.now,
        },
        expiryDate: {
            type: Date,
        },
        maxBooksAllowed: {
            type: Number,
            default: 2,
        },
        status: {
            type: String,
            enum: ["active", "suspended", "expired"],
            default: "active",
        },
    },
    { timestamps: true }
);

libraryMemberSchema.index({ instituteId: 1, branchId: 1 });
libraryMemberSchema.index({ libraryCardNo: 1 }, { unique: true });

export default mongoose.model("LibraryMember", libraryMemberSchema);
