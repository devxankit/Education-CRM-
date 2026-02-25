import TransportVehicle from "../Models/TransportVehicleModel.js";

// ================= CREATE VEHICLE =================
export const createVehicle = async (req, res) => {
    try {
        const { branchId, academicYearId, code, registrationNo, model, capacity, remarks } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId || !registrationNo || !model) {
            return res.status(400).json({
                success: false,
                message: "branchId, registrationNo and model are required",
            });
        }

        const vehicle = new TransportVehicle({
            instituteId,
            branchId,
            academicYearId: academicYearId || undefined,
            code: (code || registrationNo).toUpperCase().trim(),
            registrationNo: registrationNo.trim(),
            model: model.trim(),
            capacity: Number(capacity) || 40,
            remarks: (remarks || "").trim() || undefined,
        });

        await vehicle.save();

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: vehicle,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= GET VEHICLES =================
export const getVehicles = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { branchId } = req.query;

        const query = { instituteId };
        if (branchId && branchId !== "all" && branchId.length === 24) {
            query.branchId = branchId;
        }

        const vehicles = await TransportVehicle.find(query)
            .populate("branchId", "name")
            .populate("academicYearId", "name")
            .sort({ code: 1 });

        res.status(200).json({
            success: true,
            data: vehicles,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE VEHICLE =================
export const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.code) updateData.code = updateData.code.toUpperCase().trim();

        const vehicle = await TransportVehicle.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: vehicle,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= DELETE VEHICLE =================
export const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await TransportVehicle.findByIdAndDelete(id);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: "Vehicle not found" });
        }

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

