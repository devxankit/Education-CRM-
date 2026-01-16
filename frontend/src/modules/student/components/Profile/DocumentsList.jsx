import React from 'react';
import { FileText, Download, ShieldCheck } from 'lucide-react';

const DocumentsList = ({ documents }) => {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
                Official Documents
            </h3>

            {(!documents || documents.length === 0) ? (
                <p className="text-sm text-gray-500 italic">No documents available.</p>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                                    <FileText size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{doc.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-[10px] text-gray-400 font-medium uppercase">{doc.type} • {doc.size}</p>
                                        {doc.status === 'Verified' && (
                                            <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">
                                                <ShieldCheck size={10} /> Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                <Download size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <a href="/student/documents" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-1">
                    View Full Document Vault →
                </a>
            </div>
        </div>
    );
};

export default DocumentsList;
