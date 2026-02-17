import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
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
        admissionNo: {
            type: String,
            required: true,
            trim: true,
        },
        rollNo: {
            type: String,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        middleName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        parentEmail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            // Optional password for primary students
        },
        dob: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        bloodGroup: {
            type: String,
        },
        nationality: {
            type: String,
            default: "Indian",
        },
        religion: {
            type: String,
        },
        category: {
            type: String,
            default: "General",
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parent",
        },
        // Academic History
        prevSchool: {
            type: String,
        },
        lastClass: {
            type: String,
        },
        // Logistics & Facilities
        transportRequired: {
            type: Boolean,
            default: false,
        },
        routeId: {
            type: String,
        },
        stopId: {
            type: String,
        },
        hostelRequired: {
            type: Boolean,
            default: false,
        },
        bedType: {
            type: String,
        },
        roomType: {
            type: String,
        },
        // Documents
        documents: {
            photo: { name: String, status: { type: String, default: "in_review" }, date: String, url: String },
            birthCert: { name: String, status: { type: String, default: "in_review" }, date: String, url: String },
            transferCert: { name: String, status: { type: String, default: "in_review" }, date: String, url: String },
            aadhar: { name: String, status: { type: String, default: "in_review" }, date: String, url: String },
            prevMarksheet: { name: String, status: { type: String, default: "in_review" }, date: String, url: String },
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: String,
        },
        admissionDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["active", "alumni", "withdrawn", "inactive", "in_review", "waitlisted"],
            default: "in_review",
        },
        isLateApplication: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Password hashing (if password exists)
studentSchema.pre("save", async function () {
    if (!this.password || !this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

// Core Indexes
studentSchema.index({ instituteId: 1, branchId: 1 });
studentSchema.index({ admissionNo: 1 }, { unique: true });

export default mongoose.model("Student", studentSchema);
