import Branch from "../Models/BranchModel.js";

// ================= CREATE BRANCH =================
export const createBranch = async (req, res) => {
    try {
        const {
            code, name, type, establishedYear, address,
            city, state, phone, email, allowAdmissions, allowFeeCollection
        } = req.body;

        const instituteId = req.user._id;

        // Check if code already exists
        const existingBranch = await Branch.findOne({ code });
        if (existingBranch) {
            return res.status(400).json({
                success: false,
                message: "Branch with this code already exists",
            });
        }

        const branch = new Branch({
            instituteId,
            code,
            name,
            type,
            establishedYear,
            address,
            city,
            state,
            phone,
            email,
            allowAdmissions,
            allowFeeCollection
        });

        await branch.save();

        res.status(201).json({
            success: true,
            message: "Branch created successfully",
            data: branch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL BRANCHES =================
export const getBranches = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const branches = await Branch.find({ instituteId });

        res.status(200).json({
            success: true,
            data: branches,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET SINGLE BRANCH =================
export const getBranchById = async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await Branch.findById(id);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            data: branch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE BRANCH =================
export const updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove immutable fields if any
        delete updateData.code;
        delete updateData.instituteId;

        const branch = await Branch.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Branch updated successfully",
            data: branch,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= DELETE BRANCH =================
export const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await Branch.findByIdAndDelete(id);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
