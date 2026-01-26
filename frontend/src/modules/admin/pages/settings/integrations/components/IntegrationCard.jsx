import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, Play, Save, Power } from 'lucide-react';
import IntegrationStatusBadge from './IntegrationStatusBadge';
import IntegrationConfigForm from './IntegrationConfigForm';

const IntegrationCard = ({ integration, onUpdate, onTest, onToggle }) => {

    const [expanded, setExpanded] = useState(false);
    const [config, setConfig] = useState(integration.config || {});
    const [isDirty, setIsDirty] = useState(false);

    const handleConfigChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        onUpdate(integration.id, config);
        setIsDirty(false);
    };

    const Icon = integration.icon;

    return (
        <div className={`bg-white border rounded-lg shadow-sm transition-all ${expanded ? 'ring-2 ring-indigo-50 border-indigo-200' : 'border-gray-200 hover:border-indigo-200'}`}>

            {/* Header / Summary */}
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${integration.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">{integration.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{integration.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <IntegrationStatusBadge status={integration.status} lastSync={integration.lastSync} />
                    {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
            </div>

            {/* Expanded Config Panel */}
            {expanded && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">

                    <IntegrationConfigForm
                        config={config}
                        fields={integration.fields}
                        onChange={handleConfigChange}
                        isReadOnly={integration.readOnly}
                    />

                    {/* Action Bar */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">

                        <div className="flex items-center gap-2">
                            {/* Enable/Disable Toggle */}
                            {!integration.readOnly && (
                                <button
                                    onClick={() => onToggle(integration.id, !integration.enabled)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-semibold transition-colors ${integration.enabled ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'}`}
                                >
                                    <Power size={14} />
                                    {integration.enabled ? 'Disable Integration' : 'Activate Integration'}
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Test Connection */}
                            {!integration.readOnly && (
                                <button
                                    onClick={() => onTest(integration.id, config)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 text-xs font-medium"
                                >
                                    <Play size={14} /> Test Connection
                                </button>
                            )}

                            {/* Save Changes */}
                            {isDirty && (
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow-sm text-xs font-bold"
                                >
                                    <Save size={14} /> Save Config
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default IntegrationCard;
