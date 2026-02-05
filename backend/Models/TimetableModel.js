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
            required: true,
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },
        schedule: {
            Mon: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Tue: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Wed: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Thu: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Fri: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Sat: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
                    startTime: String,
                    endTime: String,
                    room: String,
                    type: { type: String, enum: ["offline", "online"], default: "offline" },
                    link: String,
                }
            ],
            Sun: [
                {
                    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
                    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
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

// One timetable per section per academic year
timetableSchema.index({ academicYearId: 1, sectionId: 1 }, { unique: true });

export default mongoose.model("Timetable", timetableSchema);
