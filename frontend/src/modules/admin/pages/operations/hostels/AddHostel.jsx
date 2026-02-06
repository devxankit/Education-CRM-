import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Building2, MapPin, Hash, ShieldCheck, Banknote,
    Wifi, CheckCircle, Save, X, BedDouble, AlertCircle,
    Upload, FileText, Image as ImageIcon
} from 'lucide-react';
import { useAdminStore } from '../../../../../store/adminStore';
import { useAppStore } from '../../../../../store';

const AddHostel = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID for edit mode
    const user = useAppStore(state => state.user);
    const {
        branches, fetchBranches,
        fetchHostelConfig,
        createHostel,
        updateHostel, // <--- Added
        fetchHostelById, // <--- Added
        teachers, fetchTeachers,
        uploadFile
    } = useAdminStore();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [config, setConfig] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(user?.branchId === 'all' ? '' : user?.branchId);
    const [activeFeeType, setActiveFeeType] = useState('Single'); // Local toggle for fee inputs

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: '', // Boys, Girls, Staff
        code: `H-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Active',
        // Building Config (Array of buildings)
        buildings: [{ name: '', code: 'BLK-A', totalFloors: 1, roomsPerFloor: 5, bedsPerRoom: 2, wardenId: '' }],
        // Room Management
        roomConfig: {
            prefix: 'R',
            startNumber: 101,
            count: 20,
            defaultType: 'Double',
            defaultStatus: 'Available'
        },
        // Fee Mapping
        feeConfig: {
            feeHeadId: '',
            mode: 'Room Type', // 'Room Type' or 'Flat'
            courseFee: 0,
            singleRoomFee: 0,
            doubleRoomFee: 0,
            tripleRoomFee: 0,
            dormRoomFee: 0,
            collectionFrequency: 'Term'
        },
        // Facilities
        facilities: {
            mess: { enabled: false, cost: 0 },
            wifi: { enabled: false, cost: 0 },
            laundry: { enabled: false, cost: 0 },
            powerBackup: { enabled: false, cost: 0 },
            security: { enabled: false, cost: 0 }
        },
        // Documents
        documents: {
            photos: [],
            rulesPdf: null,
            inspectionCert: null
        },
        safetyRules: {
            emergencyContact: ''
        }
    });

    // Validations based on Config
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchBranches();
        fetchTeachers();
        if (user?.branchId !== 'all') {
            fetchConfig(user.branchId);
        }
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            fetchConfig(selectedBranch);
            setFormData(prev => ({ ...prev, branchId: selectedBranch }));
        }
    }, [selectedBranch]);

    // Update state when user loads
    useEffect(() => {
        if (user?.branchId) {
            if (user.branchId !== 'all') {
                setSelectedBranch(user.branchId);
            }
        }
    }, [user]);

    // Load Hostel Data for Edit
    useEffect(() => {
        const loadHostelData = async () => {
            if (id) {
                setLoading(true);
                const hostel = await fetchHostelById(id);
                if (hostel) {
                    setSelectedBranch(hostel.branchId._id || hostel.branchId);
                    setFormData({
                        name: hostel.name,
                        type: hostel.type,
                        code: hostel.code,
                        status: hostel.status,
                        branchId: hostel.branchId._id || hostel.branchId,
                        buildings: hostel.buildings.map(b => ({
                            ...b,
                            totalFloors: b.totalFloors || 1,
                            roomsPerFloor: b.roomsPerFloor || 5,
                            bedsPerRoom: b.bedsPerRoom || 2,
                            wardenId: b.wardenId?._id || b.wardenId || ''
                        })),
                        roomConfig: hostel.roomConfig || {
                            prefix: 'R',
                            startNumber: 101,
                            count: 20,
                            defaultType: 'Double',
                            defaultStatus: 'Available'
                        },
                        feeConfig: {
                            mode: hostel.feeConfig?.mode || (hostel.feeConfig?.singleRoomFee > 0 ? 'Room Type' : 'Flat'),
                            feeHeadId: hostel.feeConfig?.feeHeadId || '',
                            courseFee: hostel.feeConfig?.courseFee || hostel.feeConfig?.amount || 0,
                            singleRoomFee: hostel.feeConfig?.singleRoomFee || 0,
                            doubleRoomFee: hostel.feeConfig?.doubleRoomFee || 0,
                            tripleRoomFee: hostel.feeConfig?.tripleRoomFee || 0,
                            dormRoomFee: hostel.feeConfig?.dormRoomFee || 0,
                            collectionFrequency: hostel.feeConfig?.collectionFrequency || 'Term'
                        },
                        facilities: (() => {
                            const f = hostel.facilities || {};
                            const keys = ['mess', 'wifi', 'laundry', 'powerBackup', 'security'];
                            const out = {};
                            keys.forEach(k => {
                                if (f[k] && typeof f[k] === 'object') {
                                    out[k] = { enabled: f[k].enabled || false, cost: f[k].cost || 0 };
                                } else {
                                    out[k] = { enabled: !!f[k], cost: 0 };
                                }
                            });
                            return out;
                        })(),
                        documents: hostel.documents || {
                            photos: [], rulesPdf: null, inspectionCert: null
                        },
                        safetyRules: hostel.safetyRules || {
                            emergencyContact: ''
                        }
                    });

                    // Set active fee type based on existing values
                    if (hostel.feeConfig?.doubleRoomFee > 0 && (hostel.feeConfig?.singleRoomFee || 0) === 0) {
                        setActiveFeeType('Double');
                    }
                }
                setLoading(false);
            }
        };
        loadHostelData();
    }, [id]);

    const fetchConfig = async (branchId) => {
        setLoading(true);
        const data = await fetchHostelConfig(branchId);
        setConfig(data);

        if (data?.roomRules?.roomTypes) {
            const types = data.roomRules.roomTypes;
            if (!types.single && activeFeeType === 'Single') {
                if (types.double) setActiveFeeType('Double');
                else if (types.triple) setActiveFeeType('Triple');
                else if (types.dorm) setActiveFeeType('Dorm');
            }
        }

        if (data?.feeLink && !id) {
            setFormData(prev => ({
                ...prev,
                feeConfig: {
                    ...prev.feeConfig,
                    mode: data.feeLink.feeBasis === 'room_type' ? 'Room Type' : 'Flat',
                    collectionFrequency: data.feeLink.collectionFrequency || 'Term'
                }
            }));
        }
        setLoading(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleBuildingChange = (index, field, value) => {
        const newBuildings = [...formData.buildings];
        newBuildings[index] = { ...newBuildings[index], [field]: value };
        setFormData(prev => ({ ...prev, buildings: newBuildings }));
    };

    const addBuilding = () => {
        if (config?.availability?.maxHostels && formData.buildings.length >= config.availability.maxHostels) {
            alert(`Maximum ${config.availability.maxHostels} buildings allowed by policy.`);
            return;
        }
        const nextCode = `BLK-${String.fromCharCode(65 + formData.buildings.length)}`; // A, B, C...
        setFormData(prev => ({
            ...prev,
            buildings: [...prev.buildings, { name: '', code: nextCode, totalFloors: 1, roomsPerFloor: 5, bedsPerRoom: 2, wardenId: '' }]
        }));
    };

    const removeBuilding = (index) => {
        if (formData.buildings.length === 1) return;
        setFormData(prev => ({
            ...prev,
            buildings: prev.buildings.filter((_, i) => i !== index)
        }));
    };

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            setUploading(true);
            const uploadPromises = files.map(file => uploadFile(file, 'hostels/photos'));
            const urls = await Promise.all(uploadPromises);

            setFormData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    photos: [...prev.documents.photos, ...urls]
                }
            }));
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const url = await uploadFile(file, 'hostels/docs');
            setFormData(prev => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    rulesPdf: url
                }
            }));
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!config?.availability?.isEnabled) {
            alert("Hostel facility is disabled in settings for this branch.");
            return;
        }

        // --- Validations ---
        if (!formData.name || !formData.type) {
            alert("Please fill mandatory Hostel Name and Type.");
            return;
        }

        // Warden validation if required in config
        if (config?.safetyRules?.wardenAssignment) {
            const missingWarden = formData.buildings.find(b => !b.wardenId);
            if (missingWarden) {
                alert(`Building "${missingWarden.name || missingWarden.code}" must have a Warden assigned as per campus safety rules.`);
                return;
            }
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                branchId: selectedBranch,
                feeConfig: {
                    ...formData.feeConfig,
                    mode: config.feeLink?.feeBasis === 'room_type' ? 'Room Type' : 'Flat'
                }
            };

            if (id) {
                await updateHostel(id, payload);
            } else {
                await createHostel(payload);
            }
            navigate('/admin/operations/hostels');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !config && !id) { // Only show loading config if not editing (or if editing and config not loaded yet? Edit mode fetches config via branch change effect)
        // Improved condition:
        return <div className="p-8 text-center text-gray-500">Loading Configuration...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">{id ? 'Edit Hostel' : 'Add New Hostel'}</h1>
                    <p className="text-sm text-gray-500">{id ? 'Update hostel details and configuration.' : 'Create a residential block according to campus policy.'}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => navigate(-1)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading || !config} className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 font-bold flex items-center gap-2">
                        <Save size={18} /> {loading ? 'Saving...' : (id ? 'Update Hostel' : 'Save Hostel')}
                    </button>
                </div>
            </div>

            {!config ? (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex items-start gap-4 text-amber-800">
                    <AlertCircle className="shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold">Configuration Missing</h3>
                        <p className="text-sm mt-1">Please select a branch and ensure "Hostel & Housing Setup" is configured before creating a hostel.</p>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="mt-4 p-2 bg-white border border-amber-300 rounded-lg outline-none font-bold text-sm"
                        >
                            <option value="">Select Branch</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* 1. Basic Details */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-4s">
                            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Building2 size={18} /></span> Basic Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Branch</label>
                                {(user?.branchId === 'all' || !user?.branchId || branches.length > 0) ? (
                                    <select
                                        value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                        className="w-full border border-gray-300 focus:border-indigo-500 rounded-lg px-3 py-2 outline-none text-sm font-bold bg-white"
                                        disabled={!!id || (branches.length === 1 && branches[0]._id === selectedBranch)}
                                    >
                                        <option value="">Select Branch</option>
                                        {branches.map(b => (
                                            <option key={b._id} value={b._id}>{b.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        value={branches.find(b => b._id === selectedBranch)?.name || ''}
                                        disabled
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-600"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hostel Name <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="e.g. Boys Hostel A"
                                    className="w-full border border-gray-300 focus:border-indigo-500 rounded-lg px-3 py-2 outline-none text-sm font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hostel Type <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    className="w-full border border-gray-300 focus:border-indigo-500 rounded-lg px-3 py-2 outline-none text-sm font-bold bg-white"
                                >
                                    <option value="">Select Type</option>
                                    {(config.availability?.separateBlocks?.boys || config.availability?.separateBlocks === undefined) && <option value="Boys">Boys Hostel</option>}
                                    {(config.availability?.separateBlocks?.girls || config.availability?.separateBlocks === undefined) && <option value="Girls">Girls Hostel</option>}
                                    {(config.availability?.separateBlocks?.staff || config.availability?.separateBlocks === undefined) && <option value="Staff">Staff Quarters</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hostel Code/ID <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    value={formData.code}
                                    onChange={(e) => handleChange('code', e.target.value)}
                                    placeholder="e.g. H-01"
                                    className="w-full border border-gray-300 focus:border-indigo-500 rounded-lg px-3 py-2 outline-none text-sm font-mono bg-gray-50 text-gray-600 cursor-not-allowed"
                                    readOnly
                                    title="Auto-generated"
                                />
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <span className="text-sm font-bold text-gray-700">Status</span>
                                <button
                                    type="button"
                                    onClick={() => handleChange('status', formData.status === 'Active' ? 'Inactive' : 'Active')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.status === 'Active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-xs font-bold text-gray-500">{formData.status}</span>
                            </div>
                        </div>
                    </section>

                    {/* 2. Building Configuration */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                <span className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><Hash size={18} /></span> Building Configuration
                            </h2>
                            <button
                                type="button"
                                onClick={addBuilding}
                                className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100"
                            >
                                + Add Building Block
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.buildings.map((building, idx) => (
                                <div key={idx} className="grid grid-cols-2 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                                    {formData.buildings.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBuilding(idx)}
                                            className="absolute -top-2 -right-2 p-1 bg-white shadow-sm border border-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all z-10"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                    <div className="col-span-2 lg:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                            <Building2 size={10} /> Name
                                        </label>
                                        <input
                                            value={building.name}
                                            onChange={(e) => handleBuildingChange(idx, 'name', e.target.value)}
                                            placeholder="Block A"
                                            className="w-full p-2 rounded-lg border border-gray-300 text-sm font-bold outline-none focus:border-orange-500"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Code</label>
                                        <input
                                            value={building.code}
                                            readOnly
                                            className="w-full p-2 rounded-lg border border-gray-200 text-sm font-mono bg-gray-100 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Floors</label>
                                        <input
                                            type="number"
                                            value={building.totalFloors}
                                            onChange={(e) => handleBuildingChange(idx, 'totalFloors', parseInt(e.target.value) || 0)}
                                            className="w-full p-2 rounded-lg border border-gray-300 text-sm font-bold outline-none focus:border-orange-500"
                                            min="1"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Rooms/Floor</label>
                                        <input
                                            type="number"
                                            value={building.roomsPerFloor}
                                            onChange={(e) => handleBuildingChange(idx, 'roomsPerFloor', parseInt(e.target.value) || 0)}
                                            className="w-full p-2 rounded-lg border border-gray-300 text-sm font-bold outline-none focus:border-orange-500"
                                            min="1"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 text-blue-600">Room Type</label>
                                        <select
                                            value={building.bedsPerRoom <= 1 ? 'Single' : building.bedsPerRoom === 2 ? 'Double' : building.bedsPerRoom === 3 ? 'Triple' : 'Dorm'}
                                            onChange={(e) => {
                                                const type = e.target.value;
                                                const map = { 'Single': 1, 'Double': 2, 'Triple': 3, 'Dorm': config?.roomRules?.maxBedsPerRoom || 4 };
                                                handleBuildingChange(idx, 'bedsPerRoom', map[type]);
                                            }}
                                            className="w-full p-2 rounded-lg border border-blue-200 bg-blue-50 text-sm font-bold outline-none focus:border-blue-500"
                                        >
                                            {(config.roomRules?.roomTypes?.single || config.roomRules?.roomTypes === undefined) && <option value="Single">Single Room</option>}
                                            {(config.roomRules?.roomTypes?.double || config.roomRules?.roomTypes === undefined) && <option value="Double">Double Room</option>}
                                            {(config.roomRules?.roomTypes?.triple) && <option value="Triple">Triple Room</option>}
                                            {(config.roomRules?.roomTypes?.dorm) && <option value="Dorm">Dormitory</option>}
                                        </select>
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Warden</label>
                                        <select
                                            value={building.wardenId}
                                            onChange={(e) => handleBuildingChange(idx, 'wardenId', e.target.value)}
                                            className="w-full p-2 rounded-lg border border-gray-300 text-sm font-bold outline-none focus:border-orange-500 bg-white"
                                        >
                                            <option value="">Select Staff</option>
                                            {teachers.map(t => (
                                                <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Calculated Capacity Helper */}
                                    <div className="col-span-2 lg:col-span-6 mt-1 flex items-center justify-end gap-2 px-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Block Capacity:</span>
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                            {(building.totalFloors || 0) * (building.roomsPerFloor || 0) * (building.bedsPerRoom || 0)} Beds
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-300 mx-1">|</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Total Rooms:</span>
                                        <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">
                                            {(building.totalFloors || 0) * (building.roomsPerFloor || 0)} Rooms
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. Fee & Safety (Read Only / Config Snapshot) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Fee Mapping */}
                        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Banknote size={18} /></span> Fee Mapping
                            </h2>
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between mb-4 mt-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Pricing Basis</span>
                                    <div className="flex gap-2 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, feeConfig: { ...prev.feeConfig, mode: 'Flat' } }))}
                                            className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${formData.feeConfig.mode === 'Flat' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-200'}`}
                                        >
                                            Flat Rate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, feeConfig: { ...prev.feeConfig, mode: 'Room Type' } }))}
                                            className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${formData.feeConfig.mode === 'Room Type' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-200'}`}
                                        >
                                            Room Type
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Frequency</span>
                                    <span className="block font-black text-xs text-emerald-800 uppercase">{formData.feeConfig.collectionFrequency}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {formData.feeConfig.mode === 'Room Type' ? (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Room Type</label>
                                                <select
                                                    value={activeFeeType}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setActiveFeeType(val);
                                                        // Fallback logic for setting fee to 0 if not set
                                                        const fieldMap = { 'Single': 'singleRoomFee', 'Double': 'doubleRoomFee', 'Triple': 'tripleRoomFee', 'Dorm': 'dormRoomFee' };
                                                        const targetField = fieldMap[val] || 'courseFee';
                                                        if (!formData.feeConfig[targetField]) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                feeConfig: { ...prev.feeConfig, [targetField]: 0 }
                                                            }));
                                                        }
                                                    }}
                                                    className="w-full p-2 rounded-lg border border-gray-300 text-sm font-bold outline-none focus:border-emerald-500 bg-white"
                                                >
                                                    {(config.roomRules?.roomTypes?.single || config.roomRules?.roomTypes === undefined) && <option value="Single">Single Room</option>}
                                                    {(config.roomRules?.roomTypes?.double || config.roomRules?.roomTypes === undefined) && <option value="Double">Double Room</option>}
                                                    {(config.roomRules?.roomTypes?.triple) && <option value="Triple">Triple Room</option>}
                                                    {(config.roomRules?.roomTypes?.dorm) && <option value="Dorm">Dormitory</option>}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{activeFeeType} Room Fee (₹)</label>
                                                <input
                                                    type="number"
                                                    value={(() => {
                                                        const fieldMap = { 'Single': 'singleRoomFee', 'Double': 'doubleRoomFee', 'Triple': 'tripleRoomFee', 'Dorm': 'dormRoomFee' };
                                                        return formData.feeConfig[fieldMap[activeFeeType]] || 0;
                                                    })()}
                                                    onChange={(e) => {
                                                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                                                        const fieldMap = { 'Single': 'singleRoomFee', 'Double': 'doubleRoomFee', 'Triple': 'tripleRoomFee', 'Dorm': 'dormRoomFee' };
                                                        const targetField = fieldMap[activeFeeType] || 'courseFee';
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            feeConfig: {
                                                                ...prev.feeConfig,
                                                                [targetField]: val
                                                            }
                                                        }));
                                                    }}
                                                    className="w-full p-2.5 rounded-lg border border-gray-300 text-sm font-bold outline-none focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Flat Rate / Course Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.feeConfig.courseFee}
                                            onChange={(e) => setFormData(prev => ({ ...prev, feeConfig: { ...prev.feeConfig, courseFee: parseFloat(e.target.value) || 0 } }))}
                                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm font-bold outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                )}

                                {/* Total Calculation Summary Box */}
                                <div className="mt-6 p-4 bg-gray-900 rounded-xl text-white shadow-xl space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Total Fee</span>
                                        <span className="text-[10px] font-bold bg-indigo-600 px-2 py-0.5 rounded-full uppercase">Per {config.feeLink?.collectionFrequency || 'Term'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Base Rent (Avg):</span>
                                        <span className="font-bold">₹{formData.feeConfig.mode === 'Room Type' ? (formData.feeConfig[({ 'Single': 'singleRoomFee', 'Double': 'doubleRoomFee', 'Triple': 'tripleRoomFee', 'Dorm': 'dormRoomFee' }[activeFeeType])] || 0) : (formData.feeConfig.courseFee)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Add-on Facilities:</span>
                                        <span className="font-bold text-emerald-400">+₹{Object.values(formData.facilities).reduce((sum, f) => sum + (f.enabled ? f.cost : 0), 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg pt-2 border-t border-indigo-500/30 text-indigo-300">
                                        <span className="font-black uppercase text-xs self-center">Grand Total:</span>
                                        <span className="font-black">₹{(() => {
                                            const fieldMap = { 'Single': 'singleRoomFee', 'Double': 'doubleRoomFee', 'Triple': 'tripleRoomFee', 'Dorm': 'dormRoomFee' };
                                            const base = formData.feeConfig.mode === 'Room Type'
                                                ? (formData.feeConfig[fieldMap[activeFeeType]] || 0)
                                                : (formData.feeConfig.courseFee || 0);
                                            const facilities = Object.values(formData.facilities).reduce((sum, f) => sum + (f.enabled ? f.cost : 0), 0);
                                            return base + facilities;
                                        })()}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Safety Rules */}
                        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><ShieldCheck size={18} /></span> Safety & Compliance
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    {config.safetyRules.mandatoryGuardian ? <CheckCircle className="text-emerald-500" size={18} /> : <X className="text-gray-300" size={18} />}
                                    <span className={`text-sm font-bold ${config.safetyRules.mandatoryGuardian ? 'text-gray-800' : 'text-gray-400'}`}>Local Guardian Mandatory</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    {config.safetyRules.medicalInfo ? <CheckCircle className="text-emerald-500" size={18} /> : <X className="text-gray-300" size={18} />}
                                    <span className={`text-sm font-bold ${config.safetyRules.medicalInfo ? 'text-gray-800' : 'text-gray-400'}`}>Medical Record Required</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    {config.safetyRules.wardenAssignment ? <CheckCircle className="text-emerald-500" size={18} /> : <X className="text-gray-300" size={18} />}
                                    <span className={`text-sm font-bold ${config.safetyRules.wardenAssignment ? 'text-gray-800' : 'text-gray-400'}`}>Warden Approval Required</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hostel Emergency Contact</label>
                                <input
                                    className="w-full p-2.5 rounded-lg border border-gray-300 text-sm font-bold outline-none focus:border-rose-500"
                                    placeholder="+91 XXXXX XXXXX"
                                    onChange={(e) => setFormData(prev => ({ ...prev, safetyRules: { ...prev.safetyRules, emergencyContact: e.target.value } }))}
                                    value={formData.safetyRules.emergencyContact || ''}
                                />
                            </div>
                        </section>
                    </div>

                    {/* 4. Facilities */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Wifi size={18} /></span> Facilities Available
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {Object.keys(formData.facilities).map(key => (
                                <div key={key} className={`p-3 rounded-xl border transition-all flex flex-col gap-3 ${formData.facilities[key].enabled ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-100'}`}>
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <div className={`w-5 h-5 min-w-[1.25rem] rounded flex items-center justify-center border ${formData.facilities[key].enabled ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                                            {formData.facilities[key].enabled && <CheckCircle size={12} className="text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.facilities[key].enabled}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    facilities: {
                                                        ...prev.facilities,
                                                        [key]: { ...prev.facilities[key], enabled: checked }
                                                    }
                                                }));
                                            }}
                                            className="hidden"
                                        />
                                        <span className={`font-bold uppercase text-xs truncate ${formData.facilities[key].enabled ? 'text-blue-700' : 'text-gray-500'}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </label>

                                    {formData.facilities[key].enabled && (
                                        <div className="w-full animate-in fade-in slide-in-from-top-1 duration-200">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Fee (₹)</label>
                                            <input
                                                type="number"
                                                value={formData.facilities[key].cost}
                                                onChange={(e) => {
                                                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        facilities: {
                                                            ...prev.facilities,
                                                            [key]: { ...prev.facilities[key], cost: val }
                                                        }
                                                    }));
                                                }}
                                                className="w-full p-1.5 text-sm font-bold border border-blue-200 rounded-lg focus:border-blue-500 outline-none bg-white"
                                                placeholder="0"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5. Documents */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><FileText size={18} /></span> Documents & Media
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Photo Upload Container */}
                            <div className={`border-2 border-dashed border-gray-300 rounded-2xl p-4 min-h-[200px] flex flex-col transition-all ${uploading ? 'bg-gray-50' : 'hover:border-purple-400 hover:bg-purple-50'}`}>
                                {formData.documents.photos.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3 w-full">
                                        {formData.documents.photos.map((url, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-white shadow-sm">
                                                <img src={url} alt="Hostel" className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, documents: { ...prev.documents, photos: prev.documents.photos.filter((_, i) => i !== idx) } }))}
                                                    className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {/* Add More Button */}
                                        <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-white text-gray-400 hover:text-purple-600 transition-all">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePhotoUpload}
                                                disabled={uploading}
                                            />
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-purple-600" />
                                            ) : (
                                                <>
                                                    <ImageIcon size={20} />
                                                    <span className="text-[10px] font-bold mt-1">Add</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                ) : (
                                    <label className="flex-1 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-purple-600">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                            disabled={uploading}
                                        />
                                        <div className={`p-4 rounded-full bg-gray-50 mb-3 ${uploading ? 'animate-pulse' : ''}`}>
                                            <ImageIcon size={32} />
                                        </div>
                                        <span className="text-sm font-bold">{uploading ? 'Uploading...' : 'Upload Hostel Photos'}</span>
                                        <span className="text-xs mt-1 text-gray-400">(PNG, JPG up to 5MB)</span>
                                    </label>
                                )}
                            </div>

                            {/* PDF Upload Container */}
                            <div className={`border-2 border-dashed border-gray-300 rounded-2xl p-4 min-h-[200px] flex flex-col items-center justify-center transition-all ${uploading ? 'bg-gray-50' : 'hover:border-purple-400 hover:bg-purple-50'}`}>
                                {formData.documents.rulesPdf ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                                        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-3 border border-red-100 shadow-sm">
                                            <FileText size={32} />
                                        </div>
                                        <a
                                            href={formData.documents.rulesPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-bold text-gray-800 hover:underline hover:text-purple-600 mb-1 line-clamp-1 break-all"
                                        >
                                            View Uploaded Rules.pdf
                                        </a>
                                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mb-4">
                                            <CheckCircle size={12} /> Upload Complete
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, documents: { ...prev.documents, rulesPdf: null } }))}
                                            className="px-4 py-2 bg-white border border-gray-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                                        >
                                            Replace / Remove
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex-1 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-purple-600 w-full">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            className="hidden"
                                            onChange={handlePdfUpload}
                                            disabled={uploading}
                                        />
                                        <div className={`p-4 rounded-full bg-gray-50 mb-3 ${uploading ? 'animate-pulse' : ''}`}>
                                            <FileText size={32} />
                                        </div>
                                        <span className="text-sm font-bold">{uploading ? 'Uploading...' : 'Upload Rules PDF'}</span>
                                        <span className="text-xs mt-1 text-gray-400">(PDF only)</span>
                                    </label>
                                )}
                            </div>

                        </div>
                    </section>

                </form>
            )}
        </div>
    );
};

export default AddHostel;
