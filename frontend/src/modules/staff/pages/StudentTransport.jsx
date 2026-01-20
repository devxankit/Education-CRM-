import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Bus, MapPin, Save, UserPlus, Filter, Phone, ChevronRight } from 'lucide-react';

const StudentTransport = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('list'); // 'list' | 'assign'

    // For Wizard
    const [step, setStep] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- MOCK DATA ---
    const TRANSPORT_STUDENTS = [
        { id: 'S001', name: 'Aarav Patel', class: '10-A', route: 'Rt-1: City Center', stop: 'Sector 15 Market', contact: '9876543210' },
        { id: 'S002', name: 'Zara Khan', class: '8-B', route: 'Rt-3: West End', stop: 'City Center Metro', contact: '9876543211' },
        { id: 'S003', name: 'Ishaan Gupta', class: '5-C', route: 'Rt-1: City Center', stop: 'Golf Course Road', contact: '9876543212' },
        { id: 'S004', name: 'Riya Singh', class: '12-A', route: 'Rt-2: North Camp', stop: 'Palm Avenue', contact: '9876543213' },
    ];

    const MockStudentsToAssign = [
        { id: 'S-NEW-01', name: 'Rohan Sharma', class: '9-A', address: 'Sector 15, City' },
        { id: 'S-NEW-02', name: 'Ananya Gupta', class: '3-B', address: 'Palm Avenue' },
    ];

    const MockRoutes = [
        { id: 'RT-001', name: 'Route 1', areas: 'City Center, Sector 15', available: 2 },
        { id: 'RT-002', name: 'Route 2', areas: 'North Campus, Palm Ave', available: 20 },
    ];

    const handleAssign = () => {
        // API Call here
        alert("Student Assigned Successfully!");
        setView('list');
        setStep(1);
        setSelectedStudent(null);
        setSelectedRoute(null);
    };

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => view === 'assign' ? setView('list') : navigate('/staff/transport')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{view === 'list' ? 'Transport Students' : 'Assign Transport'}</h1>
                            <p className="text-xs text-gray-500">
                                {view === 'list' ? 'Manage student bus allocations' : 'New student route assignment'}
                            </p>
                        </div>
                    </div>
                    {view === 'list' && (
                        <button
                            onClick={() => setView('assign')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-sm transition-all"
                        >
                            <UserPlus size={16} /> <span className="hidden md:inline">Assign New</span>
                        </button>
                    )}
                </div>

                {view === 'list' && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search student, route or bus..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                )}
            </div>

            <div className="p-4 md:p-6">

                {/* VIEW: LIST */}
                {view === 'list' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-5 py-3">Student</th>
                                        <th className="px-5 py-3">Route Info</th>
                                        <th className="px-5 py-3">Pickup Point</th>
                                        <th className="px-5 py-3">Contact</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {TRANSPORT_STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(student => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3">
                                                <p className="text-sm font-bold text-gray-900">{student.name}</p>
                                                <p className="text-xs text-gray-500">Class {student.class}</p>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Bus size={14} className="text-indigo-500" />
                                                    <span className="text-sm font-medium text-gray-800">{student.route}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    <span className="text-sm text-gray-600">{student.stop}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-green-500" />
                                                    <span className="text-sm font-medium text-gray-800">{student.contact}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* VIEW: ASSIGN WIZARD */}
                {view === 'assign' && (
                    <div className="max-w-xl mx-auto space-y-4">
                        {/* Progress */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                        </div>

                        {step === 1 && (
                            <div className="animate-fade-in space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search student to assign..."
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                    />
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-50">
                                    {MockStudentsToAssign.map(s => (
                                        <div
                                            key={s.id}
                                            onClick={() => setSelectedStudent(s)}
                                            className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${selectedStudent?.id === s.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                                        >
                                            <div>
                                                <p className="font-bold text-gray-900">{s.name}</p>
                                                <p className="text-xs text-gray-500">{s.class} • {s.address}</p>
                                            </div>
                                            {selectedStudent?.id === s.id && <CheckCircle size={20} className="text-indigo-600" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in space-y-4">
                                <div className="bg-indigo-50 p-3 rounded-lg flex items-center gap-3 border border-indigo-100">
                                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                                        {selectedStudent?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-indigo-800 uppercase">Assigning For</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedStudent?.name}</p>
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-gray-900 mt-2">Select Route</h3>
                                <div className="space-y-3">
                                    {MockRoutes.map(r => (
                                        <div
                                            key={r.id}
                                            onClick={() => setSelectedRoute(r)}
                                            className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${selectedRoute?.id === r.id ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Bus size={18} className="text-gray-400" />
                                                    <span className="font-bold text-gray-900">{r.name}</span>
                                                </div>
                                                <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded">{r.available} Seats Left</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-xs text-gray-500">
                                                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                                {r.areas}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:static md:border-0 md:bg-transparent">
                            {step === 1 ? (
                                <button
                                    disabled={!selectedStudent}
                                    onClick={() => setStep(2)}
                                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                                >
                                    Next: Select Route
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200"
                                    >
                                        Back
                                    </button>
                                    <button
                                        disabled={!selectedRoute}
                                        onClick={handleAssign}
                                        className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 shadow-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} /> Confirm Assignment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentTransport;
