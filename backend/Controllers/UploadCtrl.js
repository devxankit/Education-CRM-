import { uploadToCloudinary } from "../Helpers/cloudinaryHelper.js";

export const uploadSingleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const folder = req.body.folder || "general";
        const imageUrl = await uploadToCloudinary(req.file.buffer, folder);

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            url: imageUrl
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No files uploaded" });
        }

        const folder = req.body.folder || "general";
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, folder));
        const urls = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            urls
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
