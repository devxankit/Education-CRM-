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
            required: true, // Specific class section
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

// Unique mapping per section and subject in an academic year
teacherMappingSchema.index(
    { academicYearId: 1, sectionId: 1, subjectId: 1 },
    { unique: true }
);

export default mongoose.model("TeacherMapping", teacherMappingSchema);
