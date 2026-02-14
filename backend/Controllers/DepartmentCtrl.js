import Department from "../Models/DepartmentModel.js";
import Staff from "../Models/StaffModel.js"; // To count employees

// ================= CREATE DEPARTMENT =================
export const createDepartment = async (req, res) => {
    try {
        const { name, code, type, status, description, branchId, designations } = req.body;
        const instituteId = req.user._id;

        const department = new Department({
            instituteId,
            branchId,
            name,
            code: (code || "").toUpperCase().trim(),
            type: type || "Academic",
            status: status || "Active",
            description: description || "",
            designations: designations || [],
        });

        await department.save();

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET DEPARTMENTS =================
export const getDepartments = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const departments = await Department.find({ instituteId, branchId }).sort({ name: 1 });

        // Enahnce with employee counts (Mock logic or actual query)
        const enhancedDepts = await Promise.all(departments.map(async (dept) => {
            // Here you would normally count employees matching this department name/ID
            // const count = await Staff.countDocuments({ department: dept.name, branchId });
            return {
                ...dept._doc,
                employeeCount: 0, // Placeholder
                designationsCount: dept.designations.length
            };
        }));

        res.status(200).json({
            success: true,
            data: enhancedDepts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE DEPARTMENT =================
export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const allowed = ['name', 'code', 'type', 'status', 'description', 'designations'];
        const updateData = {};
        allowed.forEach(f => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });
        if (updateData.code) updateData.code = updateData.code.toUpperCase().trim();

        const department = await Department.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: department,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE DEPARTMENT =================
export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findByIdAndDelete(id);

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        res.status(200).json({
            success: true,
            message: "Department deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
