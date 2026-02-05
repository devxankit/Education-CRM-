import mongoose from "mongoose";

const homeworkSubmissionSchema = new mongoose.Schema(
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
        homeworkId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Homework",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        submissionDate: {
            type: Date,
            default: Date.now,
        },
        content: {
            type: String, // Text response from student
        },
        attachments: [
            {
                name: String,
                url: String,
            },
        ],
        status: {
            type: String,
            enum: ["Submitted", "Graded", "Late", "Pending"],
            default: "Submitted",
        },
        marks: {
            type: Number,
        },
        feedback: {
            type: String,
        },
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
        },
        gradedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// One submission per student per homework
homeworkSubmissionSchema.index({ homeworkId: 1, studentId: 1 }, { unique: true });

export default mongoose.model("HomeworkSubmission", homeworkSubmissionSchema);
