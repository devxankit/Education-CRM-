import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, CheckCircle } from 'lucide-react';

const NewAdmission = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Mock Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        class: 'X',
        section: 'A',
        dob: '',
        gender: 'Male',
        parentName: '',
        phone: '',
        email: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Student Admission Created Successfully (Mock)');
            navigate('/staff/students');
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto pb-20 md:pb-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">New Admission</h1>
                    <p className="text-xs text-gray-500">Enter student details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Student Details */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">Student Info</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">First Name</label>
                            <input
                                required
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                type="text"
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Aarav"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Last Name</label>
                            <input
                                required
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                type="text"
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Gupta"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Class</label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option>Nursery</option>
                                <option>KG</option>
                                <option>I</option>
                                <option>II</option>
                                <option>III</option>
                                <option>IV</option>
                                <option>V</option>
                                <option>X</option>
                                <option>XI</option>
                                <option>XII</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Parent / Guardian */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">Parent Details</h2>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Parent/Guardian Name</label>
                        <input
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleChange}
                            type="text"
                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Phone</label>
                            <input
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                type="tel"
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="+91"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Email</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="2"
                            className="w-full p-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        ></textarea>
                    </div>
                </div>

                {/* 3. Documents Upload */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2">Documents</h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">Click to upload photo</p>
                        <p className="text-xs text-gray-400">JPG, PNG up to 2MB</p>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="sticky bottom-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <CheckCircle size={20} /> Submit Admission
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default NewAdmission;
