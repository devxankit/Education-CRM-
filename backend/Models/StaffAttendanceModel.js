import mongoose from "mongoose";

const staffAttendanceSchema = new mongoose.Schema(
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
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
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

// Prevent duplicate attendance for same staff on same date
staffAttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

// Index for filtering
staffAttendanceSchema.index({ instituteId: 1, branchId: 1, date: 1 });
staffAttendanceSchema.index({ staffId: 1, date: -1 });

export default mongoose.model("StaffAttendance", staffAttendanceSchema);
