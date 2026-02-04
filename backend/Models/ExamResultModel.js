import mongoose from "mongoose";

const examResultSchema = new mongoose.Schema(
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
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        results: [
            {
                subjectId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subject",
                },
                marksObtained: { type: Number },
                totalMarks: { type: Number },
                grade: { type: String },
                remarks: { type: String },
                status: {
                    type: String,
                    enum: ["Pass", "Fail", "Absent"],
                },
            }
        ],
        totalMarksObtained: { type: Number },
        totalMaxMarks: { type: Number },
        percentage: { type: Number },
        overallGrade: { type: String },
        overallStatus: {
            type: String,
            enum: ["Pass", "Fail", "Withheld"],
        },
        remarks: { type: String },
    },
    { timestamps: true }
);

// Unique result for each student per exam
examResultSchema.index({ examId: 1, studentId: 1 }, { unique: true });

export default mongoose.model("ExamResult", examResultSchema);
