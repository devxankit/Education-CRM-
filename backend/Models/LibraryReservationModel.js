import mongoose from "mongoose";

const libraryReservationSchema = new mongoose.Schema(
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
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LibraryMember",
            required: true,
        },
        reservationDate: {
            type: Date,
            default: Date.now,
        },
        expiryDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["pending", "available", "completed", "cancelled", "expired"],
            default: "pending",
        },
        notified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

libraryReservationSchema.index({ instituteId: 1, branchId: 1 });
libraryReservationSchema.index({ bookId: 1, status: 1 });

export default mongoose.model("LibraryReservation", libraryReservationSchema);
