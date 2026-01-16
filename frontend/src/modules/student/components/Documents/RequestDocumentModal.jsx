import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Download, ShieldCheck, AlertCircle } from 'lucide-react';

const RequestDocumentModal = ({ onClose, onSubmit }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Request Document</h2>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-xl flex gap-3 border border-indigo-100">
                        <Info size={20} className="text-indigo-600 mt-0.5" />
                        <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                            Requests are forwarded to the Admin Office. Standard processing time is 2-3 working days.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Document Type</label>
                        <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option>Bonafide Certificate</option>
                            <option>Character Certificate</option>
                            <option>Transfer Certificate (TC)</option>
                            <option>Duplicate ID Card</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Reason for Request</label>
                        <textarea
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 h-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Applying for passport, Scholarship application..."
                        ></textarea>
                    </div>

                    <button
                        onClick={() => {
                            onSubmit();
                            onClose();
                        }}
                        className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all"
                    >
                        Submit Request
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

import { Info } from 'lucide-react'; // Helper import for the modal

export default RequestDocumentModal;
