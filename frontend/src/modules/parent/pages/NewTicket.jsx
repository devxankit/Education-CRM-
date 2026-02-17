import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Send, Paperclip, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useParentStore } from '../../../store/parentStore';
import axios from 'axios';
import { API_URL } from '../../../app/api';

const NewTicketPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};
    const addTicket = useParentStore(state => state.addTicket);
    const selectedChildId = useParentStore(state => state.selectedChildId);
    const studentId = state.childId || selectedChildId;

    // Auto-fill form based on source context
    const [formData, setFormData] = useState({
        category: state.issueType ? state.issueType.charAt(0).toUpperCase() + state.issueType.slice(1) : 'General',
        subject: '',
        message: '',
        priority: 'Normal'
    });
    const [attachment, setAttachment] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);

    const categories = ['General', 'Attendance', 'Fees', 'Homework', 'Transport', 'Other', 'Documents'];

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // basic validation
        if (file.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsUploading(true);
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/upload/single`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.data.success) {
                setAttachment(res.data.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const removeAttachment = (e) => {
        e.stopPropagation();
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentId) {
            alert("No student associated. Please select a child first.");
            return;
        }

        setIsSubmitting(true);
        const res = await addTicket(studentId, {
            category: formData.category,
            topic: formData.subject,
            details: formData.message,
            priority: formData.priority,
            attachment: attachment
        });

        setIsSubmitting(false);
        if (res.success) {
            navigate('/parent/support', { state: { childId: studentId } });
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeft size={22} className="text-gray-600" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">New Support Ticket</h1>
            </header>

            <main className="max-w-md mx-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    type="button"
                                    key={cat}
                                    onClick={() => setFormData(p => ({ ...p, category: cat }))}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${formData.category === cat
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Subject</label>
                        <input
                            required
                            type="text"
                            placeholder="Briefly describe the issue..."
                            value={formData.subject}
                            onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Message</label>
                        <textarea
                            required
                            rows={6}
                            placeholder="Explain the issue in detail..."
                            value={formData.message}
                            onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                        />
                    </div>

                    <div
                        onClick={() => !attachment && !isUploading && fileInputRef.current.click()}
                        className={`group relative flex items-center gap-3 p-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl transition-all
                            ${attachment ? 'border-green-200 bg-green-50' : 'hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'}
                        `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="image/*"
                        />

                        {isUploading ? (
                            <>
                                <Loader2 size={20} className="text-indigo-600 animate-spin" />
                                <span className="text-sm text-gray-500 font-bold">Uploading...</span>
                            </>
                        ) : attachment ? (
                            <div className="flex-1 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-green-100 p-1">
                                        <img src={attachment} alt="Attachment" className="w-full h-full object-cover rounded" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-green-700 block">Image Attached</span>
                                        <span className="text-[10px] text-green-600">Click remove to change</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeAttachment}
                                    className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Paperclip size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                <span className="text-sm text-gray-500 font-medium group-hover:text-indigo-600 transition-colors">Attach Image (Optional)</span>
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Ticket</>}
                    </button>

                </form>
            </main>
        </div>
    );
};

export default NewTicketPage;
