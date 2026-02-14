import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
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
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            // Required for school, optional for college
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            // Required for college, optional for school
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            // Required for school, optional for college
        },
        schedule: {
            Mon: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Tue: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Wed: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Thu: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Fri: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Sat: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Sun: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Unique indexes: For school (section-based) and college (course-based)
// Use sparse indexes - they skip documents where the indexed field is null/undefined
// This prevents duplicate key errors when courseId or sectionId is null
timetableSchema.index(
    { academicYearId: 1, sectionId: 1 }, 
    { 
        unique: true, 
        sparse: true
    }
);
timetableSchema.index(
    { academicYearId: 1, courseId: 1 }, 
    { 
        unique: true, 
        sparse: true
    }
);

export default mongoose.model("Timetable", timetableSchema);
