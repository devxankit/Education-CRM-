import Hostel from "../Models/HostelModel.js";
import HostelConfig from "../Models/HostelConfigModel.js";

const generateRooms = (buildings, feeConfig = {}) => {
    let allRooms = [];
    buildings.forEach(building => {
        const { code, totalFloors, roomsPerFloor, bedsPerRoom } = building;
        if (totalFloors && roomsPerFloor && bedsPerRoom) {
            for (let f = 1; f <= totalFloors; f++) {
                for (let r = 1; r <= roomsPerFloor; r++) {
                    const blockLetter = code.includes('-') ? code.split('-')[1] : code;
                    const roomNumber = `${blockLetter}${f}${r.toString().padStart(2, '0')}`;

                    let roomType = "Single";
                    let fee = feeConfig.singleRoomFee || 0;

                    if (bedsPerRoom === 2) {
                        roomType = "Double";
                        fee = feeConfig.doubleRoomFee || 0;
                    } else if (bedsPerRoom === 3) {
                        roomType = "Triple";
                        fee = feeConfig.tripleRoomFee || 0;
                    } else if (bedsPerRoom > 3) {
                        roomType = "Dormitory";
                        fee = feeConfig.dormRoomFee || 0;
                    }

                    allRooms.push({
                        number: roomNumber,
                        buildingCode: code,
                        floor: f,
                        type: roomType,
                        capacity: bedsPerRoom,
                        status: "Available",
                        feeAmount: fee || feeConfig.courseFee || 0
                    });
                }
            }
        }
    });
    return allRooms;
};

// Create Hostel
export const createHostel = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const data = req.body;

        // 1. Fetch Config for Branch
        const config = await HostelConfig.findOne({ branchId: data.branchId });
        if (!config) {
            return res.status(400).json({ success: false, message: "Hostel Configuration not found for this branch. Please configure 'Hostel Setup' first." });
        }

        // 2. Validate Is Enabled
        if (!config.availability?.isEnabled) {
            return res.status(400).json({ success: false, message: "Hostels are disabled for this branch." });
        }

        // 3. Validate Hostel Type
        const typeKey = data.type.toLowerCase(); // boys, girls, staff
        if (!config.availability?.separateBlocks?.[typeKey]) {
            return res.status(400).json({ success: false, message: `${data.type} hostels are not allowed in this branch configuration.` });
        }

        // 4. Validate Max Buildings
        // Count existing hostels for this branch? Or is "Max Buildings" per hostel or per branch?
        // User said: "Is branch me maximum kitni hostel buildings allowed hain." 
        // Example: Value=2 -> Boys Hostel A, Boys Hostel B.
        // So we need to count total hostels (buildings) in this branch.
        const existingHostelsCount = await Hostel.countDocuments({ branchId: data.branchId });
        if (existingHostelsCount >= config.availability?.maxHostels) {
            return res.status(400).json({ success: false, message: `Cannot create more hostels. Limit of ${config.availability.maxHostels} buildings reached for this branch.` });
        }

        // 5. Auto-Generate Rooms if buildings have config
        const autoRooms = generateRooms(data.buildings || [], data.feeConfig);
        const finalRooms = (data.rooms && data.rooms.length > 0) ? data.rooms : autoRooms;

        // 6. Validate Rooms
        if (finalRooms.length > 0) {
            for (const room of finalRooms) {
                if (room.capacity > (config.roomRules?.maxBedsPerRoom || 10)) {
                    return res.status(400).json({ success: false, message: `Room capacity ${room.capacity} exceeds limit.` });
                }
            }
        }

        // 7. Create Hostel
        const hostel = new Hostel({
            ...data,
            rooms: finalRooms,
            instituteId,
            // Snapshot of safety rules from config if not provided overridden
            safetyRules: {
                guardianMandatory: config.safetyRules?.mandatoryGuardian,
                medicalRequired: config.safetyRules?.medicalInfo,
                wardenApprovalRequired: config.safetyRules?.wardenAssignment,
                emergencyContact: data.safetyRules?.emergencyContact
            }
        });


        await hostel.save();

        res.status(201).json({
            success: true,
            message: "Hostel created successfully",
            data: hostel
        });

    } catch (error) {
        console.error("Create Hostel Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Hostels (with filters)
export const getHostels = async (req, res) => {
    try {
        const instituteId = req.user.instituteId || req.user._id;
        const { branchId, type } = req.query;

        let query = { instituteId };
        if (branchId) query.branchId = branchId;
        if (type) query.type = type;

        const hostels = await Hostel.find(query)
            .populate("branchId", "name")
            .populate("buildings.wardenId", "firstName lastName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: hostels
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Hostel
export const getHostelById = async (req, res) => {
    try {
        const { id } = req.params;
        const hostel = await Hostel.findById(id)
            .populate("branchId", "name")
            .populate("buildings.wardenId", "firstName lastName email phone");

        if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

        res.status(200).json({ success: true, data: hostel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Hostel
export const updateHostel = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.buildings) {
            data.rooms = generateRooms(data.buildings, data.feeConfig);
        }

        const hostel = await Hostel.findByIdAndUpdate(id, data, { new: true })
            .populate("branchId", "name")
            .populate("buildings.wardenId", "firstName lastName");

        if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

        res.status(200).json({ success: true, message: "Hostel updated", data: hostel });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Hostel
export const deleteHostel = async (req, res) => {
    try {
        const { id } = req.params;
        const hostel = await Hostel.findByIdAndDelete(id);
        if (!hostel) return res.status(404).json({ success: false, message: "Hostel not found" });

        res.status(200).json({ success: true, message: "Hostel deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
