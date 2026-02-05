import TransportConfig from "../Models/TransportConfigModel.js";

// ================= GET OR INITIALIZE CONFIG =================
export const getTransportConfig = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        // Basic validation to avoid CastError 500
        if (branchId.length !== 24 && branchId !== 'main') {
            return res.status(200).json({ success: true, data: {} });
        }

        let query = { instituteId };
        if (branchId !== 'main') {
            query.branchId = branchId;
        }

        let config = await TransportConfig.findOne(query);

        if (!config) {
            // Return defaults if none exists
            return res.status(200).json({
                success: true,
                message: "No configuration found, providing defaults",
                data: {
                    branchId,
                    availability: { isEnabled: true, isMandatory: false, scope: 'all' },
                    routeRules: { maxStopsPerRoute: 20, minStudentsToStart: 5 },
                    capacityRules: { bufferPercent: 10, enforceStrictLimit: true },
                    feeLink: { autoApplyToInvoices: true, feeType: 'monthly' }
                }
            });
        }

        res.status(200).json({
            success: true,
            data: config,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= SAVE CONFIG =================
export const saveTransportConfig = async (req, res) => {
    try {
        const { branchId, ...configData } = req.body;
        const instituteId = req.user.instituteId || req.user._id;

        if (!branchId || branchId === 'main') {
            return res.status(400).json({ success: false, message: "A valid Branch ID is required" });
        }

        const existing = await TransportConfig.findOne({ instituteId, branchId });
        if (existing && existing.isLocked && !req.body.unlockReason) {
            return res.status(403).json({
                success: false,
                message: "Transport configuration is locked. Provide an audit reason to modify."
            });
        }

        const config = await TransportConfig.findOneAndUpdate(
            { instituteId, branchId },
            {
                $set: {
                    ...configData,
                    instituteId,
                    branchId
                }
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Transport configuration saved successfully",
            data: config,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LOCK / UNLOCK CONFIG =================
export const toggleTransportLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked, unlockReason } = req.body;

        const config = await TransportConfig.findById(id);
        if (!config) {
            return res.status(404).json({ success: false, message: "Configuration not found" });
        }

        config.isLocked = isLocked;
        if (!isLocked && unlockReason) {
            config.unlockReason = unlockReason;
        }

        await config.save();

        res.status(200).json({
            success: true,
            message: `Transport config ${isLocked ? 'Locked' : 'Unlocked'} successfully`,
            data: config
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
