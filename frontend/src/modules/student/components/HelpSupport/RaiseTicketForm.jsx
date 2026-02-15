import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Paperclip, FileText } from 'lucide-react';

const ACCEPT = 'image/*,.pdf,.doc,.docx,.png,.jpg,.jpeg';

const RaiseTicketForm = ({ categories, defaultCategory, onClose, onSubmit }) => {
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState(defaultCategory || categories[0]);
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setAttachment(file);
        e.target.value = '';
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = onSubmit({ subject, category, description, file: attachment });
            if (result && typeof result.then === 'function') {
                await result;
            }
        } catch (err) {
            console.error('Ticket submit error:', err);
            alert(err?.message || 'Could not create ticket. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-gray-900">Raise Ticket</h2>
                    <button onClick={onClose} type="button" className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Issue Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            placeholder="Briefly describe the issue..."
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Please provide details (e.g. Dates, Exam Name, Transaction ID)..."
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 px-4 min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPT}
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label="Attach file"
                    />
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
                        className="flex items-center gap-2 p-3 border border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <Paperclip size={18} className="text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                            {attachment ? (
                                <span className="text-xs font-medium text-indigo-600 truncate flex items-center gap-1">
                                    <FileText size={14} />
                                    {attachment.name}
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="ml-1 text-red-500 hover:text-red-600 text-[10px] font-bold"
                                    >
                                        Remove
                                    </button>
                                </span>
                            ) : (
                                <span className="text-xs text-gray-500 font-medium">Attach screenshot or document (Optional)</span>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all
                                ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700 active:scale-[0.98]'}`}
                        >
                            {isSubmitting ? 'Submitting...' : <>Submit Ticket <Send size={16} /></>}
                        </button>
                    </div>

                </form>
            </motion.div>
        </motion.div>
    );
};

export default RaiseTicketForm;
