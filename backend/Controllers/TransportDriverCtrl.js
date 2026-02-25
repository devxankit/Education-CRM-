import TransportDriver from "../Models/TransportDriverModel.js";
import TransportRoute from "../Models/TransportRouteModel.js";

// ================= CREATE DRIVER =================
export const createDriver = async (req, res) => {
    try {
        const { branchId, academicYearId, name, mobile, licenseNo, remarks } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId || !name || !mobile) {
            return res.status(400).json({
                success: false,
                message: "branchId, name and mobile are required",
            });
        }

        const driver = new TransportDriver({
            instituteId,
            branchId,
            academicYearId: academicYearId || undefined,
            name: name.trim(),
            mobile: mobile.trim(),
            licenseNo: (licenseNo || "").trim() || undefined,
            remarks: (remarks || "").trim() || undefined,
        });

        await driver.save();

        res.status(201).json({
            success: true,
            message: "Driver created successfully",
            data: driver,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET DRIVERS (list with assigned route count) =================
export const getDrivers = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { branchId } = req.query;

        const query = { instituteId };
        if (branchId && branchId !== "all" && branchId.length === 24) {
            query.branchId = branchId;
        }

        const drivers = await TransportDriver.find(query)
            .populate("branchId", "name")
            .populate("academicYearId", "name")
            .sort({ name: 1 });
        const routeCounts = await Promise.all(
            drivers.map((d) =>
                TransportRoute.countDocuments({
                    instituteId,
                    driver: d.name,
                })
            )
        );
        const enriched = drivers.map((d, idx) => {
            const obj = d.toObject();
            obj.routesAssigned = routeCounts[idx] || 0;
            return obj;
        });

        res.status(200).json({
            success: true,
            data: enriched,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET SINGLE DRIVER + ROUTES =================
export const getDriverDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const instituteId = req.user.instituteId || req.user._id;

        const driver = await TransportDriver.findOne({ _id: id, instituteId })
            .populate("branchId", "name")
            .populate("academicYearId", "name");

        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }

        const routes = await TransportRoute.find({
            instituteId,
            driver: driver.name,
        })
            .select("name code vehicleNo stops")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: { driver, routes },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE DRIVER =================
export const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const driver = await TransportDriver.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }

        res.status(200).json({
            success: true,
            message: "Driver updated successfully",
            data: driver,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE DRIVER =================
export const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const driver = await TransportDriver.findByIdAndDelete(id);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }

        res.status(200).json({
            success: true,
            message: "Driver deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

