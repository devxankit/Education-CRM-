import mongoose from "mongoose";

const learningMaterialSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
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
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: ["Note", "Video", "Assignment", "Old Paper", "Syllabus"],
            default: "Note",
        },
        files: [
            {
                name: String,
                url: String,
                fileType: String,
            },
        ],
        tags: [String],
        status: {
            type: String,
            enum: ["Draft", "Published"],
            default: "Published",
        },
    },
    { timestamps: true }
);

export default mongoose.model("LearningMaterial", learningMaterialSchema);
