
import React from 'react';
import { Files, CheckCircle2, XCircle } from 'lucide-react';

const DocumentCategoryPanel = ({ isLocked, categories, setCategories }) => {

    const toggleStatus = (index) => {
        if (isLocked) return;
        const newCats = [...categories];
        newCats[index].active = !newCats[index].active;
        setCategories(newCats);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Files className="text-blue-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Document Categories</h3>
                    <p className="text-xs text-gray-500">Define classification types for uploads.</p>
                </div>
            </div>

            <div className="p-4">
                <div className="space-y-3">
                    {categories.map((cat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <span className={`p-2 rounded-full ${cat.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <Files size={16} />
                                </span>
                                <div>
                                    <p className={`text-sm font-bold ${cat.active ? 'text-gray-800' : 'text-gray-400'}`}>{cat.name}</p>
                                    <p className="text-[10px] text-gray-400">
                                        {cat.mandatory ? 'System Mandatory' : 'Optional'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleStatus(index)}
                                disabled={isLocked}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-colors ${cat.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                {cat.active ? (
                                    <>
                                        <CheckCircle2 size={12} /> Active
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={12} /> Inactive
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {!isLocked && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100 text-center">
                        Standard categories are pre-defined by the system.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentCategoryPanel;
