import mongoose from "mongoose";
import Role from "../Models/RoleModel.js";

// ================= CREATE ROLE =================
export const createRole = async (req, res) => {
    try {
        const { name, code, description, permissions, type, defaultDashboard, branchId } = req.body;
        const instituteId = req.user._id;

        // Check if code exists for this institute
        const existingRole = await Role.findOne({ instituteId, code: code.toUpperCase() });
        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: "Role code already exists for this institute",
            });
        }

        const role = new Role({
            instituteId,
            branchId: branchId && branchId !== 'all' ? branchId : null,
            name,
            code: code.toUpperCase(),
            description,
            permissions,
            type,
            defaultDashboard: defaultDashboard || "/admin/dashboard",
        });

        await role.save();

        res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL ROLES =================
export const getRoles = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user._id;
        const matchStage = { instituteId };
        if (branchId && branchId !== 'all' && branchId.length === 24) {
            matchStage.$or = [
                { branchId: null },
                { branchId: new mongoose.Types.ObjectId(branchId) }
            ];
        }
        const data = await Role.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "staffs",
                    localField: "_id",
                    foreignField: "roleId",
                    as: "staffList"
                }
            },
            {
                $lookup: {
                    from: "branches",
                    localField: "branchId",
                    foreignField: "_id",
                    as: "branchInfo"
                }
            },
            {
                $addFields: {
                    userCount: { $size: "$staffList" },
                    branchName: { $arrayElemAt: ["$branchInfo.name", 0] }
                }
            },
            { $project: { staffList: 0, branchInfo: 0 } }
        ]);
        const roles = data.map(r => ({
            ...r,
            id: r._id,
            defaultDashboard: r.defaultDashboard || "/admin/dashboard",
        }));

        res.status(200).json({
            success: true,
            data: roles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET PUBLIC ROLES (FOR LOGIN) =================
export const getPublicRoles = async (req, res) => {
    try {
        // Fetch all active roles. In a multi-tenant setup, you'd filter by institute via query param.
        const roles = await Role.find({ status: 'active' }).select('name code');

        res.status(200).json({
            success: true,
            data: roles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE ROLE =================
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const role = await Role.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        // Notify connected clients about role update
        const io = req.app.get('io');
        if (io) {
            io.emit('role_updated', { roleId: role._id, permissions: role.permissions });
        }

        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= DELETE ROLE =================
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if it's a system role
        const role = await Role.findById(id);
        if (role && role.type === 'system') {
            return res.status(400).json({
                success: false,
                message: "System roles cannot be deleted"
            });
        }

        await Role.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
