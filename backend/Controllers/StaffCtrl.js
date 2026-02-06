import Staff from "../Models/StaffModel.js";
import Student from "../Models/StudentModel.js";
import SupportTicket from "../Models/SupportTicketModel.js";
import FeePayment from "../Models/FeePaymentModel.js";
import TransportRoute from "../Models/TransportRouteModel.js";
import { generateToken } from "../Helpers/generateToken.js";
import { generateRandomPassword } from "../Helpers/generateRandomPassword.js";
import { sendLoginCredentialsEmail } from "../Helpers/SendMail.js";
import { uploadBase64ToCloudinary } from "../Helpers/cloudinaryHelper.js";

// ================= STAFF DASHBOARD (DYNAMIC) =================
export const getStaffDashboard = async (req, res) => {
    try {
        const staffId = req.user._id;
        const instituteId = req.user.instituteId || staffId;
        const staff = await Staff.findById(staffId).populate('roleId');

        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff user not found" });
        }

        const roleCode = staff.roleId?.code || "";
        const branchId = staff.branchId; // "all" or specific ObjectId

        const queryScope = { instituteId };
        if (branchId && branchId !== "all") {
            queryScope.branchId = branchId;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = {
            TotalAdmissions: 0,
            PendingAdmissions: 0,
            TodayAdmissions: 0,
            PendingDocuments: 0,
            VisitorRequests: 0,
            PendingFees: 0,
            OverdueFees: 0,
            TodayCollections: "₹0",
            ActiveRoutes: 0,
            BusAllocationIssues: 0,
            DriverStatus: "0/0",
            OpenTickets: 0,
            SlaBreachAlerts: 0,
            HighPriorityTickets: 0,
            IncompleteProfiles: 0,
            PendingVerifications: 0,
            MissingEmployeeRecords: 0,
            TeacherStatus: "Active",
            MyClasses: 0,
            TodayAttendance: "0%",
            PendingAssignments: 0
        };

        // 1. ADMISSION STATS (For Admission Officer, Front Desk, Principal)
        if (roleCode.includes('ADMISSION') || roleCode.includes('FRONT_DESK') || roleCode.includes('PRINCIPAL')) {
            // Total Admissions - All time for this institute/branch
            stats.TotalAdmissions = await Student.countDocuments(queryScope);

            // Pending Admissions - Added by staff but not verified (status is in_review)
            stats.PendingAdmissions = await Student.countDocuments({
                ...queryScope,
                status: 'in_review'
            });

            stats.TodayAdmissions = await Student.countDocuments({
                ...queryScope,
                createdAt: { $gte: today }
            });

            // Count students who have AT LEAST ONE document pending
            stats.PendingDocuments = await Student.countDocuments({
                ...queryScope,
                $or: [
                    { "documents.photo.status": "in_review" },
                    { "documents.birthCert.status": "in_review" },
                    { "documents.transferCert.status": "in_review" },
                    { "documents.aadhar.status": "in_review" },
                    { "documents.prevMarksheet.status": "in_review" }
                ]
            });
            stats.VisitorRequests = 0;
        }

        // 2. ACCOUNTS STATS (For Accounts Officer, Principal)
        if (roleCode.includes('ACCOUNTS') || roleCode.includes('PRINCIPAL')) {
            const collections = await FeePayment.aggregate([
                { $match: { ...queryScope, paymentDate: { $gte: today }, status: 'Success' } },
                { $group: { _id: null, total: { $sum: "$amountPaid" } } }
            ]);
            const total = collections[0]?.total || 0;
            stats.TodayCollections = total >= 1000 ? `₹${(total / 1000).toFixed(1)}k` : `₹${total}`;

            stats.PendingFees = await Student.countDocuments({ ...queryScope, status: 'active' }); // Count of active students who might have fees
            stats.OverdueFees = await Student.countDocuments({ ...queryScope, status: 'active' }); // Placeholder
        }

        // 3. SUPPORT STATS (For Support Staff, Front Desk)
        if (roleCode.includes('SUPPORT') || roleCode.includes('FRONT_DESK')) {
            stats.OpenTickets = await SupportTicket.countDocuments({
                ...queryScope,
                status: 'Open'
            });
            stats.HighPriorityTickets = await SupportTicket.countDocuments({
                ...queryScope,
                status: 'Open',
                priority: 'High'
            });
            stats.SlaBreachAlerts = await SupportTicket.countDocuments({
                ...queryScope,
                status: 'Open',
                priority: 'Urgent'
            });
        }

        // 4. TRANSPORT STATS (For Transport Manager)
        if (roleCode.includes('TRANSPORT')) {
            stats.ActiveRoutes = await TransportRoute.countDocuments({ ...queryScope, isActive: true });
            stats.BusAllocationIssues = 0;
            stats.DriverStatus = "Active";
        }

        // 5. DATA ENTRY STATS
        if (roleCode.includes('DATA_ENTRY')) {
            stats.IncompleteProfiles = await Student.countDocuments({
                ...queryScope,
                $or: [{ dob: { $exists: false } }, { gender: { $exists: false } }]
            });
            stats.PendingVerifications = await Student.countDocuments({
                ...queryScope,
                "documents.photo.status": "in_review"
            });
        }

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ================= CREATE STAFF USER =================
export const createStaff = async (req, res) => {
    try {
        const { name, email, roleId, branchId, phone } = req.body;
        const instituteId = req.user._id;

        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({
                success: false,
                message: "Staff user with this email already exists",
            });
        }

        // Generate Random Password
        const generatedPassword = "123456"
        // const generatedPassword = generateRandomPassword();

        const staff = new Staff({
            instituteId,
            name,
            email,
            password: generatedPassword,
            roleId,
            branchId: branchId === 'all' ? null : branchId,
            phone
        });

        await staff.save();

        // Send Email with credentials
        // Use a background process or don't await if you don't want to block the response
        // but for now we'll just fire and forget or simple await
        sendLoginCredentialsEmail(email, generatedPassword, name, "Staff");

        res.status(201).json({
            success: true,
            message: "Staff user created successfully and credentials sent to email",
            data: {
                _id: staff._id,
                name: staff.name,
                email: staff.email,
                roleId: staff.roleId
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL STAFF =================
export const getStaffList = async (req, res) => {
    try {
        const instituteId = req.user._id;
        const staff = await Staff.find({ instituteId })
            .populate('roleId', 'name code')
            .populate('branchId', 'name');

        res.status(200).json({
            success: true,
            data: staff,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= UPDATE STAFF =================
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Prevent direct password update through this route
        delete updateData.password;

        const staff = await Staff.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('roleId', 'name code');

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff user not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Staff user updated successfully",
            data: staff,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= DELETE STAFF =================
export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await Staff.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Staff user deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= STAFF LOGIN =================
export const loginStaff = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const staff = await Staff.findOne({ email }).populate('roleId');
        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff user not found",
            });
        }

        if (staff.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: `Your account is ${staff.status}. Please contact administrator.`
            });
        }

        const isMatch = await staff.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Validate Role if provided
        if (role) {
            const assignedRoleCode = staff.roleId?.code || '';
            // Check if the assigned role code contains the requested role string (e.g. ROLE_ACCOUNTS_OFFICER contains ACCOUNTS)
            if (!assignedRoleCode.toUpperCase().includes(role.toUpperCase())) {
                return res.status(403).json({
                    success: false,
                    message: `Access Denied: You are not authorized to login as ${role}. Your assigned role is ${staff.roleId?.name || 'different'}.`
                });
            }
        }

        const token = generateToken(staff._id, "Staff");

        // Update last login
        staff.lastLogin = new Date();
        await staff.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: staff,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET STAFF PERMISSIONS =================
export const getStaffPermissions = async (req, res) => {
    try {
        const staffId = req.user.id; // User ID from auth middleware
        const staff = await Staff.findById(staffId).populate('roleId');

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        const permissions = staff.roleId ? staff.roleId.permissions : {};

        res.status(200).json({
            success: true,
            data: permissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= GET STAFF PROFILE =================
export const getStaffProfile = async (req, res) => {
    try {
        const staffId = req.user._id;
        const staff = await Staff.findById(staffId)
            .populate('roleId', 'name code permissions')
            .populate('branchId', 'name')
            .populate({
                path: 'instituteId',
                select: 'name email phone address logo'
            });

        if (!staff) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.status(200).json({
            success: true,
            data: staff
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const staffId = req.user._id;

        console.log(`[PASS_CHANGE] Attempt for staff: ${staffId}`);

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const staff = await Staff.findById(staffId).select('+password');
        if (!staff) {
            console.log(`[PASS_CHANGE] Staff NOT found: ${staffId}`);
            return res.status(404).json({ success: false, message: "Staff not found" });
        }

        console.log(`[PASS_CHANGE] Verifying current password...`);
        const isMatch = await staff.comparePassword(currentPassword);
        if (!isMatch) {
            console.log(`[PASS_CHANGE] INVALID current password for: ${staffId}`);
            return res.status(401).json({ success: false, message: "Invalid current password" });
        }

        // Update password
        staff.password = newPassword;
        await staff.save();

        console.log(`[PASS_CHANGE] SUCCESS for staff: ${staffId}`);
        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("[PASS_CHANGE] ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
    try {
        const staffId = req.user._id;
        const { profilePic, bannerPic, name, phone } = req.body;
        console.log(`Updating profile for staff: ${staffId}`, { name, phone, hasProfilePic: !!profilePic, hasBannerPic: !!bannerPic });

        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff not found" });
        }

        // Update basic fields
        if (name) staff.name = name;
        if (phone) staff.phone = phone;

        // Handle profile picture upload
        if (profilePic && profilePic.startsWith('data:image')) {
            console.log("Uploading profile pic to Cloudinary...");
            const uploadedUrl = await uploadBase64ToCloudinary(profilePic, 'staff_profiles');
            staff.profilePic = uploadedUrl;
            console.log("Profile pic uploaded:", uploadedUrl);
        }

        // Handle banner picture upload
        if (bannerPic && bannerPic.startsWith('data:image')) {
            console.log("Uploading banner pic to Cloudinary...");
            const uploadedUrl = await uploadBase64ToCloudinary(bannerPic, 'staff_banners');
            staff.bannerPic = uploadedUrl;
            console.log("Banner pic uploaded:", uploadedUrl);
        }

        await staff.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: staff
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
