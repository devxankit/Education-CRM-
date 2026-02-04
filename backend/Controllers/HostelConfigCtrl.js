import HostelConfig from "../Models/HostelConfigModel.js";

// ================= GET OR INITIALIZE HOSTEL CONFIG =================
export const getHostelConfig = async (req, res) => {
    try {
        const { branchId } = req.query;
        const instituteId = req.user._id;

        if (!branchId) {
            return res.status(400).json({ success: false, message: "Branch ID is required" });
        }

        // Handle 'main' or invalid ID to avoid CastError
        if (branchId === 'main' || branchId.length !== 24) {
            return res.status(200).json({
                success: true,
                message: "No specific configuration for this branch level, providing defaults",
                data: {
                    branchId,
                    availability: { isEnabled: true, separateBlocks: { boys: true, girls: true, staff: false }, maxHostels: 2 },
                    roomRules: { roomTypes: { single: true, double: true, triple: false, dorm: false }, maxBedsPerRoom: 4 },
                    feeLink: { isLinked: true, feeBasis: 'room_type', collectionFrequency: 'term' },
                    safetyRules: { mandatoryGuardian: true, medicalInfo: true, wardenAssignment: true }
                }
            });
        }

        let config = await HostelConfig.findOne({ instituteId, branchId });

        if (!config) {
            // Provide defaults
            return res.status(200).json({
                success: true,
                message: "No configuration found, providing defaults",
                data: {
                    branchId,
                    availability: { isEnabled: true, separateBlocks: { boys: true, girls: true, staff: false }, maxHostels: 2 },
                    roomRules: { roomTypes: { single: true, double: true, triple: false, dorm: false }, maxBedsPerRoom: 4 },
                    feeLink: { isLinked: true, feeBasis: 'room_type', collectionFrequency: 'term' },
                    safetyRules: { mandatoryGuardian: true, medicalInfo: true, wardenAssignment: true }
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

// ================= SAVE HOSTEL CONFIG =================
export const saveHostelConfig = async (req, res) => {
    try {
        const { branchId, ...configData } = req.body;
        const instituteId = req.user._id;

        if (!branchId || branchId === 'main') {
            return res.status(400).json({ success: false, message: "A valid Branch ID is required to save hostel configuration" });
        }

        const existing = await HostelConfig.findOne({ instituteId, branchId });
        if (existing && existing.isLocked && !req.body.unlockReason) {
            return res.status(403).json({
                success: false,
                message: "Hostel configuration is locked. Provide an audit reason to modify."
            });
        }

        const config = await HostelConfig.findOneAndUpdate(
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
            message: "Hostel configuration saved successfully",
            data: config,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= LOCK / UNLOCK HOSTEL CONFIG =================
export const toggleHostelLock = async (req, res) => {
    try {
        const { id } = req.params;
        const { isLocked, unlockReason } = req.body;

        const config = await HostelConfig.findById(id);
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
            message: `Hostel config ${isLocked ? 'Locked' : 'Unlocked'} successfully`,
            data: config
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
