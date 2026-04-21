import mongoose from "mongoose";

const librarySettingsSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
            unique: true,
        },
        finePerDay: {
            type: Number,
            default: 5,
        },
        maxBooksPerStudent: {
            type: Number,
            default: 3,
        },
        maxBooksPerTeacher: {
            type: Number,
            default: 5,
        },
        returnDaysLimit: {
            type: Number,
            default: 7,
        },
    },
    { timestamps: true }
);

export default mongoose.model("LibrarySettings", librarySettingsSchema);
