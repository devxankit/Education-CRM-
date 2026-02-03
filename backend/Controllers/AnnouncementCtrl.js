import Announcement from "../Models/AnnouncementModel.js";

// ================= CREATE ANNOUNCEMENT =================
export const createAnnouncement = async (req, res) => {
    try {
        const {
            title, content, category, audiences,
            channels, status, publishDate, coverImage, branchId
        } = req.body;

        const instituteId = req.user._id;
        const annIdStr = `A-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

        const announcement = new Announcement({
            instituteId,
            branchId,
            announcementId: annIdStr,
            title,
            content,
            category,
            audiences,
            channels,
            status,
            publishDate: publishDate || new Date(),
            coverImage,
            createdBy: req.user._id
        });

        await announcement.save();

        res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            data: announcement,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ANNOUNCEMENTS =================
export const getAnnouncements = async (req, res) => {
    try {
        const { branchId, status } = req.query;
        const instituteId = req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (status && status !== 'ALL') query.status = status;

        const announcements = await Announcement.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: announcements,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE ANNOUNCEMENT =================
export const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const announcement = await Announcement.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!announcement) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            data: announcement,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE ANNOUNCEMENT =================
export const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findByIdAndDelete(id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        res.status(200).json({
            success: true,
            message: "Announcement deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
