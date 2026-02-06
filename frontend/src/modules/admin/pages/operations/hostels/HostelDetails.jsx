import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Building2, MapPin, Hash, CheckCircle,
    XCircle, AlertTriangle, Edit, Trash2,
    ArrowLeft, Users, Bed, Wifi, ArrowRight,
    FileText, ShieldCheck, Banknote
} from 'lucide-react';
import { useAdminStore } from '../../../../../store/adminStore';
import { useAppStore } from '../../../../../store';

const HostelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchHostelById, updateHostel, deleteHostel } = useAdminStore();
    const user = useAppStore(state => state.user);

    const [hostel, setHostel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('HostelDetails mounted. ID:', id);
        const loadHostel = async () => {
            if (id) {
                setLoading(true);
                console.log('Fetching hostel...');
                const data = await fetchHostelById(id);
                console.log('Fetched hostel data:', data);
                setHostel(data);
                setLoading(false);
            }
        };
        loadHostel();
    }, [id]);

    const handleStatusToggle = async () => {
        if (!hostel) return;
        const newStatus = hostel.status === 'Active' ? 'Inactive' : 'Active';
        if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
            const updated = await updateHostel(hostel._id, { status: newStatus });
            if (updated) setHostel(updated);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this hostel? This action cannot be undone.')) {
            await deleteHostel(hostel._id);
            navigate('/admin/operations/hostels');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!hostel) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Hostel Not Found</h2>
                <button onClick={() => navigate('/admin/operations/hostels')} className="mt-4 text-indigo-600 font-bold hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header / Nav */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/operations/hostels')}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Hostels
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 flex items-center gap-2 transition-colors"
                    >
                        <Trash2 size={18} /> Delete
                    </button>
                    <button
                        onClick={() => navigate(`/admin/operations/hostels/edit/${hostel._id}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-lg"
                    >
                        <Edit size={18} /> Edit Hostel
                    </button>
                </div>
            </div>

            {/* Title Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-xl ${hostel.type === 'Boys' ? 'bg-blue-50 text-blue-600' : hostel.type === 'Girls' ? 'bg-pink-50 text-pink-600' : 'bg-purple-50 text-purple-600'}`}>
                            <Building2 size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-bold text-gray-900">{hostel.name}</h1>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1 ${hostel.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                                    }`}>
                                    {hostel.status === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    {hostel.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                <span className="flex items-center gap-1"><Hash size={14} /> Code: {hostel.code}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} /> Branch: {hostel.branchId?.name || 'Unknown'}</span>
                                <span className="flex items-center gap-1"><Users size={14} /> Type: {hostel.type}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-xs font-bold uppercase text-gray-400">Status Control</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={hostel.status === 'Active'}
                                onChange={handleStatusToggle}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">{hostel.status === 'Active' ? 'Active' : 'Inactive'}</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Buildings & Rooms */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Buildings */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Building2 size={18} className="text-indigo-600" /> Buildings / Blocks
                            </h3>
                            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                Total: {hostel.buildings?.length || 0}
                            </span>
                        </div>
                        <div className="p-4 space-y-4">
                            {hostel.buildings?.map((b, idx) => (
                                <div key={idx} className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
                                    <div className="flex justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{b.name}</h4>
                                            <p className="text-xs text-gray-500 font-bold">Code: {b.code}</p>
                                        </div>
                                        <div className="flex gap-6">
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Floors</p>
                                                <p className="font-bold text-gray-800">{b.totalFloors}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Rooms</p>
                                                <p className="font-bold text-gray-800">{(b.totalFloors || 0) * (b.roomsPerFloor || 0) || '-'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase text-indigo-500">Capacity</p>
                                                <p className="font-bold text-indigo-600">{(b.totalFloors || 0) * (b.roomsPerFloor || 0) * (b.bedsPerRoom || 0) || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm">
                                        <Users size={14} className="text-gray-400" />
                                        <span className="text-gray-500 font-medium">Title Warden:</span>
                                        <span className="font-bold text-gray-800">
                                            {b.wardenId ? (b.wardenId.firstName ? `${b.wardenId.firstName} ${b.wardenId.lastName}` : 'Assigned') : 'Unassigned'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Facilities */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Wifi size={18} className="text-indigo-600" /> Facilities
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(hostel.facilities || {}).map(([key, val]) => {
                                    // Handle both object and legacy boolean
                                    const isEnabled = typeof val === 'object' ? val.enabled : !!val;
                                    const cost = typeof val === 'object' ? val.cost : 0;

                                    return (
                                        <div key={key} className={`flex flex-col gap-1 p-3 rounded-xl border transition-all ${isEnabled ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1 rounded-full ${isEnabled ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-200 text-gray-400'}`}>
                                                    {isEnabled ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                </div>
                                                <span className={`font-bold text-xs uppercase ${isEnabled ? 'text-emerald-800' : 'text-gray-500'}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            </div>
                                            {isEnabled && cost > 0 && (
                                                <div className="pl-6">
                                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">₹{cost}/mo</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column - Stats & Docs */}
                <div className="space-y-6">

                    {/* Quick Stats */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800">Quick Stats</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Bed size={20} /></div>
                                    <span className="font-bold text-gray-700">Total Capacity</span>
                                </div>
                                <span className="text-xl font-bold text-indigo-700">
                                    {hostel.rooms?.reduce((acc, r) => acc + r.capacity, 0) || '0'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-200 p-2 rounded-lg text-purple-700"><Hash size={20} /></div>
                                    <span className="font-bold text-gray-700">Total Rooms</span>
                                </div>
                                <span className="text-xl font-bold text-purple-700">
                                    {hostel.rooms?.length || 0}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Fee Structure */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Banknote size={18} className="text-indigo-600" /> Fee Structure
                            </h3>
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">
                                {hostel.feeConfig?.collectionFrequency || 'Term'} Basis
                            </span>
                        </div>
                        <div className="p-4 space-y-3">
                            {hostel.feeConfig?.mode === 'Room Type' || hostel.feeConfig?.singleRoomFee > 0 ? (
                                <>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Bed size={14} /> Single Room
                                        </div>
                                        <span className="font-bold text-gray-900 font-mono">₹{hostel.feeConfig?.singleRoomFee || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <Users size={14} /> Double Room
                                        </div>
                                        <span className="font-bold text-gray-900 font-mono">₹{hostel.feeConfig?.doubleRoomFee || 0}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="text-sm text-gray-600 font-medium">Flat Rate / Course Fee</div>
                                    <span className="font-bold text-gray-900 font-mono">₹{hostel.feeConfig?.courseFee || 0}</span>
                                </div>
                            )}
                            <p className="text-[10px] text-center text-gray-400 font-medium italic">* This is the mandatory base accommodation fee.</p>
                        </div>
                    </section>

                    {/* Documents */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FileText size={18} className="text-indigo-600" /> Documents
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* PDF */}
                            {hostel.documents?.rulesPdf ? (
                                <a
                                    href={hostel.documents.rulesPdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors group"
                                >
                                    <div className="bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-200 transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">Rules & Regulation.pdf</p>
                                        <p className="text-xs text-gray-500">Click to view</p>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                                </a>
                            ) : (
                                <div className="text-center p-4 text-gray-400 text-sm italic">No PDF Uploaded</div>
                            )}

                            {/* Photos */}
                            {hostel.documents?.photos?.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    {hostel.documents.photos.map((url, i) => (
                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity">
                                            <img src={url} alt={`Hostel ${i}`} className="w-full h-full object-cover" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Safety Rules */}
                    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <ShieldCheck size={18} className="text-indigo-600" /> Safety Rules
                            </h3>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                                <span className="text-gray-500">Guardian Mandatory</span>
                                <span className={`font-bold ${hostel.safetyRules?.guardianMandatory ? 'text-emerald-600' : 'text-gray-400'}`}>{hostel.safetyRules?.guardianMandatory ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                                <span className="text-gray-500">Medical Records</span>
                                <span className={`font-bold ${hostel.safetyRules?.medicalRequired ? 'text-emerald-600' : 'text-gray-400'}`}>{hostel.safetyRules?.medicalRequired ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="pt-2">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Emergency Contact</p>
                                <p className="text-sm font-mono bg-gray-100 p-2 rounded text-gray-800">{hostel.safetyRules?.emergencyContact || 'N/A'}</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default HostelDetails;
