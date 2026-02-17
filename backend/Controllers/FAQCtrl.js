import FAQ from "../Models/FAQModel.js";

// ================= CREATE FAQ =================
export const createFAQ = async (req, res) => {
    try {
        const { question, answer, category, order } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!question || !answer) {
            return res.status(400).json({ success: false, message: "Question and answer are required" });
        }

        const faq = new FAQ({
            instituteId,
            question: question.trim(),
            answer: answer.trim(),
            category: (category || "General").trim(),
            order: order || 0,
        });
        await faq.save();

        res.status(201).json({
            success: true,
            message: "FAQ added successfully",
            data: faq,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ALL FAQs (Admin) =================
export const getFAQs = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { status } = req.query;

        const query = { instituteId };
        if (status && status !== "all") query.status = status;

        const faqs = await FAQ.find(query).sort({ order: 1, category: 1, createdAt: 1 });

        res.status(200).json({
            success: true,
            data: faqs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET FAQs (Public - for Teacher/Student/Parent portals) =================
export const getPublicFAQs = async (req, res) => {
    try {
        const instituteId = req.user?.instituteId || req.user?._id;
        if (!instituteId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const faqs = await FAQ.find({ instituteId, status: "active" })
            .sort({ order: 1, category: 1, createdAt: 1 })
            .select("question answer category order");

        res.status(200).json({
            success: true,
            data: faqs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE FAQ =================
export const updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, category, order, status } = req.body;

        const updateData = {};
        if (question !== undefined) updateData.question = question.trim();
        if (answer !== undefined) updateData.answer = answer.trim();
        if (category !== undefined) updateData.category = category.trim();
        if (order !== undefined) updateData.order = order;
        if (status !== undefined) updateData.status = status;

        const faq = await FAQ.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

        if (!faq) {
            return res.status(404).json({ success: false, message: "FAQ not found" });
        }

        res.status(200).json({
            success: true,
            message: "FAQ updated successfully",
            data: faq,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE FAQ =================
export const deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await FAQ.findByIdAndDelete(id);

        if (!faq) {
            return res.status(404).json({ success: false, message: "FAQ not found" });
        }

        res.status(200).json({
            success: true,
            message: "FAQ deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
