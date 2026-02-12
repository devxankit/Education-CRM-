import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Calculator, AlertCircle, User, Calendar, DollarSign, CreditCard, Plus, Trash2, Receipt, FileText } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';

const PayrollFormModal = ({
    isOpen,
    onClose,
    initialData,
    employeeType,
    branchId,
    month,
    year,
    financialYear,
    teachers = [],
    staff = [],
    viewMode = false // If true, form is read-only for viewing
}) => {
    const { createPayroll, updatePayroll, fetchPayrollRule } = useAdminStore();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [payrollRule, setPayrollRule] = useState(null);
    const [formData, setFormData] = useState({
        employeeId: '',
        basicSalary: '',
        workingDays: 26,
        presentDays: 0,
        leaveDays: 0,
        // Manual earnings (can add custom)
        customEarnings: [],
        // Manual deductions (can add custom)
        customDeductions: [],
        // Payment details
        paymentDate: '',
        paymentMethod: '',
        transactionId: '',
        bankAccountNumber: '',
        ifscCode: '',
        remarks: ''
    });
    const [calculatedSalary, setCalculatedSalary] = useState(null);
    const [errors, setErrors] = useState({});
    const [newEarningName, setNewEarningName] = useState('');
    const [newEarningAmount, setNewEarningAmount] = useState('');
    const [newDeductionName, setNewDeductionName] = useState('');
    const [newDeductionAmount, setNewDeductionAmount] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Load payroll rule and set form data
            const loadRuleAndSetData = async () => {
                const rule = await fetchPayrollRule(financialYear);
                setPayrollRule(rule);

                // Calculate default working days based on LOP formula
                const getDefaultWorkingDays = () => {
                    if (rule?.leaveRules?.lopFormula === 'fixed_30') {
                        // Fixed 30 days - always use 30
                        return 30;
                    } else if (rule?.leaveRules?.lopFormula === 'actual_days') {
                        // Actual days - use actual calendar days of the selected month
                        if (month && year) {
                            return new Date(year, month, 0).getDate(); // Gets actual days in month (28, 29, 30, or 31)
                        }
                        return 30; // Fallback if month/year not available
                    }
                    return 26; // Default fallback
                };

                // Set initial data if editing/viewing
                if (initialData) {
                    const employee = initialData.employeeId;
                    
                    // Use policy-based working days for view mode, otherwise use saved workingDays
                    const defaultWorkingDays = viewMode && rule?.leaveRules?.lopFormula === 'fixed_30' 
                        ? 30 
                        : (viewMode && rule?.leaveRules?.lopFormula === 'actual_days' && month && year
                            ? new Date(year, month, 0).getDate()
                            : (initialData.workingDays || getDefaultWorkingDays()));
                    
                    setFormData({
                        employeeId: initialData.employeeId?._id || initialData.employeeId || '',
                        basicSalary: initialData.basicSalary || '',
                        workingDays: defaultWorkingDays,
                        presentDays: initialData.presentDays || 0,
                        leaveDays: initialData.leaveDays || 0,
                        customEarnings: [],
                        customDeductions: [],
                        paymentDate: initialData.paymentDate ? new Date(initialData.paymentDate).toISOString().split('T')[0] : '',
                        paymentMethod: initialData.paymentMethod || '',
                        transactionId: initialData.transactionId || '',
                        bankAccountNumber: initialData.bankAccountNumber || employee?.bankAccountNumber || '',
                        ifscCode: initialData.ifscCode || employee?.ifscCode || '',
                        remarks: initialData.remarks || ''
                    });
                    setCalculatedSalary({
                        totalEarnings: initialData.totalEarnings || 0,
                        totalDeductions: initialData.totalDeductions || 0,
                        netSalary: initialData.netSalary || 0,
                        components: initialData.components || [],
                        lopAmount: initialData.lopAmount || 0
                    });
                } else {
                    // Set default working days based on policy
                    const defaultWorkingDays = getDefaultWorkingDays();
                    
                    setFormData({
                        employeeId: '',
                        basicSalary: '',
                        workingDays: defaultWorkingDays,
                        presentDays: 0,
                        leaveDays: 0,
                        customEarnings: [],
                        customDeductions: [],
                        paymentDate: '',
                        paymentMethod: '',
                        transactionId: '',
                        bankAccountNumber: '',
                        ifscCode: '',
                        remarks: ''
                    });
                    setCalculatedSalary(null);
                }
            };
            loadRuleAndSetData();
        }
    }, [isOpen, initialData, financialYear, fetchPayrollRule, month, year, viewMode]);

    // Update presentDays when workingDays or leaveDays change
    useEffect(() => {
        if (formData.workingDays && formData.leaveDays) {
            const present = formData.workingDays - formData.leaveDays;
            setFormData(prev => ({ ...prev, presentDays: Math.max(0, present) }));
        }
    }, [formData.workingDays, formData.leaveDays]);

    // Calculate salary whenever relevant fields change
    useEffect(() => {
        calculateSalary();
    }, [formData.basicSalary, formData.leaveDays, formData.customEarnings, formData.customDeductions, payrollRule]);

    const calculateSalary = async () => {
        if (!formData.basicSalary || !formData.employeeId) {
            setCalculatedSalary(null);
            return;
        }

        const basicSalary = parseFloat(formData.basicSalary);
        const leaveDays = parseInt(formData.leaveDays) || 0;
        const workingDays = parseInt(formData.workingDays) || 26;

        if (isNaN(basicSalary) || basicSalary <= 0) {
            setCalculatedSalary(null);
            return;
        }

        let totalEarnings = basicSalary;
        let totalDeductions = 0;
        const components = [];

        // Add custom earnings
        formData.customEarnings.forEach(earning => {
            const amount = parseFloat(earning.amount) || 0;
            totalEarnings += amount;
            components.push({
                name: earning.name,
                type: 'earning',
                amount: amount,
                calculation: 'fixed',
                base: 'basic'
            });
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
        formData.customDeductions.forEach(deduction => {
            const amount = parseFloat(deduction.amount) || 0;
            totalDeductions += amount;
            components.push({
                name: deduction.name,
                type: 'deduction',
                amount: amount,
                calculation: 'fixed',
                base: 'basic'
            });
        });

        // Calculate LOP based on payroll rule leaveRules
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
                const actualDaysInMonth = new Date(year, month, 0).getDate();
                const dailyRate = basicSalary / actualDaysInMonth;
                lopAmount = dailyRate * leaveDays;
            }
            
            if (lopAmount > 0) {
                totalDeductions += lopAmount;
                components.push({
                    name: 'Loss of Pay (LOP)',
                    type: 'deduction',
                    amount: Math.round(lopAmount * 100) / 100,
                    calculation: 'fixed',
                    base: 'basic'
                });
            }
        } else if (leaveDays > 0 && workingDays > 0) {
            // Fallback if no payroll rule
            const dailyRate = basicSalary / workingDays;
            lopAmount = dailyRate * leaveDays;
            totalDeductions += lopAmount;
            components.push({
                name: 'Loss of Pay (LOP)',
                type: 'deduction',
                amount: Math.round(lopAmount * 100) / 100,
                calculation: 'fixed',
                base: 'basic'
            });
        }

        setCalculatedSalary({
            totalEarnings: Math.round(totalEarnings * 100) / 100,
            totalDeductions: Math.round(totalDeductions * 100) / 100,
            netSalary: Math.round((totalEarnings - totalDeductions) * 100) / 100,
            components,
            lopAmount: Math.round(lopAmount * 100) / 100
        });
    };

    const addCustomEarning = () => {
        if (newEarningName && newEarningAmount && parseFloat(newEarningAmount) > 0) {
            setFormData(prev => ({
                ...prev,
                customEarnings: [...prev.customEarnings, { name: newEarningName, amount: newEarningAmount }]
            }));
            setNewEarningName('');
            setNewEarningAmount('');
        }
    };

    const removeCustomEarning = (index) => {
        setFormData(prev => ({
            ...prev,
            customEarnings: prev.customEarnings.filter((_, i) => i !== index)
        }));
    };

    const addCustomDeduction = () => {
        if (newDeductionName && newDeductionAmount && parseFloat(newDeductionAmount) > 0) {
            setFormData(prev => ({
                ...prev,
                customDeductions: [...prev.customDeductions, { name: newDeductionName, amount: newDeductionAmount }]
            }));
            setNewDeductionName('');
            setNewDeductionAmount('');
        }
    };

    const removeCustomDeduction = (index) => {
        setFormData(prev => ({
            ...prev,
            customDeductions: prev.customDeductions.filter((_, i) => i !== index)
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.employeeId) newErrors.employeeId = 'Please select an employee';
        if (!formData.basicSalary || parseFloat(formData.basicSalary) <= 0) {
            newErrors.basicSalary = 'Please enter a valid basic salary';
        }
        if (formData.workingDays <= 0) {
            newErrors.workingDays = 'Working days must be greater than 0';
        }
        if (formData.presentDays < 0) {
            newErrors.presentDays = 'Present days cannot be negative';
        }
        if (formData.leaveDays < 0) {
            newErrors.leaveDays = 'Leave days cannot be negative';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            const payrollData = {
                employeeType,
                employeeId: formData.employeeId,
                branchId,
                financialYear,
                month,
                year,
                basicSalary: parseFloat(formData.basicSalary),
                workingDays: parseInt(formData.workingDays),
                presentDays: parseInt(formData.presentDays),
                leaveDays: parseInt(formData.leaveDays) || 0,
                customEarnings: formData.customEarnings.map(e => ({ name: e.name, amount: parseFloat(e.amount) })),
                customDeductions: formData.customDeductions.map(d => ({ name: d.name, amount: parseFloat(d.amount) })),
                paymentDate: formData.paymentDate || undefined,
                paymentMethod: formData.paymentMethod || undefined,
                transactionId: formData.transactionId || undefined,
                bankAccountNumber: formData.bankAccountNumber || undefined,
                ifscCode: formData.ifscCode || undefined,
                remarks: formData.remarks
            };

            let result;
            if (initialData) {
                result = await updatePayroll(initialData._id || initialData.id, payrollData);
            } else {
                result = await createPayroll(payrollData);
            }

            if (result) {
                onClose();
            }
        } catch (error) {
            console.error('Error saving payroll:', error);
        } finally {
            setSaving(false);
        }
    };

    const employees = employeeType === 'teacher' ? teachers : staff;
    const selectedEmployee = employees.find(emp => (emp._id || emp.id) === formData.employeeId);
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

    const generateInvoiceHTML = () => {
        const employee = initialData?.employeeId || selectedEmployee;
        const employeeName = employeeType === 'teacher' 
            ? `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim() || employee?.name || 'N/A'
            : employee?.name || 'N/A';
        const payroll = initialData || { ...formData, ...calculatedSalary };

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Salary Invoice - ${employeeName}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    .employee-info, .company-info { flex: 1; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #f3f4f6; font-weight: bold; }
                    .total-row { font-weight: bold; font-size: 1.1em; }
                    .text-right { text-align: right; }
                    .text-green { color: #059669; }
                    .text-red { color: #dc2626; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Salary Invoice</h1>
                    <p>${monthName} ${year} • ${financialYear}</p>
                </div>
                <div class="invoice-details">
                    <div class="employee-info">
                        <h3>Employee Details</h3>
                        <p><strong>Name:</strong> ${employeeName}</p>
                        <p><strong>Employee ID:</strong> ${employee?.employeeId || employee?._id || 'N/A'}</p>
                        <p><strong>Department:</strong> ${employee?.department || 'N/A'}</p>
                    </div>
                    <div class="company-info">
                        <h3>Payment Details</h3>
                        <p><strong>Payment Date:</strong> ${payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString() : 'N/A'}</p>
                        <p><strong>Payment Method:</strong> ${payroll.paymentMethod ? payroll.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}</p>
                        <p><strong>Transaction ID:</strong> ${payroll.transactionId || 'N/A'}</p>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th class="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Basic Salary</td>
                            <td class="text-right">₹${(payroll.basicSalary || formData.basicSalary || 0).toLocaleString()}</td>
                        </tr>
                        ${(payroll.components || calculatedSalary?.components || []).filter(c => c.type === 'earning').map(c => `
                            <tr>
                                <td>${c.name}</td>
                                <td class="text-right text-green">+ ₹${c.amount?.toLocaleString() || '0'}</td>
                            </tr>
                        `).join('')}
                        ${(payroll.components || calculatedSalary?.components || []).filter(c => c.type === 'deduction').map(c => `
                            <tr>
                                <td>${c.name}</td>
                                <td class="text-right text-red">- ₹${c.amount?.toLocaleString() || '0'}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td>Total Earnings</td>
                            <td class="text-right text-green">₹${(payroll.totalEarnings || calculatedSalary?.totalEarnings || 0).toLocaleString()}</td>
                        </tr>
                        <tr class="total-row">
                            <td>Total Deductions</td>
                            <td class="text-right text-red">₹${(payroll.totalDeductions || calculatedSalary?.totalDeductions || 0).toLocaleString()}</td>
                        </tr>
                        <tr class="total-row" style="font-size: 1.2em; background-color: #e0e7ff;">
                            <td><strong>Net Salary (In-Hand)</strong></td>
                            <td class="text-right"><strong>₹${(payroll.netSalary || calculatedSalary?.netSalary || 0).toLocaleString()}</strong></td>
                        </tr>
                    </tbody>
                </table>
                ${payroll.remarks ? `<p><strong>Remarks:</strong> ${payroll.remarks}</p>` : ''}
            </body>
            </html>
        `;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col my-4">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {viewMode ? 'Payroll Details' : initialData ? 'Edit Payroll' : `Add Payroll - ${employeeType === 'teacher' ? 'Teacher' : 'Staff'}`}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {monthName} {year} • {financialYear}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Employee Details */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <User size={18} className="text-indigo-600" />
                                <h3 className="font-semibold text-gray-900">Employee Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Select {employeeType === 'teacher' ? 'Teacher' : 'Staff'} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.employeeId}
                                        onChange={(e) => {
                                            const emp = employees.find(em => (em._id || em.id) === e.target.value);
                                            setFormData({
                                                ...formData,
                                                employeeId: e.target.value,
                                                bankAccountNumber: emp?.bankAccountNumber || '',
                                                ifscCode: emp?.ifscCode || ''
                                            });
                                        }}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                                            errors.employeeId ? 'border-red-300' : 'border-gray-300'
                                        } ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        disabled={!!initialData || viewMode}
                                    >
                                        <option value="">Select {employeeType === 'teacher' ? 'Teacher' : 'Staff'}...</option>
                                        {employees.map(emp => (
                                            <option key={emp._id || emp.id} value={emp._id || emp.id}>
                                                {employeeType === 'teacher' 
                                                    ? `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.name || 'No Name'
                                                    : emp.name || 'No Name'
                                                } ({emp.employeeId || emp._id || 'N/A'})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.employeeId && (
                                        <p className="text-xs text-red-500 mt-1">{errors.employeeId}</p>
                                    )}
                                </div>
                                {selectedEmployee && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Employee ID</label>
                                            <input
                                                type="text"
                                                value={selectedEmployee.employeeId || selectedEmployee._id || 'N/A'}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                                            <input
                                                type="text"
                                                value={selectedEmployee.department || 'N/A'}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                                            <input
                                                type="text"
                                                value={employeeType === 'teacher' ? 'Teacher' : (selectedEmployee.roleId?.name || 'Staff')}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Policy Information Banner */}
                        {payrollRule && (
                            <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <FileText size={20} className="text-indigo-600 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-indigo-900 mb-2">Payroll Policy Applied ({financialYear})</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="font-medium text-indigo-800">Salary Heads:</span>
                                                <span className="text-indigo-600 ml-2">
                                                    {payrollRule.salaryHeads?.length || 0} configured
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-indigo-800">LOP Formula:</span>
                                                <span className="text-indigo-600 ml-2 capitalize">
                                                    {payrollRule.leaveRules?.lopFormula === 'fixed_30' ? 'Fixed 30 Days' : 'Actual Month Days'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-indigo-800">Working Days:</span>
                                                <span className="text-indigo-600 ml-2">
                                                    {payrollRule.leaveRules?.lopFormula === 'fixed_30' 
                                                        ? '30 days (Fixed)'
                                                        : month && year 
                                                            ? `${new Date(year, month, 0).getDate()} days (${new Date(year, month - 1).toLocaleString('default', { month: 'long' })})`
                                                            : 'Based on selected month'
                                                    }
                                                </span>
                                            </div>
                                            {payrollRule.isLocked && (
                                                <div className="text-amber-700 font-medium">
                                                    ⚠️ Policy is Locked
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Section 2: Payroll Period & Attendance */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar size={18} className="text-blue-600" />
                                <h3 className="font-semibold text-gray-900">Payroll Period & Attendance</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Working Days <span className="text-red-500">*</span>
                                        {payrollRule?.leaveRules?.lopFormula === 'fixed_30' && (
                                            <span className="text-xs text-gray-500 ml-2">(Policy: Fixed 30 Days)</span>
                                        )}
                                        {payrollRule?.leaveRules?.lopFormula === 'actual_days' && month && year && (
                                            <span className="text-xs text-gray-500 ml-2">
                                                (Policy: {new Date(year, month, 0).getDate()} days for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })})
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.workingDays}
                                        onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
                                        min="1"
                                        max="31"
                                        disabled={viewMode}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                                            errors.workingDays ? 'border-red-300' : 'border-gray-300'
                                        } ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                    {viewMode && payrollRule?.leaveRules?.lopFormula === 'fixed_30' && (
                                        <p className="text-xs text-blue-600 mt-1">Using Fixed 30 Days (Policy)</p>
                                    )}
                                    {viewMode && payrollRule?.leaveRules?.lopFormula === 'actual_days' && month && year && (
                                        <p className="text-xs text-blue-600 mt-1">
                                            Using {new Date(year, month, 0).getDate()} days for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} (Policy)
                                        </p>
                                    )}
                                    {errors.workingDays && (
                                        <p className="text-xs text-red-500 mt-1">{errors.workingDays}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Present Days <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.presentDays}
                                        onChange={(e) => {
                                            const present = parseInt(e.target.value) || 0;
                                            const leave = formData.workingDays - present;
                                            setFormData({ ...formData, presentDays: present, leaveDays: Math.max(0, leave) });
                                        }}
                                        min="0"
                                        max={formData.workingDays}
                                        disabled={viewMode}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                                            errors.presentDays ? 'border-red-300' : 'border-gray-300'
                                        } ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                    {errors.presentDays && (
                                        <p className="text-xs text-red-500 mt-1">{errors.presentDays}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Leave Days (LOP)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.leaveDays}
                                        onChange={(e) => {
                                            const leave = parseInt(e.target.value) || 0;
                                            const present = formData.workingDays - leave;
                                            setFormData({ ...formData, leaveDays: leave, presentDays: Math.max(0, present) });
                                        }}
                                        min="0"
                                        max={formData.workingDays}
                                        disabled={viewMode}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                                            errors.leaveDays ? 'border-red-300' : 'border-gray-300'
                                        } ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                    {errors.leaveDays && (
                                        <p className="text-xs text-red-500 mt-1">{errors.leaveDays}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Basic Salary */}
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center gap-2 mb-4">
                                <DollarSign size={18} className="text-green-600" />
                                <h3 className="font-semibold text-gray-900">Basic Salary</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Basic Salary <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.basicSalary}
                                    onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                                    placeholder="Enter basic salary"
                                    disabled={viewMode}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                                        errors.basicSalary ? 'border-red-300' : 'border-gray-300'
                                    } ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                />
                                {errors.basicSalary && (
                                    <p className="text-xs text-red-500 mt-1">{errors.basicSalary}</p>
                                )}
                            </div>
                        </div>

                        {/* Section 4: Earnings */}
                  

                        {/* Section 5: Deductions */}
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign size={18} className="text-red-600" />
                                    <h3 className="font-semibold text-gray-900">Deductions (PF, Tax, etc.)</h3>
                                </div>
                                
                            </div>

                            {/* Show Policy-Based Deductions First */}
                            {payrollRule && payrollRule.salaryHeads && payrollRule.salaryHeads.filter(h => h.type === 'deduction').length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold text-indigo-700 uppercase">From Policy ({financialYear}):</span>
                                    </div>
                                    {payrollRule.salaryHeads.filter(h => h.type === 'deduction').map((head, idx) => {
                                        // Calculate amount for display
                                        let displayAmount = 0;
                                        if (head.calculation === 'fixed') {
                                            displayAmount = head.value;
                                        } else if (head.calculation === 'percentage' && formData.basicSalary) {
                                            const baseAmount = head.base === 'basic' ? parseFloat(formData.basicSalary) : 0;
                                            displayAmount = (baseAmount * head.value) / 100;
                                        }
                                        
                                        return (
                                            <div key={idx} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg border-2 border-indigo-200 shadow-sm">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">{head.name}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {head.calculation === 'fixed' 
                                                            ? `Fixed: ₹${head.value.toLocaleString()}`
                                                            : `Percentage: ${head.value}% of ${head.base === 'basic' ? 'Basic' : 'Total Earnings'}`
                                                        }
                                                    </div>
                                                </div>
                                                {formData.basicSalary ? (
                                                    <span className="text-red-700 font-bold text-base">
                                                        - ₹{displayAmount.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Enter basic salary</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* LOP Display */}
                            {payrollRule?.leaveRules && (
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-amber-800">Loss of Pay (LOP) Calculation:</span>
                                        <span className="text-xs text-amber-600 capitalize">
                                            {payrollRule.leaveRules.lopFormula === 'fixed_30' ? 'Fixed 30 Days' : 'Actual Month Days'}
                                        </span>
                                    </div>
                                    {payrollRule.leaveRules.lopFormula === 'actual_days' && month && year && (
                                        <div className="text-xs text-amber-700 mb-2">
                                            Using {new Date(year, month, 0).getDate()} days for {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </div>
                                    )}
                                    {formData.leaveDays > 0 && formData.basicSalary && calculatedSalary?.lopAmount > 0 && (
                                        <div className="flex justify-between items-center text-sm bg-white p-2 rounded border border-amber-200">
                                            <span className="font-medium">LOP for {formData.leaveDays} day(s)</span>
                                            <span className="text-red-700 font-bold">- ₹{calculatedSalary.lopAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {formData.leaveDays === 0 && (
                                        <p className="text-xs text-amber-600">No leave days - No LOP deduction</p>
                                    )}
                                </div>
                            )}

                            {/* Custom Deductions */}
                            {formData.customDeductions.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold text-gray-600 uppercase">Custom Deductions:</span>
                                    </div>
                                    {formData.customDeductions.map((deduction, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-red-200">
                                            <span className="text-sm font-medium">{deduction.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-red-700 font-semibold">₹{parseFloat(deduction.amount).toLocaleString()}</span>
                                                {!viewMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCustomDeduction(idx)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Calculated Deductions Summary */}
                            {calculatedSalary && calculatedSalary.components.filter(c => c.type === 'deduction').length > 0 && (
                                <div className="mt-4 pt-4 border-t border-red-300">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-700">Total Deductions (Calculated):</span>
                                        <span className="text-lg font-bold text-red-700">₹{calculatedSalary.totalDeductions.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 6: Salary Calculation Summary */}
                        {calculatedSalary && (
                            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calculator size={20} className="text-indigo-600" />
                                    <h3 className="font-bold text-indigo-900 text-lg">Salary Calculation Summary</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="bg-white p-4 rounded-lg border border-indigo-200">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total Earnings</div>
                                        <div className="text-2xl font-bold text-green-700">₹{calculatedSalary.totalEarnings.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-indigo-200">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total Deductions</div>
                                        <div className="text-2xl font-bold text-red-700">₹{calculatedSalary.totalDeductions.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-indigo-100 p-4 rounded-lg border-2 border-indigo-300">
                                        <div className="text-xs text-indigo-600 uppercase font-bold mb-1">Net Salary (In-Hand)</div>
                                        <div className="text-3xl font-bold text-indigo-900">₹{calculatedSalary.netSalary.toLocaleString()}</div>
                                    </div>
                                </div>

                                {calculatedSalary.lopAmount > 0 && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-amber-800">Loss of Pay (LOP) for {formData.leaveDays} days</span>
                                            <span className="font-bold text-amber-900">- ₹{calculatedSalary.lopAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Section 7: Payment Details */}
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard size={18} className="text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Payment Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Date</label>
                                    <input
                                        type="date"
                                        value={formData.paymentDate}
                                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                                        disabled={viewMode}
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method</label>
                                    <select
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        disabled={viewMode}
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Select method</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="neft">NEFT</option>
                                        <option value="rtgs">RTGS</option>
                                        <option value="upi">UPI</option>
                                        <option value="cheque">Cheque</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Transaction ID
                                        {viewMode && formData.transactionId && (
                                            <span className="text-xs text-gray-500 ml-2">(Payment Reference)</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.transactionId || ''}
                                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                        placeholder={viewMode ? "No transaction ID" : "Enter transaction ID"}
                                        disabled={viewMode}
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''} ${viewMode && formData.transactionId ? 'font-mono text-sm' : ''}`}
                                    />
                                    {viewMode && !formData.transactionId && (
                                        <p className="text-xs text-gray-400 mt-1">No transaction ID recorded</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Account Number</label>
                                    <input
                                        type="text"
                                        value={formData.bankAccountNumber}
                                        onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                                        placeholder="Enter account number"
                                        disabled={viewMode}
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">IFSC Code</label>
                                    <input
                                        type="text"
                                        value={formData.ifscCode}
                                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                                        placeholder="Enter IFSC code"
                                        disabled={viewMode}
                                        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks / Notes</label>
                            <textarea
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                placeholder="Add any remarks or notes..."
                                rows={3}
                                disabled={viewMode}
                                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${viewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            />
                        </div>

                        {/* Warning if no payroll rule */}
                        {!payrollRule && (
                            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                                <div className="text-sm text-amber-800">
                                    <p className="font-medium mb-1">No Payroll Rules Found</p>
                                    <p>Please configure payroll rules for {financialYear} first. You can still add custom earnings and deductions manually.</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 sticky bottom-0">
                    {viewMode ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            {calculatedSalary && (
                                <button
                                    onClick={() => {
                                        const invoiceHTML = generateInvoiceHTML();
                                        const invoiceWindow = window.open('', '_blank');
                                        invoiceWindow.document.write(invoiceHTML);
                                        invoiceWindow.document.close();
                                        invoiceWindow.print();
                                    }}
                                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                >
                                    <Receipt size={16} />
                                    Generate Invoice
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving || !calculatedSalary}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                {saving ? 'Saving...' : initialData ? 'Update Payroll' : 'Create Payroll'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PayrollFormModal;
