
import React, { useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

const SubjectEligibilityPanel = ({ eligibleSubjects, onUpdate }) => {

    // eligibleSubjects: Array of { subject: '', level: 'School' | 'UG' | 'PG' }
    const [subjects, setSubjects] = useState(eligibleSubjects || []);
    const [newSubject, setNewSubject] = useState({ subject: '', level: 'School' });

    const handleAdd = () => {
        if (!newSubject.subject) return;
        const updated = [...subjects, { ...newSubject, id: Date.now() }];
        setSubjects(updated);
        onUpdate(updated);
        setNewSubject({ subject: '', level: 'School' });
    };

    const handleRemove = (id) => {
        const updated = subjects.filter(s => s.id !== id);
        setSubjects(updated);
        onUpdate(updated);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-blue-600" size={20} />
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm">Subject Eligibility</h3>
                        <p className="text-xs text-gray-500">Subjects this teacher is approved to teach.</p>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">

                {/* List */}
                <div className="space-y-2 mb-6">
                    {subjects.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-blue-50/50 border border-blue-100 rounded-lg group">
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{item.subject}</p>
                                <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded font-bold">{item.level} Level</span>
                            </div>
                            <button onClick={() => handleRemove(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {subjects.length === 0 && <p className="text-xs text-gray-400 italic">No eligible subjects added.</p>}
                </div>

                {/* Add New */}
                <div className="flex gap-2 items-end border-t border-gray-100 pt-4">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Subject Name</label>
                        <input
                            type="text"
                            value={newSubject.subject}
                            onChange={(e) => setNewSubject(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500"
                            placeholder="e.g. Physics"
                        />
                    </div>
                    <div className="w-32">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Academic Level</label>
                        <select
                            value={newSubject.level}
                            onChange={(e) => setNewSubject(prev => ({ ...prev, level: e.target.value }))}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-blue-500"
                        >
                            <option value="School">School</option>
                            <option value="UG">UG</option>
                            <option value="PG">PG</option>
                        </select>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg mb-0.5 transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SubjectEligibilityPanel;
