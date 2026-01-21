
import React, { useState } from 'react';
import { GraduationCap, Save } from 'lucide-react';

const QualificationPanel = ({ qualifications, onChange }) => {

    // qualifications: { highest: '', specialization: '', university: '', experience: 0 }

    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState(qualifications || {});

    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onChange(data);
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-indigo-600" size={20} />
                    <h3 className="font-bold text-gray-800 text-sm">Qualifications & Experience</h3>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="text-indigo-600 text-xs font-bold hover:underline">Edit</button>
                ) : (
                    <button onClick={handleSave} className="flex items-center gap-1 text-green-600 text-xs font-bold hover:underline">
                        <Save size={14} /> Save
                    </button>
                )}
            </div>

            <div className="p-6 grid grid-cols-2 gap-6">
                <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Highest Qualification</label>
                    {isEditing ? (
                        <input type="text" value={data.highest || ''} onChange={(e) => handleChange('highest', e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-indigo-500" />
                    ) : (
                        <p className="font-medium text-gray-800">{data.highest || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Subject Specialization</label>
                    {isEditing ? (
                        <input type="text" value={data.specialization || ''} onChange={(e) => handleChange('specialization', e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-indigo-500" />
                    ) : (
                        <p className="font-medium text-gray-800">{data.specialization || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">University / Board</label>
                    {isEditing ? (
                        <input type="text" value={data.university || ''} onChange={(e) => handleChange('university', e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-indigo-500" />
                    ) : (
                        <p className="font-medium text-gray-800">{data.university || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Total Teaching Experience</label>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input type="number" min="0" value={data.experience || 0} onChange={(e) => handleChange('experience', e.target.value)} className="w-20 text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-indigo-500" />
                            <span className="text-sm text-gray-600">Years</span>
                        </div>
                    ) : (
                        <p className="font-medium text-gray-800">{data.experience ? `${data.experience} Years` : '0 Years'}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QualificationPanel;
