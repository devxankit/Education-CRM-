import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
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
        announcementId: {
            type: String,
            unique: true,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["GENERAL", "EVENT", "ACADEMIC", "ACTIVITIES", "ACHIEVEMENTS"],
            default: "GENERAL",
        },
        audiences: [
            {
                type: String,
            }
        ],
        channels: [
            {
                type: String,
                enum: ["APP", "EMAIL", "SMS"],
                default: ["APP"],
            }
        ],
        status: {
            type: String,
            enum: ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"],
            default: "DRAFT",
        },
        publishDate: {
            type: Date,
            default: Date.now,
        },
        coverImage: {
            type: String, // Cloudinary URL
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
        },
        recipientsCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

announcementSchema.index({ instituteId: 1, branchId: 1 });

export default mongoose.model("Announcement", announcementSchema);
