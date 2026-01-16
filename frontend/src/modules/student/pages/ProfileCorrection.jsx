import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, Send, Upload } from 'lucide-react';

const ProfileCorrection = () => {
    const navigate = useNavigate();
    const [selectedField, setSelectedField] = useState('name');
    const [currentValue, setCurrentValue] = useState('');
    const [newValue, setNewValue] = useState('');
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const checkFields = [
        { id: 'name', label: 'Full Name' },
        { id: 'dob', label: 'Date of Birth' },
        { id: 'fatherName', label: 'Father\'s Name' },
        { id: 'address', label: 'Permanent Address' },
        { id: 'contact', label: 'Contact Number' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Mock API call
        setTimeout(() => {
            // In real app, redirect or show toast
        }, 2000);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        Your correction request for <strong>{checkFields.find(f => f.id === selectedField)?.label}</strong> has been submitted to the admin office. You will be notified once approved.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Back to Profile
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white md:bg-gray-50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Request Correction</h1>
                </div>
            </div>

            <main className="max-w-lg mx-auto px-4 pt-6">

                {/* Notice */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 mb-6">
                    <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        Profile corrections require valid proof documents. Changes are subject to admin approval and may take 3-5 working days.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* 1. Select Field */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="block text-sm font-bold text-gray-900 mb-3">Which field needs correction?</label>
                        <div className="space-y-2">
                            {checkFields.map(field => (
                                <label key={field.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 transition-all">
                                    <input
                                        type="radio"
                                        name="field"
                                        value={field.id}
                                        checked={selectedField === field.id}
                                        onChange={(e) => setSelectedField(e.target.value)}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{field.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 2. New Detail */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Correct Value</label>
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                required
                                placeholder={`Enter correct ${checkFields.find(f => f.id === selectedField)?.label}`}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Reason for Change</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                placeholder="E.g. Spelling mistake in earlier record..."
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 min-h-[100px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* 3. Proof Upload */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <label className="block text-sm font-bold text-gray-900 mb-2">Upload Proof Document</label>
                        <p className="text-xs text-gray-500 mb-4">Aadhar Card, Birth Certificate, or School Application Copy.</p>

                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-300 hover:bg-gray-50 transition-all cursor-pointer">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                                <Upload size={20} />
                            </div>
                            <p className="text-sm font-bold text-gray-700">Tap to browse files</p>
                            <p className="text-xs text-gray-400 mt-1">PDF or JPG (Max 5MB)</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all"
                    >
                        Submit Request <Send size={18} />
                    </button>

                </form>
            </main>
        </div>
    );
};

export default ProfileCorrection;
