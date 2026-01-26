
import React from 'react';
import { ShieldAlert, Clock, AlertTriangle, FileText, Settings, Info, ChevronDown } from 'lucide-react';

const DocumentRulesTable = ({ rules, onToggleRequired, onUpdateRule }) => {

    const stageOptions = ['Admission', 'Post-Admission', 'Exam', 'Joining', 'Employment Active'];
    const enforcementOptions = [
        { value: 'block', label: 'Hard Block', color: 'text-red-600 bg-red-50' },
        { value: 'warning', label: 'Soft Warning', color: 'text-amber-600 bg-amber-50' },
        { value: 'info', label: 'Info Only', color: 'text-blue-600 bg-blue-50' }
    ];

    // Helper for Mobile Card
    const MobileRuleCard = ({ rule }) => (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                        <FileText size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{rule.name}</h4>
                        <p className="text-xs text-gray-500">{rule.category}</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rule.isRequired}
                        onChange={() => onToggleRequired(rule.id)}
                        className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            {rule.isRequired && (
                <div className="space-y-3 pt-2 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Stage</label>
                        <select
                            value={rule.stage}
                            onChange={(e) => onUpdateRule(rule.id, 'stage', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 text-sm py-1.5"
                        >
                            {stageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Grace (Days)</label>
                            <input
                                type="number"
                                value={rule.gracePeriodDays}
                                onChange={(e) => onUpdateRule(rule.id, 'gracePeriodDays', e.target.value)}
                                className="mt-1 w-full rounded-md border-gray-300 text-sm py-1.5 px-2"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Policy</label>
                            <select
                                value={rule.enforcement}
                                onChange={(e) => onUpdateRule(rule.id, 'enforcement', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 text-sm py-1.5"
                            >
                                {enforcementOptions.map(opt => <option key={opt} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Document Details</th>
                            <th className="px-6 py-4 text-center">Required</th>
                            <th className="px-6 py-4">Mandatory Stage</th>
                            <th className="px-6 py-4">Grace Period</th>
                            <th className="px-6 py-4 w-48">Enforcement Policy</th>
                            <th className="px-6 py-4 text-center">Config</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors">
                                {/* Document Name & Type */}
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{rule.name}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{rule.category}</p>
                                            {rule.condition && (
                                                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium border border-purple-100">
                                                    <Info size={10} /> {rule.condition}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Required Switch */}
                                <td className="px-6 py-4 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rule.isRequired}
                                            onChange={() => onToggleRequired(rule.id)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </td>

                                {/* Mandatory Stage */}
                                <td className="px-6 py-4">
                                    <select
                                        disabled={!rule.isRequired}
                                        value={rule.stage}
                                        onChange={(e) => onUpdateRule(rule.id, 'stage', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-50 py-1.5"
                                    >
                                        {stageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </td>

                                {/* Grace Period */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            disabled={!rule.isRequired}
                                            value={rule.gracePeriodDays}
                                            onChange={(e) => onUpdateRule(rule.id, 'gracePeriodDays', e.target.value)}
                                            className="w-16 rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-gray-50 py-1.5 px-2"
                                            placeholder="0"
                                        />
                                        <span className={`text-sm ${!rule.isRequired ? 'text-gray-300' : 'text-gray-500'}`}>days</span>
                                    </div>
                                </td>

                                {/* Enforcement Policy */}
                                <td className="px-6 py-4">
                                    <div className="relative group">
                                        <select
                                            disabled={!rule.isRequired}
                                            value={rule.enforcement}
                                            onChange={(e) => onUpdateRule(rule.id, 'enforcement', e.target.value)}
                                            className={`
                                                block w-full rounded-md border-0 py-1.5 pl-3 pr-8 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:bg-gray-50
                                                ${rule.enforcement === 'block' ? 'text-red-700 bg-red-50 ring-red-200' : ''}
                                                ${rule.enforcement === 'warning' ? 'text-amber-700 bg-amber-50 ring-amber-200' : ''}
                                                ${rule.enforcement === 'info' ? 'text-blue-700 bg-blue-50 ring-blue-200' : ''}
                                            `}
                                        >
                                            {enforcementOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>

                                        {rule.enforcement === 'block' && rule.isRequired && (
                                            <div className="absolute top-10 right-0 w-64 p-3 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                                <div className="font-bold flex items-center gap-2 mb-1">
                                                    <ShieldAlert size={14} className="text-red-400" />
                                                    Action Blocked
                                                </div>
                                                System will prevent {rule.stage.toLowerCase()} until this document is verified.
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Advanced Config (Expiry etc) - Placeholder for now */}
                                <td className="px-6 py-4 text-center">
                                    <button
                                        disabled={!rule.isRequired}
                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                                        title="Configure Validity & Expiry"
                                    >
                                        <Settings size={18} />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                {rules.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No document rules defined for this entity.</p>
                    </div>
                )}
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
                {rules.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p>No rules found.</p>
                    </div>
                ) : (
                    rules.map(rule => <MobileRuleCard key={rule.id} rule={rule} />)
                )}
            </div>
        </div>
    );
};

export default DocumentRulesTable;
