import React, { useState, useEffect } from 'react';
import { Plus, Loader2, GraduationCap, Users, Filter, Download, Search, Calendar, DollarSign } from 'lucide-react';
import { useAdminStore, selectAcademicYearsForSelect } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';
import { API_URL } from '@/app/api';
import PayrollFormModal from './components/payroll/PayrollFormModal';
import PayrollList from './components/payroll/PayrollList';
import MarkAsPaidModal from './components/payroll/MarkAsPaidModal';

const Payroll = () => {
    const academicYears = useAdminStore(selectAcademicYearsForSelect);
    const {
        payrolls,
        fetchPayrolls,
        branches,
        fetchBranches,
        teachers,
        fetchTeachers,
        fetchAcademicYears
    } = useAdminStore();
    const user = useAppStore(state => state.user);

    const [loading, setLoading] = useState(true);
    const [employeeType, setEmployeeType] = useState('teacher'); // 'teacher' or 'staff'
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [financialYear, setFinancialYear] = useState('2025-26');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [viewMode, setViewMode] = useState(false);
    const [isMarkAsPaidOpen, setIsMarkAsPaidOpen] = useState(false);
    const [payrollToMarkPaid, setPayrollToMarkPaid] = useState(null);
    const [instituteData, setInstituteData] = useState(null);

    // Fetch institute data
    useEffect(() => {
        const fetchInstituteData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/institute/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setInstituteData(data.data);
                }
            } catch (error) {
                console.error('Error fetching institute data:', error);
            }
        };
        fetchInstituteData();
    }, []);

    // Fetch initial data
    useEffect(() => {
        const loadInitial = async () => {
            setLoading(true);
            await fetchBranches();
            await fetchAcademicYears();
            
            // Set default branch
            if (user?.branchId && /^[0-9a-fA-F]{24}$/.test(user.branchId)) {
                setSelectedBranchId(user.branchId);
            } else if (branches.length > 0) {
                setSelectedBranchId(branches[0]._id);
            }
            
            // Set default financial year from active academic year
            if (academicYears.length > 0) {
                const activeYear = academicYears.find(ay => ay.status === 'active') || academicYears[0];
                if (activeYear?.name) {
                    setFinancialYear(activeYear.name);
                }
            }
            
            setLoading(false);
        };
        loadInitial();
    }, [fetchBranches, fetchAcademicYears, user?.branchId]);

    // Fetch payrolls when filters change
    useEffect(() => {
        if (selectedBranchId) {
            const filters = {
                branchId: selectedBranchId,
                employeeType,
                month: selectedMonth,
                year: selectedYear,
                financialYear
            };
            fetchPayrolls(filters);
        }
    }, [selectedBranchId, employeeType, selectedMonth, selectedYear, financialYear, fetchPayrolls]);

    // Fetch teachers/staff when branch or type changes
    useEffect(() => {
        if (selectedBranchId && employeeType === 'teacher') {
            fetchTeachers();
        } else if (selectedBranchId && employeeType === 'staff') {
            const loadStaff = async () => {
                const { fetchStaff } = useAdminStore.getState();
                const staff = await fetchStaff(selectedBranchId);
                setStaffList(staff || []);
            };
            loadStaff();
        }
    }, [selectedBranchId, employeeType, fetchTeachers]);

    const handleCreate = () => {
        setSelectedPayroll(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedPayroll(null);
        setViewMode(false);
    };

    const handleMarkAsPaid = (payroll) => {
        setPayrollToMarkPaid(payroll);
        setIsMarkAsPaidOpen(true);
    };

    const handleConfirmMarkAsPaid = async (paymentData) => {
        try {
            const result = await useAdminStore.getState().updatePayroll(
                payrollToMarkPaid._id || payrollToMarkPaid.id,
                {
                    status: 'paid',
                    ...paymentData
                }
            );

            if (result) {
                // Refresh payrolls
                const filters = {
                    branchId: selectedBranchId,
                    employeeType,
                    month: selectedMonth,
                    year: selectedYear,
                    financialYear
                };
                await fetchPayrolls(filters);
                setIsMarkAsPaidOpen(false);
                setPayrollToMarkPaid(null);
            }
        } catch (error) {
            console.error('Error marking as paid:', error);
            alert('Failed to mark as paid. Please try again.');
        }
    };

    const handleGenerateInvoice = async (payroll) => {
        // Generate invoice PDF
        try {
            const { generatePayrollInvoice } = useAdminStore.getState();
            if (generatePayrollInvoice) {
                await generatePayrollInvoice(payroll._id || payroll.id);
            } else {
                // Fallback: Open print dialog with formatted invoice
                window.print();
            }
        } catch (error) {
            console.error('Error generating invoice:', error);
            // Fallback: Show invoice in new window
            const invoiceWindow = window.open('', '_blank');
            const invoiceHTML = generateInvoiceHTML(payroll);
            invoiceWindow.document.write(invoiceHTML);
            invoiceWindow.document.close();
            invoiceWindow.print();
        }
    };

    const handleEdit = (payroll) => {
        setViewMode(false);
        setSelectedPayroll(payroll);
        setIsFormOpen(true);
    };
    
    const handleViewDetails = (payroll) => {
        setViewMode(true);
        setSelectedPayroll(payroll);
        setIsFormOpen(true);
    };

    const generateInvoiceHTML = (payroll) => {
        const employee = payroll.employeeId;
        const employeeName = employeeType === 'teacher' 
            ? `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim() || employee?.name || 'N/A'
            : employee?.name || 'N/A';
        const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' });
        const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
        const paymentDate = payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A';
        
        // Institute details
        const instituteName = instituteData?.legalName || instituteData?.shortName || 'Educational Institution';
        const instituteLogo = instituteData?.logoLight || instituteData?.logoDark || '';
        const instituteAddress = [
            instituteData?.address,
            instituteData?.city,
            instituteData?.state,
            instituteData?.pincode
        ].filter(Boolean).join(', ');
        const senderName = instituteData?.adminName || 'Administrator';
        const institutePhone = instituteData?.phone || '';
        const instituteEmail = instituteData?.email || '';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Salary Payslip - ${employeeName}</title>
                <style>
                    @media print {
                        body { margin: 0; padding: 0; }
                        .no-print { display: none; }
                        .payslip-container { box-shadow: none; }
                    }
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Times New Roman', serif; padding: 0; background: white; }
                    .payslip-container { max-width: 210mm; margin: 0 auto; background: white; padding: 15mm; }
                    
                    /* Letterhead Header */
                    .letterhead-header { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
                    .logo-section { display: flex; align-items: center; gap: 20px; margin-bottom: 10px; }
                    .logo-section img { max-height: 60px; max-width: 150px; object-fit: contain; }
                    .company-name { flex: 1; }
                    .company-name h1 { font-size: 24px; font-weight: bold; color: #000; margin-bottom: 5px; text-transform: uppercase; }
                    .company-name p { font-size: 12px; color: #333; }
                    .company-address { font-size: 11px; color: #555; line-height: 1.6; margin-top: 8px; }
                    .company-contact { font-size: 10px; color: #666; margin-top: 5px; }
                    
                    /* Payslip Title */
                    .payslip-title { text-align: center; margin: 25px 0; }
                    .payslip-title h2 { font-size: 20px; font-weight: bold; text-decoration: underline; margin-bottom: 5px; }
                    .payslip-title p { font-size: 14px; }
                    
                    /* Employee and Payment Info */
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; }
                    .info-box { border: 1px solid #ddd; padding: 12px; }
                    .info-box h3 { font-size: 13px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 3px; }
                    .info-box p { font-size: 11px; margin: 4px 0; line-height: 1.5; }
                    .info-box strong { font-weight: bold; }
                    
                    /* Salary Tables */
                    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11px; }
                    thead { background: #f0f0f0; }
                    th { border: 1px solid #000; padding: 8px; text-align: left; font-weight: bold; font-size: 11px; }
                    th.text-right { text-align: right; }
                    tbody tr { border-bottom: 1px solid #ddd; }
                    td { border: 1px solid #ddd; padding: 7px; font-size: 11px; }
                    td.text-right { text-align: right; }
                    .earning { color: #000; }
                    .deduction { color: #000; }
                    .total-row { background: #f5f5f5; font-weight: bold; }
                    .net-salary-row { background: #e8e8e8; border: 2px solid #000; }
                    .net-salary-row td { font-size: 13px; font-weight: bold; padding: 10px; }
                    
                    /* Footer */
                    .footer-section { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; }
                    .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
                    .signature-box { width: 200px; text-align: center; }
                    .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
                    .signature-box p { font-size: 10px; margin-top: 5px; }
                    .footer-note { text-align: center; font-size: 10px; color: #666; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="payslip-container">
                    <!-- Letterhead Header -->
                    <div class="letterhead-header">
                        <div class="logo-section">
                            ${instituteLogo ? `<img src="${instituteLogo}" alt="Logo" />` : ''}
                            <div class="company-name">
                                <h1>${instituteName}</h1>
                                ${instituteAddress ? `<div class="company-address">${instituteAddress}</div>` : ''}
                                <div class="company-contact">
                                    ${institutePhone ? `Phone: ${institutePhone}` : ''}
                                    ${instituteEmail ? ` | Email: ${instituteEmail}` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payslip Title -->
                    <div class="payslip-title">
                        <h2>SALARY PAYSLIP</h2>
                        <p>For the month of ${monthName} ${selectedYear} | Financial Year: ${financialYear}</p>
                    </div>

                    <!-- Employee and Payment Info -->
                    <div class="info-grid">
                        <div class="info-box">
                            <h3>Employee Information</h3>
                            <p><strong>Name:</strong> ${employeeName}</p>
                            <p><strong>Employee ID:</strong> ${employee?.employeeId || employee?._id || 'N/A'}</p>
                            <p><strong>Department:</strong> ${employee?.department || 'N/A'}</p>
                            <p><strong>Designation:</strong> ${employeeType === 'teacher' ? 'Teacher' : (employee?.roleId?.name || 'Staff')}</p>
                        </div>
                        <div class="info-box">
                            <h3>Payment Details</h3>
                            <p><strong>Payment Date:</strong> ${paymentDate}</p>
                            <p><strong>Payment Method:</strong> ${payroll.paymentMethod ? payroll.paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}</p>
                            ${payroll.transactionId ? `<p><strong>Transaction ID:</strong> ${payroll.transactionId}</p>` : ''}
                            ${payroll.bankAccountNumber ? `<p><strong>Bank Account:</strong> ${payroll.bankAccountNumber}</p>` : ''}
                            ${payroll.ifscCode ? `<p><strong>IFSC Code:</strong> ${payroll.ifscCode}</p>` : ''}
                        </div>
                    </div>

                    <!-- Earnings Table -->
                    <table>
                        <thead>
                            <tr>
                                <th>Earnings</th>
                                <th class="text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Basic Salary</td>
                                <td class="text-right">${payroll.basicSalary?.toLocaleString() || '0'}</td>
                            </tr>
                            ${payroll.components?.filter(c => c.type === 'earning').map(c => `
                                <tr>
                                    <td>${c.name}</td>
                                    <td class="text-right earning">${c.amount?.toLocaleString() || '0'}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td><strong>Total Earnings</strong></td>
                                <td class="text-right"><strong>₹${payroll.totalEarnings?.toLocaleString() || '0'}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Deductions Table -->
                    <table>
                        <thead>
                            <tr>
                                <th>Deductions</th>
                                <th class="text-right">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${payroll.components?.filter(c => c.type === 'deduction').length > 0 ? payroll.components.filter(c => c.type === 'deduction').map(c => `
                                <tr>
                                    <td>${c.name}</td>
                                    <td class="text-right deduction">${c.amount?.toLocaleString() || '0'}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="2" style="text-align: center;">No deductions</td></tr>'}
                            ${payroll.lopAmount > 0 ? `
                                <tr>
                                    <td>Loss of Pay (LOP) - ${payroll.leaveDays} days</td>
                                    <td class="text-right deduction">${payroll.lopAmount?.toLocaleString() || '0'}</td>
                                </tr>
                            ` : ''}
                            <tr class="total-row">
                                <td><strong>Total Deductions</strong></td>
                                <td class="text-right"><strong>₹${payroll.totalDeductions?.toLocaleString() || '0'}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Net Salary -->
                    <table>
                        <tbody>
                            <tr class="net-salary-row">
                                <td><strong>NET SALARY (IN-HAND)</strong></td>
                                <td class="text-right"><strong>₹${payroll.netSalary?.toLocaleString() || '0'}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    ${payroll.remarks ? `
                        <div style="margin-top: 20px; padding: 10px; border: 1px solid #ddd; font-size: 10px;">
                            <strong>Remarks:</strong> ${payroll.remarks}
                        </div>
                    ` : ''}

                    <!-- Footer with Signature -->
                    <div class="footer-section">
                        <div class="signature-section">
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <p>Employee Signature</p>
                            </div>
                            <div class="signature-box">
                                <div class="signature-line"></div>
                                <p>Authorized Signatory</p>
                                <p style="margin-top: 5px;"><strong>${senderName}</strong></p>
                            </div>
                        </div>
                        <div class="footer-note">
                            <p>This is a computer-generated payslip. For any queries, please contact the HR department.</p>
                            <p style="margin-top: 5px;">Generated on: ${currentDate}</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    };

    const filteredPayrolls = payrolls.filter(p => {
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const employeeName = p.employeeId?.firstName || p.employeeId?.name || '';
            const employeeId = p.employeeId?.employeeId || '';
            return employeeName.toLowerCase().includes(searchLower) || 
                   employeeId.toLowerCase().includes(searchLower);
        }
        return true;
    });

    const currentMonthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' });
    const stats = {
        total: filteredPayrolls.length,
        totalAmount: filteredPayrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0),
        paid: filteredPayrolls.filter(p => p.status === 'paid').length,
        pending: filteredPayrolls.filter(p => p.status === 'draft' || p.status === 'approved').length
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative pb-10 font-['Inter']">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Payroll Management</h1>
                    <p className="text-gray-500 text-sm">Manage payroll for teachers and staff based on payroll rules</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-md hover:shadow-lg active:scale-95"
                >
                    <Plus size={18} /> Add Payroll
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total Entries</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
                    <div className="text-xs text-green-600 uppercase font-bold mb-1">Total Amount</div>
                    <div className="text-2xl font-bold text-green-700">₹{stats.totalAmount.toLocaleString()}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                    <div className="text-xs text-blue-600 uppercase font-bold mb-1">Paid</div>
                    <div className="text-2xl font-bold text-blue-700">{stats.paid}</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-sm">
                    <div className="text-xs text-amber-600 uppercase font-bold mb-1">Pending</div>
                    <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Employee Type Tabs */}
                    <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setEmployeeType('teacher')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                                employeeType === 'teacher'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <GraduationCap size={16} /> Teachers
                        </button>
                        <button
                            onClick={() => setEmployeeType('staff')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                                employeeType === 'staff'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Users size={16} /> Staff
                        </button>
                    </div>

                    {/* Branch Selector */}
                    {branches.length > 0 && (
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            {branches.map(branch => (
                                <option key={branch._id} value={branch._id}>{branch.name}</option>
                            ))}
                        </select>
                    )}

                    {/* Month Selector */}
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>
                                {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>

                    {/* Year Selector */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    {/* Financial Year (Academic Year) */}
                    <select
                        value={financialYear}
                        onChange={(e) => setFinancialYear(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                        {academicYears.length > 0 ? (
                            academicYears.map(ay => (
                                <option key={ay._id || ay.id} value={ay.name}>
                                    {ay.name} {ay.status === 'active' ? '(Active)' : ''}
                                </option>
                            ))
                        ) : (
                            <>
                                <option value="2025-26">2025-26</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                            </>
                        )}
                    </select>

                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or employee ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Payroll List */}
            <PayrollList
                payrolls={filteredPayrolls}
                employeeType={employeeType}
                onEdit={handleEdit}
                onMarkAsPaid={handleMarkAsPaid}
                onGenerateInvoice={handleGenerateInvoice}
                onView={handleViewDetails}
                month={currentMonthName}
                year={selectedYear}
            />

            {/* Form Modal */}
            {isFormOpen && (
                <PayrollFormModal
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    initialData={selectedPayroll}
                    employeeType={employeeType}
                    branchId={selectedBranchId}
                    month={selectedMonth}
                    year={selectedYear}
                    financialYear={financialYear}
                    teachers={employeeType === 'teacher' ? teachers : []}
                    staff={employeeType === 'staff' ? staffList : []}
                    viewMode={viewMode}
                />
            )}

            {/* Mark as Paid Modal */}
            {isMarkAsPaidOpen && (
                <MarkAsPaidModal
                    isOpen={isMarkAsPaidOpen}
                    onClose={() => {
                        setIsMarkAsPaidOpen(false);
                        setPayrollToMarkPaid(null);
                    }}
                    payroll={payrollToMarkPaid}
                    employeeType={employeeType}
                    onConfirm={handleConfirmMarkAsPaid}
                />
            )}
        </div>
    );
};

export default Payroll;
