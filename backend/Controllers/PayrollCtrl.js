import Payroll from "../Models/PayrollModel.js";
import PayrollRule from "../Models/PayrollRuleModel.js";
import Teacher from "../Models/TeacherModel.js";
import Staff from "../Models/StaffModel.js";
import mongoose from "mongoose";

// ================= CALCULATE SALARY BASED ON RULES =================
const calculateSalary = async (basicSalary, payrollRule, leaveDays = 0, workingDays = 26, customEarnings = [], customDeductions = [], month = null, year = null) => {
    const components = [];
    let totalEarnings = basicSalary;
    let totalDeductions = 0;

    // Add custom earnings first
    customEarnings.forEach(earning => {
        const amount = parseFloat(earning.amount) || 0;
        if (amount > 0) {
            totalEarnings += amount;
            components.push({
                name: earning.name,
                type: "earning",
                amount: Math.round(amount * 100) / 100,
                calculation: "fixed",
                base: "basic"
            });
        }
    });

    // Calculate based on payroll rules
    if (payrollRule && payrollRule.salaryHeads && payrollRule.salaryHeads.length > 0) {
        for (const head of payrollRule.salaryHeads) {
            let amount = 0;

            if (head.calculation === "fixed") {
                amount = head.value;
            } else if (head.calculation === "percentage") {
                const baseAmount = head.base === "basic" ? basicSalary : totalEarnings;
                amount = (baseAmount * head.value) / 100;
            }

            components.push({
                name: head.name,
                type: head.type,
                amount: Math.round(amount * 100) / 100,
                calculation: head.calculation,
                base: head.base
            });

            if (head.type === "earning") {
                totalEarnings += amount;
            } else {
                totalDeductions += amount;
            }
        }
    }

    // Add custom deductions
    customDeductions.forEach(deduction => {
        const amount = parseFloat(deduction.amount) || 0;
        if (amount > 0) {
            totalDeductions += amount;
            components.push({
                name: deduction.name,
                type: "deduction",
                amount: Math.round(amount * 100) / 100,
                calculation: "fixed",
                base: "basic"
            });
        }
    });

    // Calculate LOP (Loss of Pay) based on payroll rule leaveRules
    let lopAmount = 0;
    if (leaveDays > 0 && payrollRule?.leaveRules) {
        const lopFormula = payrollRule.leaveRules.lopFormula || 'fixed_30';
        
        if (lopFormula === 'fixed_30') {
            // Fixed 30 days calculation - always use 30 days
            const dailyRate = basicSalary / 30;
            lopAmount = dailyRate * leaveDays;
        } else if (lopFormula === 'actual_days') {
            // Actual month days calculation - use actual calendar days of the selected month
            // Get actual days in the selected month (28, 29, 30, or 31)
            let actualDaysInMonth = 30; // Default fallback
            if (month && year) {
                // month is 1-12, JavaScript Date month is 0-11
                actualDaysInMonth = new Date(year, month, 0).getDate();
            } else if (workingDays > 0) {
                // Fallback to workingDays if month/year not provided
                actualDaysInMonth = workingDays;
            }
            const dailyRate = basicSalary / actualDaysInMonth;
            lopAmount = dailyRate * leaveDays;
        }
        
        if (lopAmount > 0) {
            totalDeductions += lopAmount;
            components.push({
                name: "Loss of Pay (LOP)",
                type: "deduction",
                amount: Math.round(lopAmount * 100) / 100,
                calculation: "fixed",
                base: "basic"
            });
        }
    } else if (leaveDays > 0 && workingDays > 0) {
        // Fallback if no payroll rule
        const dailyRate = basicSalary / workingDays;
        lopAmount = dailyRate * leaveDays;
        totalDeductions += lopAmount;
        components.push({
            name: "Loss of Pay (LOP)",
            type: "deduction",
            amount: Math.round(lopAmount * 100) / 100,
            calculation: "fixed",
            base: "basic"
        });
    }

    const netSalary = totalEarnings - totalDeductions;

    return {
        components,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        totalDeductions: Math.round(totalDeductions * 100) / 100,
        netSalary: Math.round(netSalary * 100) / 100,
        lopAmount: Math.round(lopAmount * 100) / 100
    };
};

// ================= CREATE PAYROLL =================
export const createPayroll = async (req, res) => {
    try {
        const {
            employeeType,
            employeeId,
            branchId,
            financialYear,
            month,
            year,
            basicSalary,
            workingDays = 26,
            presentDays = 0,
            leaveDays = 0,
            customEarnings = [],
            customDeductions = [],
            paymentDate,
            paymentMethod,
            transactionId,
            bankAccountNumber,
            ifscCode,
            remarks
        } = req.body;

        const instituteId = req.user.instituteId || req.user._id;

        // Validate required fields
        if (!employeeType || !employeeId || !branchId || !financialYear || !month || !year || !basicSalary) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        if (!["teacher", "staff"].includes(employeeType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee type. Must be 'teacher' or 'staff'"
            });
        }

        // Validate employee exists
        const EmployeeModel = employeeType === "teacher" ? Teacher : Staff;
        const employee = await EmployeeModel.findOne({
            _id: employeeId,
            instituteId
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: `${employeeType === "teacher" ? "Teacher" : "Staff"} not found`
            });
        }

        // Check if payroll already exists for this month/year
        const existingPayroll = await Payroll.findOne({
            employeeId,
            employeeType,
            month,
            year,
            financialYear
        });

        if (existingPayroll) {
            return res.status(400).json({
                success: false,
                message: "Payroll already exists for this employee for the selected month/year"
            });
        }

        // Fetch payroll rules
        const payrollRule = await PayrollRule.findOne({
            instituteId,
            financialYear
        });

        // Calculate salary based on rules
        const salaryCalculation = await calculateSalary(
            basicSalary, 
            payrollRule, 
            leaveDays, 
            workingDays,
            customEarnings,
            customDeductions,
            month,  // Pass month for actual_days calculation
            year    // Pass year for actual_days calculation
        );

        // Create payroll entry
        const payroll = new Payroll({
            instituteId,
            branchId,
            employeeType,
            employeeId,
            employeeTypeModel: employeeType === "teacher" ? "Teacher" : "Staff",
            financialYear,
            month,
            year,
            basicSalary,
            workingDays,
            presentDays,
            components: salaryCalculation.components,
            totalEarnings: salaryCalculation.totalEarnings,
            totalDeductions: salaryCalculation.totalDeductions,
            netSalary: salaryCalculation.netSalary,
            leaveDays,
            lopAmount: salaryCalculation.lopAmount,
            status: "draft",
            paymentDate: paymentDate ? new Date(paymentDate) : undefined,
            paymentMethod,
            transactionId,
            bankAccountNumber,
            ifscCode,
            remarks,
            createdBy: req.user._id
        });

        await payroll.save();

        // Populate employee details
        await payroll.populate("employeeId", "firstName lastName name email employeeId");

        res.status(201).json({
            success: true,
            message: "Payroll created successfully",
            data: payroll
        });
    } catch (error) {
        console.error("Error creating payroll:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= GET PAYROLLS =================
export const getPayrolls = async (req, res) => {
    try {
        const {
            branchId,
            employeeType,
            employeeId,
            financialYear,
            month,
            year,
            status
        } = req.query;

        const instituteId = req.user.instituteId || req.user._id;

        let query = { instituteId };

        if (branchId) query.branchId = branchId;
        if (employeeType) query.employeeType = employeeType;
        if (employeeId) query.employeeId = employeeId;
        if (financialYear) query.financialYear = financialYear;
        if (month) query.month = parseInt(month);
        if (year) query.year = parseInt(year);
        if (status) query.status = status;

        const payrolls = await Payroll.find(query)
            .populate("employeeId", "firstName lastName name email employeeId")
            .populate("branchId", "name")
            .populate("createdBy", "legalName shortName email")
            .populate("approvedBy", "legalName shortName email")
            .sort({ year: -1, month: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            data: payrolls
        });
    } catch (error) {
        console.error("Error fetching payrolls:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= GET SINGLE PAYROLL =================
export const getPayroll = async (req, res) => {
    try {
        const { id } = req.params;

        const payroll = await Payroll.findById(id)
            .populate("employeeId", "firstName lastName name email employeeId")
            .populate("branchId", "name")
            .populate("createdBy", "legalName shortName email")
            .populate("approvedBy", "legalName shortName email");

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: "Payroll not found"
            });
        }

        res.status(200).json({
            success: true,
            data: payroll
        });
    } catch (error) {
        console.error("Error fetching payroll:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= UPDATE PAYROLL =================
export const updatePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            basicSalary,
            workingDays,
            presentDays,
            leaveDays,
            customEarnings = [],
            customDeductions = [],
            status,
            paymentDate,
            paymentMethod,
            transactionId,
            bankAccountNumber,
            ifscCode,
            remarks
        } = req.body;

        const payroll = await Payroll.findById(id);

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: "Payroll not found"
            });
        }

        // If salary-related fields changed, recalculate
        const needsRecalculation = basicSalary !== undefined || leaveDays !== undefined || 
                                   workingDays !== undefined || customEarnings.length > 0 || 
                                   customDeductions.length > 0;

        if (needsRecalculation) {
            const payrollRule = await PayrollRule.findOne({
                instituteId: payroll.instituteId,
                financialYear: payroll.financialYear
            });

            const newBasicSalary = basicSalary !== undefined ? basicSalary : payroll.basicSalary;
            const newLeaveDays = leaveDays !== undefined ? leaveDays : payroll.leaveDays;
            const newWorkingDays = workingDays !== undefined ? workingDays : payroll.workingDays;
            const newCustomEarnings = customEarnings.length > 0 ? customEarnings : [];
            const newCustomDeductions = customDeductions.length > 0 ? customDeductions : [];

            const salaryCalculation = await calculateSalary(
                newBasicSalary,
                payrollRule,
                newLeaveDays,
                newWorkingDays,
                newCustomEarnings,
                newCustomDeductions,
                payroll.month,  // Pass month for actual_days calculation
                payroll.year     // Pass year for actual_days calculation
            );

            payroll.basicSalary = newBasicSalary;
            payroll.leaveDays = newLeaveDays;
            payroll.workingDays = newWorkingDays;
            payroll.components = salaryCalculation.components;
            payroll.totalEarnings = salaryCalculation.totalEarnings;
            payroll.totalDeductions = salaryCalculation.totalDeductions;
            payroll.netSalary = salaryCalculation.netSalary;
            payroll.lopAmount = salaryCalculation.lopAmount;
        }

        // Update other fields
        if (presentDays !== undefined) payroll.presentDays = presentDays;

        // Update other fields
        if (status !== undefined) {
            payroll.status = status;
            if (status === "approved") {
                payroll.approvedBy = req.user._id;
            }
        }
        if (paymentDate !== undefined) payroll.paymentDate = paymentDate ? new Date(paymentDate) : undefined;
        if (paymentMethod !== undefined) payroll.paymentMethod = paymentMethod;
        if (transactionId !== undefined) payroll.transactionId = transactionId;
        if (bankAccountNumber !== undefined) payroll.bankAccountNumber = bankAccountNumber;
        if (ifscCode !== undefined) payroll.ifscCode = ifscCode;
        if (remarks !== undefined) payroll.remarks = remarks;

        await payroll.save();

        await payroll.populate("employeeId", "firstName lastName name email employeeId");
        await payroll.populate("branchId", "name");

        res.status(200).json({
            success: true,
            message: "Payroll updated successfully",
            data: payroll
        });
    } catch (error) {
        console.error("Error updating payroll:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= DELETE PAYROLL =================
export const deletePayroll = async (req, res) => {
    try {
        const { id } = req.params;

        const payroll = await Payroll.findById(id);

        if (!payroll) {
            return res.status(404).json({
                success: false,
                message: "Payroll not found"
            });
        }

        // Only allow deletion of draft payrolls
        if (payroll.status !== "draft") {
            return res.status(400).json({
                success: false,
                message: "Only draft payrolls can be deleted"
            });
        }

        await Payroll.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Payroll deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting payroll:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
