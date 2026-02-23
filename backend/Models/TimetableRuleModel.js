import mongoose from "mongoose";

const timetableRuleSchema = new mongoose.Schema(
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
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            default: null,
        },
        // Global Time Settings
        startTime: {
            type: String,
            default: "08:00",
        },
        endTime: {
            type: String,
            default: "15:30",
        },
        workingDays: {
            type: [String],
            default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },

        // Period Rules
        periodDuration: {
            type: Number,
            default: 45, // in minutes
        },
        shortBreakDuration: {
            type: Number,
            default: 15, // in minutes
        },
        lunchBreakDuration: {
            type: Number,
            default: 45, // in minutes
        },
        maxPeriodsStudent: {
            type: Number,
            default: 8,
        },
        maxPeriodsTeacher: {
            type: Number,
            default: 6,
        },

        // Workload Rules
        maxConsecutive: {
            type: Number,
            default: 3,
        },
        maxWeeklyHours: {
            type: Number,
            default: 24,
        },
        minFreePeriods: {
            type: Number,
            default: 2,
        },

        // Conflict Rules
        preventTeacherOverlap: {
            type: Boolean,
            default: true,
        },
        preventRoomOverlap: {
            type: Boolean,
            default: true,
        },
        preventStudentOverlap: {
            type: Boolean,
            default: true,
        },
        allowExamOverride: {
            type: Boolean,
            default: false,
        },

        isLocked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

timetableRuleSchema.index({ instituteId: 1, branchId: 1, academicYearId: 1 }, { unique: true });

export default mongoose.model("TimetableRule", timetableRuleSchema);
