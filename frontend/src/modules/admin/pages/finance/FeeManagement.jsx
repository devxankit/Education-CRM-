import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, Filter, Download, Mail, 
    ChevronDown, Building2, Calendar, BookOpen, 
    Users, LayoutGrid, CheckCircle2, AlertCircle, 
    Clock, MoreHorizontal, Wallet,
    Loader2
} from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

const FeeManagement = () => {
    const { 
        academicYears, fetchAcademicYears,
        branches, fetchBranches,
        classes, fetchClasses,
        sections, fetchSections,
        courses, fetchCourses,
        feeManagementStatus, fetchFeeManagementStatus,
        addToast
    } = useAdminStore();
    
    const user = useAppStore(state => state.user);

    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        branchId: user?.branchId || '',
        academicYearId: '',
        classId: '',
        sectionId: '',
        courseId: '',
        status: '',
        search: ''
    });

    const [activeTab, setActiveTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const RECORDS_PER_PAGE = 5;

    // Reset pagination on filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.search, activeTab, filters.branchId, filters.academicYearId, filters.classId, filters.sectionId]);

    // Initial load
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await fetchBranches();
            setLoading(false);
        };
        loadInitialData();
    }, []);

    // Load Academic Years when Branch changes
    useEffect(() => {
        if (filters.branchId) {
            fetchAcademicYears(filters.branchId);
        }
    }, [filters.branchId]);

    // Load dependent data (Classes, Courses) when branch OR academic year changes
    useEffect(() => {
        if (filters.branchId && filters.academicYearId) {
            fetchClasses(filters.branchId, false, filters.academicYearId);
            fetchCourses(filters.branchId, filters.academicYearId); 
        }
    }, [filters.branchId, filters.academicYearId]);

    // Load sections when class changes
    useEffect(() => {
        if (filters.classId) {
            fetchSections(filters.classId);
        }
    }, [filters.classId]);

    // Fetch fee status when filters change
    useEffect(() => {
        const fetchData = async () => {
            if (filters.branchId && filters.academicYearId) {
                setLoading(true);
                await fetchFeeManagementStatus(filters);
                setLoading(false);
            }
        };
        fetchData();
    }, [filters.branchId, filters.academicYearId, filters.classId, filters.sectionId, filters.courseId, filters.status]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const next = { ...prev, [name]: value };
            
            // Hierarchical Reset
            if (name === 'branchId') {
                next.academicYearId = '';
                next.classId = '';
                next.sectionId = '';
                next.courseId = '';
            } else if (name === 'academicYearId') {
                next.classId = '';
                next.sectionId = '';
            } else if (name === 'classId') {
                next.sectionId = '';
            }
            
            return next;
        });
    };

    const filteredData = useMemo(() => {
        let data = feeManagementStatus || [];
        if (filters.search) {
            const s = filters.search.toLowerCase();
            data = data.filter(item => 
                item.firstName?.toLowerCase().includes(s) || 
                item.lastName?.toLowerCase().includes(s) || 
                item.admissionNo?.toLowerCase().includes(s)
            );
        }
        if (activeTab !== 'all') {
            data = data.filter(item => item.feeStatus?.status?.toLowerCase() === activeTab.toLowerCase());
        }
        return data;
    }, [feeManagementStatus, filters.search, activeTab]);

    const stats = useMemo(() => {
        const data = feeManagementStatus || [];
        return {
            total: data.length,
            paid: data.filter(i => i.feeStatus?.status === 'Paid').length,
            partial: data.filter(i => i.feeStatus?.status === 'Partial').length,
            pending: data.filter(i => i.feeStatus?.status === 'Pending').length,
            totalCollection: data.reduce((acc, i) => acc + (i.feeStatus?.paid || 0), 0),
            totalOutstanding: data.reduce((acc, i) => acc + (i.feeStatus?.balance || 0), 0)
        };
    }, [feeManagementStatus]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
        return filteredData.slice(startIndex, startIndex + RECORDS_PER_PAGE);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / RECORDS_PER_PAGE);

    const handleExportPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
        const timestamp = format(new Date(), 'dd-MMM-yyyy HH:mm');
        const branchName = branches.find(b => b._id === filters.branchId)?.name || 'All';
        const ayName = academicYears.find(ay => ay._id === filters.academicYearId)?.name || 'N/A';

        doc.setFontSize(20);
        doc.text("Fee Management Report", 14, 15);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Branch: ${branchName} | Academic Year: ${ayName} | Generated: ${timestamp}`, 14, 22);

        const tableColumn = ["Student Name", "Adm No", "Class/Section", "Program", "Status", "Total Fee", "Paid", "Balance"];
        const tableRows = filteredData.map(item => [
            `${item.firstName} ${item.lastName}`,
            item.admissionNo,
            `${item.classId?.name || '-'}${item.sectionId ? ` / ${item.sectionId.name}` : ''}`,
            item.courseId?.name || '-',
            item.feeStatus?.status || 'N/A',
            `₹${(item.feeStatus?.totalFee || 0).toLocaleString()}`,
            `₹${(item.feeStatus?.paid || 0).toLocaleString()}`,
            `₹${(item.feeStatus?.balance || 0).toLocaleString()}`
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 28,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                4: { fontStyle: 'bold' }
            },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 4) {
                    const status = data.cell.raw;
                    if (status === 'Paid') data.cell.styles.textColor = [5, 150, 105];
                    if (status === 'Pending') data.cell.styles.textColor = [220, 38, 38];
                    if (status === 'Partial') data.cell.styles.textColor = [217, 119, 6];
                }
            }
        });

        doc.save(`Fee_Report_${branchName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    };

    const handleSendReminder = async (student) => {
        try {
            if (student.feeStatus?.balance <= 0) {
                addToast('No outstanding balance for this student.', 'info');
                return;
            }
            // Logic to trigger reminder (e.g., calling backend or communication store)
            addToast(`Fee reminder sent to ${student.firstName} & parent. Balance: ₹${student.feeStatus.balance.toLocaleString()}`, 'success');
        } catch (error) {
            addToast('Failed to send fee reminder.', 'error');
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen font-['Inter']">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Wallet className="text-indigo-600" size={28} />
                        Fee Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Track and manage student fee records across branches and academics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleExportPDF}
                        disabled={filteredData.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        <Download size={16} /> Export as PDF
                    </button>
                </div>
            </div>


            {/* Filters Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <Filter size={18} /> Financial & Academic Filters
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {/* Branch */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <Building2 size={12} /> Branch / Campus
                        </label>
                        <select 
                            name="branchId"
                            value={filters.branchId}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        >
                            <option value="">Select Branch</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Academic Year */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <Calendar size={12} /> Academic Year
                        </label>
                        <select 
                            name="academicYearId"
                            value={filters.academicYearId}
                            onChange={handleFilterChange}
                            disabled={!filters.branchId}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50"
                        >
                            <option value="">Select Year</option>
                            {academicYears.map(ay => (
                                <option key={ay._id} value={ay._id}>{ay.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Class */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <LayoutGrid size={12} /> Class
                        </label>
                        <select 
                            name="classId"
                            value={filters.classId}
                            onChange={handleFilterChange}
                            disabled={!filters.academicYearId}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50"
                        >
                            <option value="">All Classes</option>
                            {classes.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <Users size={12} /> Section
                        </label>
                        <select 
                            name="sectionId"
                            value={filters.sectionId}
                            onChange={handleFilterChange}
                            disabled={!filters.classId}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50"
                        >
                            <option value="">All Sections</option>
                            {(sections[filters.classId] || []).map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Program/Course */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <BookOpen size={12} /> Program
                        </label>
                        <select 
                            name="courseId"
                            value={filters.courseId}
                            onChange={handleFilterChange}
                            disabled={!filters.branchId}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50"
                        >
                            <option value="">All Programs</option>
                            {(courses || []).map(cr => (
                                <option key={cr._id} value={cr._id}>{cr.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                            <CheckCircle2 size={12} /> Payment Status
                        </label>
                        <select 
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        >
                            <option value="">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Partial">Partial</option>
                            <option value="Pending">Pending</option>
                            <option value="No Structure">No Structure</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-100">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by student name or admission number..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center border-b border-gray-100">
                    {['all', 'Paid', 'Partial', 'Pending'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-sm font-semibold transition-all border-b-2 hover:bg-gray-50 ${activeTab === tab ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-500'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                {tab === 'all' ? stats.total : (tab === 'Paid' ? stats.paid : (tab === 'Partial' ? stats.partial : stats.pending))}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Academic Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fee Structure</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Financial Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={32} className="text-indigo-600 animate-spin" />
                                            <p className="text-gray-500 animate-pulse text-sm">Syncing latest fee records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Users size={48} className="text-gray-200" />
                                            <p className="text-gray-400 text-sm">No student fee records found for the selected criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/80 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                                    {item.firstName?.[0]}{item.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{item.firstName} {item.lastName}</div>
                                                    <div className="text-[11px] text-gray-400 font-medium">ADM: {item.admissionNo} • ROLL: {item.rollNo || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-xs font-bold text-gray-700 flex items-center gap-1">
                                                    <LayoutGrid size={12} className="text-gray-400" /> {item.classId?.name || 'No Class'}
                                                </div>
                                                <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                                                    <Users size={10} className="text-gray-300" /> SEC: {item.sectionId?.name || 'NA'}
                                                </div>
                                                {item.courseId && (
                                                    <div className="text-[11px] text-indigo-500 font-bold">
                                                        PROG: {item.courseId.name}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md inline-block">
                                                {item.feeStatus?.structureName || 'Not Assigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between gap-4 max-w-[150px]">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                                                        item.feeStatus?.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                        item.feeStatus?.status === 'Partial' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                        item.feeStatus?.status === 'Pending' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                                        'bg-gray-100 text-gray-700 border border-gray-200'
                                                    }`}>
                                                        {item.feeStatus?.status}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-900">₹{item.feeStatus?.totalFee.toLocaleString()}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden max-w-[150px]">
                                                    <div 
                                                        className={`h-full transition-all duration-500 ${item.feeStatus?.status === 'Paid' ? 'bg-emerald-500' : item.feeStatus?.status === 'Partial' ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                        style={{ width: `${Math.min(100, (item.feeStatus?.paid / item.feeStatus?.totalFee) * 100) || 0}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-[10px] max-w-[150px]">
                                                    <span className="text-emerald-600 font-bold">Paid: ₹{item.feeStatus?.paid.toLocaleString()}</span>
                                                    <span className="text-rose-600 font-bold">Bal: ₹{item.feeStatus?.balance.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleSendReminder(item)}
                                                    title={`Send Fee Reminder (Bal: ₹${item.feeStatus?.balance.toLocaleString()})`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm"
                                                >
                                                    <Mail size={16} />
                                                    Send Reminder
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Showing {((currentPage - 1) * RECORDS_PER_PAGE) + 1} to {Math.min(currentPage * RECORDS_PER_PAGE, filteredData.length)} of {filteredData.length} records
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                                            currentPage === i + 1 
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all active:scale-95 shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeeManagement;
