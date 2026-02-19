import mongoose from "mongoose";

const classCompletionSchema = new mongoose.Schema(
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
            required: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        // Period details from timetable
        day: {
            type: String,
            enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        room: {
            type: String,
        },
        // Completion details
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["Completed", "Cancelled", "Rescheduled"],
            default: "Completed",
        },
        actualStartTime: {
            type: String, // When teacher actually started
        },
        actualEndTime: {
            type: String, // When teacher actually ended
        },
        topicsCovered: {
            type: String, // Topics taught in this class
        },
        remarks: {
            type: String,
        },
        // Attendance summary
        totalStudents: {
            type: Number,
            default: 0,
        },
        presentStudents: {
            type: Number,
            default: 0,
        },
        absentStudents: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Index for quick lookups
classCompletionSchema.index({ teacherId: 1, date: 1, day: 1 });
classCompletionSchema.index({ classId: 1, sectionId: 1, date: 1 });
classCompletionSchema.index({ subjectId: 1, date: 1 });
// Prevent duplicate entries for same period on same date
classCompletionSchema.index(
    { teacherId: 1, classId: 1, sectionId: 1, subjectId: 1, day: 1, date: 1, startTime: 1 },
    { unique: true }
);

export default mongoose.model("ClassCompletion", classCompletionSchema);
