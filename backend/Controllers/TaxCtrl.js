import Tax from "../Models/TaxModel.js";

// ================= CREATE TAX =================
export const createTax = async (req, res) => {
    try {
        const { name, description, code, rate, type, applicableOn, branchId } = req.body;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const tax = new Tax({
            instituteId,
            branchId,
            name,
            description,
            code,
            rate,
            type,
            applicableOn,
        });

        await tax.save();

        res.status(201).json({
            success: true,
            message: "Tax rule created successfully",
            data: tax,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET TAXES =================
export const getTaxes = async (req, res) => {
    try {
        const { branchId, isActive } = req.query;
        const instituteId = req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const taxes = await Tax.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: taxes,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE TAX =================
export const updateTax = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const tax = await Tax.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!tax) {
            return res.status(404).json({ success: false, message: "Tax rule not found" });
        }

        res.status(200).json({
            success: true,
            message: "Tax rule updated successfully",
            data: tax,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE TAX =================
export const deleteTax = async (req, res) => {
    try {
        const { id } = req.params;

        const tax = await Tax.findByIdAndDelete(id);

        if (!tax) {
            return res.status(404).json({ success: false, message: "Tax rule not found" });
        }

        res.status(200).json({
            success: true,
            message: "Tax rule deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
