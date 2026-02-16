import Branch from "../Models/BranchModel.js";
import Student from "../Models/StudentModel.js";
import Staff from "../Models/StaffModel.js";
import Teacher from "../Models/TeacherModel.js";

// ================= CREATE BRANCH =================
export const createBranch = async (req, res) => {
    try {
        const {
            code, name, headName, type, establishedYear, address,
            city, state, phone, email, allowAdmissions, allowFeeCollection
        } = req.body;

        const instituteId = req.user.instituteId || req.user._id;

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
            headName,
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
        const instituteId = req.user.instituteId || req.user._id;
        const { activeOnly } = req.query;

        const query = { instituteId };
        if (activeOnly === 'true') {
            query.isActive = true;
        }

        const branches = await Branch.find(query).lean();

        // Add stats (students, staff, teachers count) per branch
        const branchIds = branches.map((b) => b._id);
        const [studentCounts, staffCounts, teacherCounts] = await Promise.all([
            Student.aggregate([
                { $match: { branchId: { $in: branchIds }, status: { $ne: 'withdrawn' } } },
                { $group: { _id: '$branchId', count: { $sum: 1 } } },
            ]),
            Staff.aggregate([
                { $match: { branchId: { $in: branchIds }, status: 'active' } },
                { $group: { _id: '$branchId', count: { $sum: 1 } } },
            ]),
            Teacher.aggregate([
                { $match: { branchId: { $in: branchIds } } },
                { $group: { _id: '$branchId', count: { $sum: 1 } } },
            ]),
        ]);

        const toMap = (arr) => Object.fromEntries(arr.map((x) => [x._id.toString(), x.count]));
        const studentMap = toMap(studentCounts);
        const staffMap = toMap(staffCounts);
        const teacherMap = toMap(teacherCounts);

        const branchesWithStats = branches.map((b) => ({
            ...b,
            stats: {
                students: studentMap[b._id.toString()] || 0,
                staff: staffMap[b._id.toString()] || 0,
                teachers: teacherMap[b._id.toString()] || 0,
            },
        }));

        res.status(200).json({
            success: true,
            data: branchesWithStats,
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
