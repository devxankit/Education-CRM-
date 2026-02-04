import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
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
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        instructions: {
            type: String,
            trim: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        attachments: [
            {
                name: String,
                url: String,
            },
        ],
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "published",
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Homework", homeworkSchema);
