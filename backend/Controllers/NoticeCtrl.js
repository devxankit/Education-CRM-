import Notice from "../Models/NoticeModel.js";

// ================= CREATE NOTICE =================
export const createNotice = async (req, res) => {
    try {
        const {
            title, content, category, priority, audiences,
            targetClasses, targetSections, targetDepartments,
            channels, status, publishDate, expiryDate, ackRequired,
            attachments, branchId
        } = req.body;

        const instituteId = req.user._id;
        const noticeIdStr = `N-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const notice = new Notice({
            instituteId,
            branchId,
            noticeId: noticeIdStr,
            title,
            content,
            category,
            priority,
            audiences,
            targetClasses,
            targetSections,
            targetDepartments,
            channels,
            status,
            publishDate: publishDate || new Date(),
            expiryDate,
            ackRequired,
            attachments,
            createdBy: req.user._id // Assuming staff/institute user creates it
        });

        await notice.save();

        res.status(201).json({
            success: true,
            message: "Notice created successfully",
            data: notice,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET NOTICES =================
export const getNotices = async (req, res) => {
    try {
        const { branchId, status, category } = req.query;
        const instituteId = req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (status && status !== 'ALL') query.status = status;
        if (category) query.category = category;

        const notices = await Notice.find(query)
            .populate("targetClasses", "name")
            .populate("targetDepartments", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: notices,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET STAFF NOTICES (Audience Filtered) =================
export const getStaffNotices = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const branchId = req.user.branchId;
        const role = req.role; // From AuthMiddleware (teacher, staff, institute)

        const audienceFilter = ["All Staff"];
        if (role === 'teacher') audienceFilter.push("All Teachers");

        let query = {
            instituteId,
            status: "PUBLISHED",
            audiences: { $in: audienceFilter }
        };

        if (branchId && branchId !== "all") {
            query.branchId = branchId;
        }

        const notices = await Notice.find(query)
            .sort({ publishDate: -1 });

        res.status(200).json({
            success: true,
            data: notices,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE NOTICE =================
export const updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const notice = await Notice.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({
            success: true,
            message: "Notice updated successfully",
            data: notice,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE NOTICE =================
export const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const notice = await Notice.findByIdAndDelete(id);

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        res.status(200).json({
            success: true,
            message: "Notice deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
