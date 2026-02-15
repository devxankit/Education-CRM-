import React, { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import CustomReportTable from './components/CustomReportTable';
import CreateReportWizard from './components/CreateReportWizard';

const CustomReports = () => {

    // View State: 'list' | 'builder'
    const [view, setView] = useState('list');

    // Mock Data
    const [reports, setReports] = useState([
        { id: 1, name: 'Fee Defaulters - Q1 2025', description: 'Students with > 5000 dues in Q1', source: 'fees', author: 'Admin', visibility: 'private', status: 'Active', updatedAt: '2 hours ago' },
        { id: 2, name: 'Low Attendance Staff', description: 'Employees with < 80% attendance', source: 'attendance', author: 'HR Manager', visibility: 'role', status: 'Draft', updatedAt: '1 day ago' },
        { id: 3, name: 'Class 10 Toppers', description: 'Students with > 90% marks in Math', source: 'exams', author: 'Principal', visibility: 'role', status: 'Active', updatedAt: '3 days ago' },
    ]);

    // Handlers
    const handleSaveReport = (newConfig) => {
        const newReport = {
            id: Date.now(),
            name: newConfig.settings.name,
            description: newConfig.settings.description,
            source: newConfig.source,
            author: 'You',
            visibility: newConfig.settings.visibility,
            status: 'Active',
            updatedAt: 'Just now'
        };
        setReports([newReport, ...reports]);
        setView('list');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to archive this report?')) {
            setReports(reports.map(r => r.id === id ? { ...r, status: 'Archived' } : r));
        }
    };

    // Render Builder Mode
    if (view === 'builder') {
        return (
            <CreateReportWizard
                onCancel={() => setView('list')}
                onSave={handleSaveReport}
            />
        );
    }

    // Render List Mode
    return (
        <div className="flex flex-col min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 shadow-sm z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Custom Reports</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        Self-Service Analytics • Build your own insights
                        <Info size={14} className="text-gray-400" />
                    </p>
                </div>
                <button
                    onClick={() => setView('builder')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95 font-medium"
                >
                    <Plus size={18} /> Create Custom Report
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Intro Banner */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md">
                        <h2 className="text-xl font-bold">Welcome to Custom Analytics</h2>
                        <p className="opacity-90 mt-1 max-w-2xl">
                            Unlock the power of your data. Build tailored reports across Students, Finance, HR, and Operations without waiting for IT.
                            All data is read-only and secured based on your role.
                        </p>
                    </div>

                    {/* Report List */}
                    <CustomReportTable
                        reports={reports}
                        onView={(row) => alert(`View Report: ${row.name}`)}
                        onEdit={(row) => alert(`Edit Draft: ${row.name}`)}
                        onDelete={handleDelete}
                    />

                </div>
            </div>

        </div>
    );
};

export default CustomReports;
