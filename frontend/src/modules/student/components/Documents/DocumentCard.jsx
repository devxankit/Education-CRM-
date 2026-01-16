import React, { useRef, useEffect } from 'react';
import { FileText, Download, Eye, Lock, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';

const DocumentCard = ({ doc, index, onView, onDownload }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: index * 0.05, ease: 'power2.out' }
        );
    }, [index]);

    const statusConfig = {
        Available: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: ShieldCheck },
        Pending: { color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock },
        Expired: { color: 'text-red-500', bg: 'bg-red-50', icon: AlertTriangle },
    };

    const config = statusConfig[doc.status] || statusConfig.Pending;
    const StatusIcon = config.icon;

    return (
        <div
            ref={cardRef}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-gray-300 transition-all mb-3 active:scale-[0.99]"
        >
            <div className="flex items-start gap-3 mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                    {doc.category === 'Identity' ? <ShieldCheck size={20} /> : <FileText size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug truncate">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 font-medium">{doc.category}</span>
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="text-[10px] text-gray-400 font-mono">{doc.size !== 'Unknown' ? doc.size : ''}</span>
                    </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${config.bg} ${config.color}`}>
                    <StatusIcon size={10} /> {doc.status}
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="text-[10px] text-gray-400 font-medium">
                    Issued: {new Date(doc.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                <div className="flex items-center gap-2">
                    {doc.permissions.view ? (
                        <button
                            onClick={() => onView(doc)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View"
                        >
                            <Eye size={16} />
                        </button>
                    ) : (
                        <button className="p-1.5 text-gray-300 cursor-not-allowed" title="View Restricted">
                            <Lock size={16} />
                        </button>
                    )}

                    {doc.permissions.download ? (
                        <button
                            onClick={() => onDownload(doc)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Download"
                        >
                            <Download size={16} />
                        </button>
                    ) : (
                        <button className="p-1.5 text-gray-300 cursor-not-allowed" title="Download Restricted">
                            <Lock size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
