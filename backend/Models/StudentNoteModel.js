import mongoose from "mongoose";

const studentNoteSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            default: "",
        },
        subject: {
            type: String,
            trim: true,
            default: "General",
        },
    },
    { timestamps: true }
);

studentNoteSchema.index({ studentId: 1, createdAt: -1 });

export default mongoose.model("StudentNote", studentNoteSchema);
