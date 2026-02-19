
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, Clock, Edit2, Trash2, Plus, X } from 'lucide-react';
import Lenis from 'lenis';

import { useStudentStore } from '../../../store/studentStore';

const Notes = () => {
    const navigate = useNavigate();
    const myNotes = useStudentStore(state => state.myNotes);
    const fetchMyNotes = useStudentStore(state => state.fetchMyNotes);
    const addMyNote = useStudentStore(state => state.addMyNote);
    const updateMyNote = useStudentStore(state => state.updateMyNote);
    const deleteMyNote = useStudentStore(state => state.deleteMyNote);

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [formTitle, setFormTitle] = useState('');
    const [formContent, setFormContent] = useState('');
    const [formSubject, setFormSubject] = useState('General');
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        fetchMyNotes().finally(() => setLoading(false));
    }, [fetchMyNotes]);

    const openAddForm = () => {
        setEditingNote(null);
        setFormTitle('');
        setFormContent('');
        setFormSubject('General');
        setShowForm(true);
    };

    const openEditForm = (note) => {
        setEditingNote(note);
        setFormTitle(note.title || '');
        setFormContent(note.content || '');
        setFormSubject(note.subject || 'General');
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!formTitle.trim()) return;
        setFormSubmitting(true);
        if (editingNote) {
            const res = await updateMyNote(editingNote._id, { title: formTitle.trim(), content: formContent.trim(), subject: formSubject.trim() });
            if (res.success) setShowForm(false);
            else alert(res.message || 'Failed to update');
        } else {
            const res = await addMyNote({ title: formTitle.trim(), content: formContent.trim(), subject: formSubject.trim() });
            if (res.success) setShowForm(false);
            else alert(res.message || 'Failed to add');
        }
        setFormSubmitting(false);
    };

    const handleDelete = async (note) => {
        if (!window.confirm('Delete this note?')) return;
        const res = await deleteMyNote(note._id);
        if (res.success && editingNote?._id === note._id) setShowForm(false);
        else if (!res.success) alert(res.message || 'Failed to delete');
    };

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    const sortedNotes = [...(myNotes || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600">
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Notes</h1>
                    <button onClick={openAddForm} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700">
                        <Plus size={18} /> Add
                    </button>
                </div>
            </div>

            <main className="px-4 max-w-md mx-auto pt-6 pb-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : sortedNotes.length > 0 ? (
                    <div className="space-y-3">
                        {sortedNotes.map((note, index) => (
                            <motion.div
                                key={note._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3 min-w-0 flex-1">
                                        <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                                            <FileText size={20} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-gray-900 text-sm">{note.title || 'Untitled'}</h3>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 mt-1 inline-block">{note.subject || 'General'}</span>
                                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{note.content || '—'}</p>
                                            <span className="text-[10px] text-gray-400 mt-2 flex items-center gap-0.5">
                                                <Clock size={10} /> {new Date(note.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button onClick={() => openEditForm(note)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(note)} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={36} className="text-amber-500" />
                        </div>
                        <h3 className="text-gray-900 font-semibold text-base">No notes yet</h3>
                        <p className="text-gray-500 text-sm mt-1">Add your first note</p>
                        <button onClick={openAddForm} className="mt-6 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700">
                            Add Note
                        </button>
                    </motion.div>
                )}
            </main>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="font-bold text-gray-900">{editingNote ? 'Edit Note' : 'Add Note'}</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 space-y-4 overflow-y-auto">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="Note title"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={formSubject}
                                        onChange={(e) => setFormSubject(e.target.value)}
                                        placeholder="e.g. Maths, Physics"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
                                    <textarea
                                        value={formContent}
                                        onChange={(e) => setFormContent(e.target.value)}
                                        placeholder="Write your note..."
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                    />
                                </div>
                            </div>
                            <div className="p-4 border-t">
                                <button
                                    onClick={handleSave}
                                    disabled={!formTitle.trim() || formSubmitting}
                                    className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl disabled:opacity-50"
                                >
                                    {formSubmitting ? 'Saving...' : (editingNote ? 'Update' : 'Save')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notes;
