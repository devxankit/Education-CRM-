import mongoose from "mongoose";

const teacherMappingSchema = new mongoose.Schema(
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
            // Required for schools
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            // Required for higher education
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            // Required for school (class-based), optional for college (course-based)
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher", // Staff as a teacher
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Unique mapping per section/subject or course/subject in an academic year
// For school: academicYearId + sectionId + subjectId
// For college: academicYearId + courseId + subjectId
teacherMappingSchema.index(
    { academicYearId: 1, sectionId: 1, subjectId: 1 },
    { unique: true, sparse: true }
);
teacherMappingSchema.index(
    { academicYearId: 1, courseId: 1, subjectId: 1 },
    { unique: true, sparse: true }
);

export default mongoose.model("TeacherMapping", teacherMappingSchema);
