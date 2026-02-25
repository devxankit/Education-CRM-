import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Bus, MapPin, Save, UserPlus, Filter, Phone, ChevronRight } from 'lucide-react';
import { fetchTransportStudents } from '../services/transport.api';

const StudentTransport = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('list'); // 'list' | 'assign'

    // For Wizard
    const [step, setStep] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [transportStudents, setTransportStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await fetchTransportStudents();
            setTransportStudents(data || []);
            setLoading(false);
        };
        load();
    }, []);

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
                    <div className="space-y-4">
                        {loading ? (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-10 text-center text-gray-400 text-sm">
                                Loading transport students...
                            </div>
                        ) : transportStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                            <div className="bg-white rounded-xl border border-dashed border-gray-200 py-10 text-center text-gray-400 text-sm">
                                No students have opted for transport.
                            </div>
                        ) : (
                            transportStudents
                                .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(student => (
                                    <div
                                        key={student.id}
                                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{student.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    Class {student.class}{student.section ? ` • ${student.section}` : ''}
                                                </p>
                                                {student.address && (
                                                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                                                        {student.address}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 md:max-w-lg">
                                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Route</p>
                                                <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                                                    <Bus size={12} className="text-indigo-500" />
                                                    {student.routeId || 'Not assigned'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Pickup Point</p>
                                                <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                                                    <MapPin size={12} className="text-gray-400" />
                                                    {student.stopId || 'Not assigned'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Contact</p>
                                                <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                                                    <Phone size={12} className="text-green-500" />
                                                    {student.contact || '-'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="self-end md:self-center">
                                            <button className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-300">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                        )}
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
