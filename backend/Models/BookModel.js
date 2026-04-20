import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
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
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        isbn: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        publisher: {
            type: String,
            trim: true,
        },
        publishYear: {
            type: Number,
        },
        price: {
            type: Number,
            default: 0,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        availableQuantity: {
            type: Number,
            required: true,
            default: 1,
        },
        rackNumber: {
            type: String,
            trim: true,
        },
        bookLanguage: {
            type: String,
            default: "English",
        },
        description: {
            type: String,
        },
        coverImageUrl: {
            type: String,
        },
        status: {
            type: String,
            enum: ["available", "out_of_stock", "damaged", "lost"],
            default: "available",
        },
    },
    { timestamps: true }
);

bookSchema.index({ instituteId: 1, branchId: 1 });
bookSchema.index({ title: "text", author: "text" });

export default mongoose.model("Book", bookSchema);
