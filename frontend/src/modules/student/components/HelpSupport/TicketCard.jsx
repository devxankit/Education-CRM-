import React from 'react';
import { Clock, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

const TicketCard = ({ ticket }) => {
    const statusConfig = {
        'Open': { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: AlertCircle },
        'In Progress': { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: Clock },
        'Resolved': { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: CheckCircle },
        'Closed': { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', icon: CheckCircle },
    };

    const config = statusConfig[ticket.status] || statusConfig['Open'];
    const StatusIcon = config.icon;

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-3 hover:border-gray-300 transition-colors active:scale-[0.99]">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-gray-400">#{ticket.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${config.bg} ${config.color}`}>
                    <StatusIcon size={10} /> {ticket.status}
                </span>
            </div>

            <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-1">{ticket.subject}</h4>
            <p className="text-xs text-gray-500 mb-3">{ticket.category}</p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-[10px] text-gray-400">Last updated: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                {ticket.updates?.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        <MessageCircle size={10} /> {ticket.updates.length} Updates
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketCard;
