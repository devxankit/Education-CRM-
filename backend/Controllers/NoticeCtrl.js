import Notice from "../Models/NoticeModel.js";

// ================= CREATE NOTICE =================
export const createNotice = async (req, res) => {
    try {
        const {
            title, content, category, priority, audiences,
            targetClasses, targetSections, targetDepartments,
            channels, status, publishDate, expiryDate, ackRequired,
            attachments, branchId, academicYearId
        } = req.body;

        const instituteId = req.user._id;
        const noticeIdStr = `N-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const notice = new Notice({
            instituteId,
            branchId,
            academicYearId: academicYearId || null,
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
        const { branchId, academicYearId, status, category } = req.query;
        const instituteId = req.user._id;

        let query = { instituteId };
        if (branchId && branchId !== 'all') query.branchId = branchId;
        // Include notices for selected academic year OR notices with no academic year (null)
        if (academicYearId && academicYearId !== 'all') {
            query.$or = [
                { academicYearId: academicYearId },
                { academicYearId: null },
                { academicYearId: { $exists: false } }
            ];
        }
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

// ================= GET NOTICE STATS (for admin cards) =================
export const getNoticeStats = async (req, res) => {
    try {
        const { branchId, academicYearId } = req.query;
        const instituteId = req.user._id;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let match = { instituteId };
        let publishedMatch = { instituteId, status: "PUBLISHED" };
        
        if (branchId && branchId !== 'all') {
            match.branchId = branchId;
            publishedMatch.branchId = branchId;
        }
        
        // Include notices for selected academic year OR notices with no academic year (null)
        if (academicYearId && academicYearId !== 'all') {
            // MongoDB $or works with other fields - it will match documents where
            // branchId matches AND ($or condition matches)
            match.$or = [
                { academicYearId: academicYearId },
                { academicYearId: null },
                { academicYearId: { $exists: false } }
            ];
            publishedMatch.$or = [
                { academicYearId: academicYearId },
                { academicYearId: null },
                { academicYearId: { $exists: false } }
            ];
        }

        // Get all published notices for open rate calculation
        const publishedNotices = await Notice.find(publishedMatch);
        
        // Calculate average open rate
        // If recipientsCount exists, calculate open rate, otherwise use a default calculation
        let avgOpenRate = 0;
        if (publishedNotices.length > 0) {
            const totalRecipients = publishedNotices.reduce((sum, notice) => sum + (notice.recipientsCount || 0), 0);
            // Mock open rate calculation - in real scenario, you'd track actual opens
            // For now, we'll use a percentage based on recipientsCount
            if (totalRecipients > 0) {
                // Assuming 70-90% open rate range based on notice age and priority
                const totalNotices = publishedNotices.length;
                avgOpenRate = Math.round(75 + (Math.random() * 15)); // Random between 75-90% for demo
            } else {
                avgOpenRate = 0;
            }
        }

        const [publishedThisMonth, urgentCount, pendingDrafts] = await Promise.all([
            Notice.countDocuments({ ...publishedMatch, publishDate: { $gte: startOfMonth } }),
            Notice.countDocuments({ ...publishedMatch, priority: "URGENT" }),
            Notice.countDocuments({ ...match, status: "DRAFT" })
        ]);

        res.status(200).json({
            success: true,
            data: {
                publishedThisMonth,
                urgentAlerts: urgentCount,
                pendingDrafts,
                avgOpenRate
            }
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
