import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, MessageCircle, ChevronDown, ChevronUp, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TicketCard = ({ ticket }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const statusConfig = {
        'Open': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: AlertCircle },
        'In Progress': { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: Clock },
        'Resolved': { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: CheckCircle },
        'Closed': { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: CheckCircle },
    };

    const config = statusConfig[ticket.status] || statusConfig['Open'];
    const StatusIcon = config.icon;

    return (
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm mb-3 transition-all ${isExpanded ? 'ring-2 ring-indigo-100' : 'hover:border-gray-300'}`}>
            <div
                className="p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-gray-400">#{ticket.id?.slice(-8).toUpperCase()}</span>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${config.bg} ${config.color}`}>
                            <StatusIcon size={10} /> {ticket.status}
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                </div>

                <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1">{ticket.subject}</h4>
                <p className="text-xs text-gray-500">{ticket.category}</p>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 pt-4 border-t border-gray-50">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Request:</p>
                                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                    "{ticket.details}"
                                </p>

                                {ticket.response && (
                                    <div className="mt-4">
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Official Response:</p>
                                        <div className="text-xs text-gray-800 bg-indigo-50/30 p-3 rounded-lg border border-indigo-50 leading-relaxed">
                                            {ticket.response}
                                        </div>
                                    </div>
                                )}

                                {ticket.responseAttachment && (
                                    <div className="mt-4 p-3 bg-white border-2 border-dashed border-emerald-100 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight line-clamp-1">{ticket.responseAttachmentName || 'Document.pdf'}</p>
                                                <p className="text-[9px] font-bold text-gray-400">Verified Document</p>
                                            </div>
                                        </div>
                                        <a
                                            href={ticket.responseAttachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm"
                                        >
                                            <Download size={14} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400">
                        {isExpanded ? `Last updated: ${new Date(ticket.lastUpdate).toLocaleString()}` : `Updated: ${new Date(ticket.lastUpdate).toLocaleDateString()}`}
                    </span>
                    {!isExpanded && ticket.response && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <CheckCircle size={10} /> Replied
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
