import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, FileText, Download, Eye, Calendar,
    CheckCircle, Clock, AlertCircle, Filter
} from 'lucide-react';
import { useParentStore } from '../../../store/parentStore';

const DocumentsPage = () => {
    const navigate = useNavigate();
    const children = useParentStore(state => state.children);
    const selectedChildId = useParentStore(state => state.selectedChildId);
    const setSelectedChildId = useParentStore(state => state.setSelectedChild);
    const documents = useParentStore(state => state.documents);
    const [filterType, setFilterType] = useState('All');

    const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

    // Filter documents for selected child
    const filteredDocs = documents
        .filter(doc => doc.childId === selectedChildId)
        .filter(doc => filterType === 'All' || doc.type === filterType);

    const documentTypes = ['All', 'Academic', 'Finance', 'Certificate', 'Medical'];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Available':
                return <CheckCircle size={14} className="text-green-600" />;
            case 'Pending Upload':
                return <Clock size={14} className="text-amber-600" />;
            case 'Not Generated':
                return <AlertCircle size={14} className="text-gray-400" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'text-green-700 bg-green-50';
            case 'Pending Upload': return 'text-amber-700 bg-amber-50';
            case 'Not Generated': return 'text-gray-500 bg-gray-100';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Academic': return 'bg-blue-100 text-blue-700';
            case 'Finance': return 'bg-green-100 text-green-700';
            case 'Certificate': return 'bg-purple-100 text-purple-700';
            case 'Medical': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/parent')}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Documents</h1>
                        <p className="text-xs text-gray-500">{filteredDocs.length} documents</p>
                    </div>
                </div>
            </div>

            {/* Child Selector */}
            {children.length > 1 && (
                <div className="px-4 pt-4">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {children.map(child => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChildId(child.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedChildId === child.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-700'
                                    }`}
                            >
                                {child.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="px-4 pt-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {documentTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filterType === type
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Documents List */}
            <div className="p-4 space-y-3">
                {filteredDocs.length === 0 ? (
                    <div className="text-center py-10">
                        <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No documents found</p>
                    </div>
                ) : (
                    filteredDocs.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-gray-100 rounded-lg">
                                        <FileText size={20} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{doc.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${getTypeColor(doc.type)}`}>
                                                {doc.type}
                                            </span>
                                            {doc.date && (
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {new Date(doc.date).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${getStatusColor(doc.status)}`}>
                                    {getStatusIcon(doc.status)}
                                    {doc.status}
                                </div>
                            </div>

                            {/* Actions */}
                            {doc.status === 'Available' && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                                        <Eye size={14} />
                                        View
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-medium text-indigo-700 transition-colors">
                                        <Download size={14} />
                                        Download
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DocumentsPage;
