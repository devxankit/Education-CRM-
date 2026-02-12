import mongoose from "mongoose";

const teacherAttendanceSchema = new mongoose.Schema(
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
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["Present", "Absent", "Late", "Half-Day", "Leave"],
            required: true,
            default: "Present",
        },
        checkInTime: {
            type: Date,
        },
        checkOutTime: {
            type: Date,
        },
        remarks: {
            type: String,
            trim: true,
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
        },
    },
    { timestamps: true }
);

// Prevent duplicate attendance for same teacher on same date
teacherAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true });

// Index for filtering
teacherAttendanceSchema.index({ instituteId: 1, branchId: 1, date: 1 });
teacherAttendanceSchema.index({ teacherId: 1, date: -1 });

export default mongoose.model("TeacherAttendance", teacherAttendanceSchema);
