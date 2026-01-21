
import React, { useState } from 'react';
import { UserPlus, Trash2, Link, AlertCircle } from 'lucide-react';

const StudentLinkPanel = ({ links, onUpdate }) => {

    // links: Array of { studentName: '', class: '', relation: '' }
    const [linkedStudents, setLinkedStudents] = useState(links || []);
    const [isAdding, setIsAdding] = useState(false);

    // Mock Student Search
    const [searchTerm, setSearchTerm] = useState('');

    const handleRemove = (id) => {
        if (confirm("Are you sure you want to unlink this student? Ensure they have another guardian linked.")) {
            const updated = linkedStudents.filter(s => s.id !== id);
            setLinkedStudents(updated);
            onUpdate(updated);
        }
    };

    const handleAddMock = () => {
        // Simulating selecting a student
        const newLink = {
            id: Date.now(),
            studentName: 'New Student (Mock)',
            class: 'Class 1-A',
            relation: 'Parent'
        };
        const updated = [...linkedStudents, newLink];
        setLinkedStudents(updated);
        onUpdate(updated);
        setIsAdding(false);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link className="text-indigo-600" size={20} />
                    <h3 className="font-bold text-gray-800 text-sm">Linked Students</h3>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-1 text-indigo-600 text-xs font-bold hover:underline"
                >
                    <UserPlus size={14} /> Link Student
                </button>
            </div>

            <div className="p-6 space-y-3">

                {isAdding && (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg mb-4 animate-in fade-in slide-in-from-top-2">
                        <label className="text-xs font-bold text-indigo-800 block mb-2">Search Student to Link</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type student name..."
                                className="flex-1 text-sm border border-indigo-200 rounded px-2 py-1 outline-none"
                                autoFocus
                            />
                            <button onClick={handleAddMock} className="bg-indigo-600 text-white px-3 py-1 rounded text-xs font-bold">Add</button>
                        </div>
                    </div>
                )}

                {linkedStudents.map((link) => (
                    <div key={link.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                {link.studentName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{link.studentName}</p>
                                <p className="text-[10px] text-gray-500">{link.class}</p>
                            </div>
                        </div>
                        <button onClick={() => handleRemove(link.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                {linkedStudents.length === 0 && (
                    <div className="text-center py-4 text-gray-400 text-xs italic border border-dashed border-gray-200 rounded-lg flex flex-col items-center gap-2">
                        <AlertCircle size={16} />
                        No students linked. This parent is an orphan record.
                    </div>
                )}

            </div>
        </div>
    );
};

export default StudentLinkPanel;
