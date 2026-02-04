import AssetCategory from "../Models/AssetCategoryModel.js";

// ================= CREATE CATEGORY =================
export const createAssetCategory = async (req, res) => {
    try {
        const { name, code, type, trackingType, serialRequired, depreciation, depMethod, branchId } = req.body;
        const instituteId = req.user._id;

        if (!branchId || branchId === 'main') {
            return res.status(400).json({ success: false, message: "A valid Branch ID is required to create a category" });
        }

        const category = new AssetCategory({
            instituteId,
            branchId,
            name,
            code,
            type,
            trackingType,
            serialRequired,
            depreciation,
            depMethod,
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: "Asset category created successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET CATEGORIES =================
export const getAssetCategories = async (req, res) => {
    try {
        const { branchId, status, type } = req.query;
        const instituteId = req.user._id;

        let query = { instituteId };
        if (branchId && branchId !== 'main' && branchId.length === 24) {
            query.branchId = branchId;
        } else if (branchId === 'main') {
            // If main, maybe return all or none? 
            // Most other controllers return empty list or filter by institute only.
            // Let's keep it consistent: if branchId is main, we don't filter by branchId.
        }

        if (status) query.status = status;
        if (type) query.type = type;

        const categories = await AssetCategory.find(query).sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE CATEGORY =================
export const updateAssetCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const category = await AssetCategory.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Asset category updated successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE CATEGORY =================
export const deleteAssetCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // In a real scenario, check if any assets are linked to this category
        await AssetCategory.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Asset category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
