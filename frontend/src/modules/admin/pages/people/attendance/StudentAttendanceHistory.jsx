
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, 
    Calendar as CalendarIcon, 
    User, 
    GraduationCap, 
    MapPin, 
    Tag,
    Clock,
    CheckCircle2,
    XCircle,
    UserMinus,
    AlertCircle,
    PieChart as PieChartIcon,
    Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAdminStore } from '../../../../../store/adminStore';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StudentAttendanceHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fetchStudentAttendanceHistory = useAdminStore(state => state.fetchStudentAttendanceHistory);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
    });

    const loadHistory = async () => {
        setLoading(true);
        try {
            const result = await fetchStudentAttendanceHistory(id, dateRange);
            setData(result);
        } catch (error) {
            console.error("Failed to load history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, [id, dateRange.startDate, dateRange.endDate]);

    // Calculate Stats
    const stats = useMemo(() => {
        if (!data || !data.history) return { total: 0, present: 0, absent: 0, late: 0, leave: 0, percentage: 0 };
        const history = data.history;
        const total = history.length;
        if (total === 0) return { total: 0, present: 0, absent: 0, late: 0, leave: 0, percentage: 0 };

        const present = history.filter(h => h.status === 'Present').length;
        const absent = history.filter(h => h.status === 'Absent').length;
        const late = history.filter(h => h.status === 'Late').length;
        const leave = history.filter(h => h.status === 'Leave').length;
        const percentage = ((present + late) / total * 100).toFixed(1);

        return { total, present, absent, late, leave, percentage };
    }, [data]);

    const chartData = [
        { name: 'Present', value: stats.present, color: '#10b981' },
        { name: 'Absent', value: stats.absent, color: '#f43f5e' },
        { name: 'Late', value: stats.late, color: '#f59e0b' },
        { name: 'Leave', value: stats.leave, color: '#3b82f6' },
    ].filter(d => d.value > 0);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Present': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Absent': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'Late': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Leave': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        
        // Add Title
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("Student Attendance History", 14, 20);
        
        // Add Metadata Header
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text(`Generated On: ${timestamp}`, 14, 28);
        doc.text(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`, 14, 33);
        
        // Student Details
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text(`Student: ${student?.firstName} ${student?.lastName} (${student?.admissionNo})`, 14, 42);
        doc.text(`Class: ${student?.classId?.name} | Roll No: ${student?.rollNo}`, 14, 48);
        doc.text(`Branch: ${student?.branchId?.name}`, 14, 54);

        // Stats Box
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setFillColor(248, 250, 252); // slate-50
        doc.roundedRect(120, 38, 76, 22, 2, 2, 'FD');
        
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text(`Present: ${stats.present}`, 125, 43);
        doc.text(`Absent: ${stats.absent}`, 125, 48);
        doc.text(`Late: ${stats.late}`, 125, 53);
        doc.text(`Leave: ${stats.leave}`, 155, 43);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${stats.percentage}%`, 155, 52);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Average`, 155, 56);

        // Table
        const tableColumn = ["#", "Date", "Day", "Status", "Subject", "Marked By"];
        const tableRows = history.map((record, index) => [
            index + 1,
            format(new Date(record.date), 'dd MMM, yyyy'),
            format(new Date(record.date), 'EEEE'),
            record.status,
            record.subject || '-',
            record.markedBy || '-'
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 65,
            theme: 'striped',
            headStyles: { 
                fillColor: [15, 23, 42], 
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold'
            },
            bodyStyles: { 
                fontSize: 9,
                textColor: [51, 65, 85]
            },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 3) {
                    const status = data.cell.raw;
                    if (status === 'Present') data.cell.styles.textColor = [5, 150, 105];
                    if (status === 'Absent') data.cell.styles.textColor = [220, 38, 38];
                }
            }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // slate-400
            doc.text(
                `Page ${i} of ${pageCount} - Education CRM`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        doc.save(`Attendance_History_${student?.firstName}_${student?.admissionNo}.pdf`);
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const { student, history } = data || {};

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Poppins']">
                            Attendance History
                        </h1>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                            <User size={14} /> {student?.firstName} {student?.lastName}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <input 
                            type="date" 
                            className="text-xs font-bold text-slate-600 px-3 py-1.5 outline-none bg-transparent"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                        <span className="text-slate-300 mx-1">—</span>
                        <input 
                            type="date" 
                            className="text-xs font-bold text-slate-600 px-3 py-1.5 outline-none bg-transparent"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                    </div>
                    <button 
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold shadow-xl shadow-slate-200 active:scale-95"
                    >
                        <Download size={18} />
                        <span>Export History</span>
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Student Profile & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-purple-600 -z-0"></div>
                        <div className="relative z-10 pt-4">
                            <div className="w-24 h-24 rounded-3xl bg-white p-1 mx-auto shadow-xl border-4 border-white mb-4 overflow-hidden">
                                {student?.photo ? (
                                    <img src={student.photo} alt={student.name} className="w-full h-full object-cover rounded-[20px]" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-3xl bg-slate-50">
                                        {student?.firstName?.[0]}
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{student?.firstName} {student?.lastName}</h2>
                            <p className="text-sm font-bold text-indigo-500 mt-1 uppercase tracking-widest">{student?.admissionNo}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mt-8 text-left">
                                <InfoItem icon={<GraduationCap size={14}/>} label="Class" value={student?.classId?.name} />
                                <InfoItem icon={<Tag size={14}/>} label="Roll No" value={student?.rollNo} />
                                <InfoItem icon={<MapPin size={14}/>} label="Branch" value={student?.branchId?.name} />
                                <InfoItem icon={<User size={14}/>} label="Gender" value={student?.gender} />
                            </div>
                        </div>
                    </div>

                    {/* Stats & Charts */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <PieChartIcon size={18} className="text-indigo-500" />
                            Attendance Summary
                        </h3>
                        
                        <div className="flex flex-col items-center">
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="mt-4 text-center">
                                <div className="text-3xl font-black text-slate-900">{stats.percentage}%</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Attendance</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <MiniStat label="Present" value={stats.present} color="emerald" />
                            <MiniStat label="Absent" value={stats.absent} color="rose" />
                            <MiniStat label="Late" value={stats.late} color="amber" />
                            <MiniStat label="Leave" value={stats.leave} color="blue" />
                        </div>
                    </div>
                </div>

                {/* Right: Detailed History Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <CalendarIcon size={18} className="text-indigo-500" />
                                Record Details
                            </h3>
                            <span className="text-xs font-bold text-slate-500 px-3 py-1 bg-white border rounded-full">
                                {history?.length} Records Found
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-slate-100">
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Subject</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Marked By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history?.length > 0 ? (
                                        history.map((record) => (
                                            <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-slate-700">
                                                        {format(new Date(record.date), 'dd MMM, yyyy')}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(record.date), 'EEEE')}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={twMerge(
                                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border",
                                                        getStatusStyles(record.status)
                                                    )}>
                                                        {record.status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                                    {record.subject}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-slate-700">{record.markedBy}</div>
                                                </td>
                                                
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <AlertCircle size={32} className="text-slate-300" />
                                                    <p className="font-bold text-slate-900">No records found</p>
                                                    <p className="text-sm text-slate-400">Try adjusting the date range.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper Components
const InfoItem = ({ icon, label, value }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            {icon} {label}
        </label>
        <div className="text-sm font-bold text-slate-700 truncate">{value || 'N/A'}</div>
    </div>
);

const MiniStat = ({ label, value, color }) => {
    const colorMap = {
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
    };
    return (
        <div className={twMerge("p-3 rounded-2xl border text-center", colorMap[color])}>
            <div className="text-lg font-black">{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-tight opacity-70">{label}</div>
        </div>
    );
};

export default StudentAttendanceHistory;
