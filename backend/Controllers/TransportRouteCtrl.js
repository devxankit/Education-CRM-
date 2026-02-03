import TransportRoute from "../Models/TransportRouteModel.js";

// ================= CREATE ROUTE =================
export const createRoute = async (req, res) => {
    try {
        const { name, code, vehicleNo, driver, capacity, stops, branchId } = req.body;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        const route = new TransportRoute({
            instituteId,
            branchId,
            name,
            code,
            vehicleNo,
            driver,
            capacity,
            stops,
        });

        await route.save();

        res.status(201).json({
            success: true,
            message: "Transport route created successfully",
            data: route,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET ROUTES =================
export const getRoutes = async (req, res) => {
    try {
        const { branchId, status } = req.query;
        const instituteId = req.user._id;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (status) query.status = status;

        const routes = await TransportRoute.find(query).sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: routes,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE ROUTE =================
export const updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const route = await TransportRoute.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!route) {
            return res.status(404).json({ success: false, message: "Route not found" });
        }

        res.status(200).json({
            success: true,
            message: "Transport route updated successfully",
            data: route,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE ROUTE =================
export const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if students are assigned before deletion
        const route = await TransportRoute.findById(id);
        if (route && route.studentsAssigned > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete route with assigned students. Unassign them first."
            });
        }

        await TransportRoute.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Transport route deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
