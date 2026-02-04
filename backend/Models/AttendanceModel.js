import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            // Required if subject-wise attendance is taken
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        attendanceData: [
            {
                studentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Student",
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["Present", "Absent", "Late", "Half-Day", "Leave"],
                    default: "Present",
                },
                remarks: {
                    type: String,
                    trim: true,
                },
            },
        ],
        status: {
            type: String,
            enum: ["Draft", "Submitted"],
            default: "Submitted",
        },
    },
    { timestamps: true }
);

// Prevent multiple attendance records for the same class/section/subject/date
attendanceSchema.index({ classId: 1, sectionId: 1, subjectId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
