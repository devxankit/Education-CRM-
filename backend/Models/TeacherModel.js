import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema(
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
        employeeId: {
            type: String,
            required: true,
            trim: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        role: {
            type: String,
            default: "teacher"
        },
        department: {
            type: String,
        },
        designation: {
            type: String,
        },
        experience: {
            type: String,
        },
        joiningDate: {
            type: Date,
        },
        teachingStatus: {
            type: String,
            enum: ["Active", "On Leave", "Inactive"],
            default: "Active",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
        academicLevel: {
            type: String,
            enum: ["Primary", "Middle School", "High School", "Senior Secondary", "Undergraduate", "Postgraduate", "Diploma", "Vocational"],
        },
        eligibleSubjects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject"
        }],
        lastLogin: {
            type: Date,
        },
        passwordChangedAt: {
            type: Date,
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Password hashing
teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

teacherSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Core Indexes
teacherSchema.index({ instituteId: 1, branchId: 1 });
teacherSchema.index({ employeeId: 1 }, { unique: true });

export default mongoose.model("Teacher", teacherSchema);
