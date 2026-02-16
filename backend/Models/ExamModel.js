import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
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
        examName: {
            type: String, // e.g., "Term 1", "Final Exam", "Monthly Test"
            required: true,
            trim: true,
        },
        examType: {
            type: String, // e.g., "Unit Test 1", "Mid-Term", "Final" (Synced with Policy)
            default: "Internal",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
        },
        classes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class",
            }
        ],
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            }
        ],
        subjects: [
            {
                subjectId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Subject",
                },
                date: { type: Date },
                startTime: { type: String }, // e.g., "10:00 AM"
                endTime: { type: String },   // e.g., "01:00 PM"
                maxMarks: { type: Number },
                passingMarks: { type: Number },
                roomNo: { type: String },
            }
        ],
        status: {
            type: String,
            enum: ["Draft", "Published", "Cancelled", "Completed"],
            default: "Published",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
