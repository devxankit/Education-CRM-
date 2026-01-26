import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';

// Steps
import DataSourceSelector from './DataSourceSelector';
import FieldSelector from './FieldSelector';
import FilterBuilder from './FilterBuilder';
import GroupingPanel from './GroupingPanel';
import ReportPreview from './ReportPreview';
import ReportSettings from './ReportSettings';

const STEPS = [
    { title: 'Data Source', component: DataSourceSelector },
    { title: 'Select Fields', component: FieldSelector },
    { title: 'Filters', component: FilterBuilder },
    { title: 'Sort & Group', component: GroupingPanel },
    { title: 'Preview', component: ReportPreview },
    { title: 'Settings', component: ReportSettings }
];

const CreateReportWizard = ({ onCancel, onSave, existingReport }) => {

    const [currentStep, setCurrentStep] = useState(0);
    const [config, setConfig] = useState(existingReport || {
        source: '',
        fields: [],
        filters: [],
        grouping: { sortBy: '', sortOrder: 'asc', groupBy: '', showCount: false },
        settings: { name: '', description: '', visibility: 'private' }
    });

    // Logging step usage
    useEffect(() => {
        console.log(`[AUDIT] Builder Step Accessed: ${STEPS[currentStep].title} | User: CurrentUser | Time: ${new Date().toISOString()}`);
    }, [currentStep]);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            // Validation logic could go here
            if (currentStep === 0 && !config.source) return alert("Please select a data source.");
            if (currentStep === 1 && config.fields.length === 0) return alert("Please select at least one field.");

            setCurrentStep(curr => curr + 1);
        } else {
            // Final Save
            onSave(config);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(curr => curr - 1);
    };

    // Render Logic
    const CurrentComponent = STEPS[currentStep].component;

    // Component Props Mapper
    const getProps = () => {
        switch (currentStep) {
            case 0: return { selectedSource: config.source, onSelect: (val) => setConfig({ ...config, source: val, fields: [] }) }; // Reset fields on source change
            case 1: return {
                source: config.source, selectedFields: config.fields, onToggle: (fieldId) => {
                    const newFields = config.fields.includes(fieldId)
                        ? config.fields.filter(f => f !== fieldId)
                        : [...config.fields, fieldId];
                    setConfig({ ...config, fields: newFields });
                }
            };
            case 2: return { filters: config.filters, fields: config.fields, onUpdate: (val) => setConfig({ ...config, filters: val }) };
            case 3: return { config: config.grouping, fields: config.fields, onUpdate: (val) => setConfig({ ...config, grouping: val }) };
            case 4: return { config: config }; // Preview needs whole config
            case 5: return { settings: config.settings, onUpdate: (val) => setConfig({ ...config, settings: val }) };
            default: return {};
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 -my-6 -mx-8">

            {/* Wizard Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Report Builder</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>Step {currentStep + 1} of {STEPS.length}:</span>
                            <span className="font-semibold text-indigo-600">{STEPS[currentStep].title}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="hidden md:flex gap-1">
                    {STEPS.map((_, idx) => (
                        <div key={idx} className={`h-1.5 w-8 rounded-full transition-colors ${idx <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                    ))}
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 text-sm font-medium">Save Draft</button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col">
                    <div className="flex-1 p-8">
                        <CurrentComponent {...getProps()} />
                    </div>

                    {/* Action Bar */}
                    <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex justify-between items-center rounded-b-xl">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200 bg-white border border-gray-300'}`}
                        >
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 text-sm font-medium transition-transform active:scale-95"
                        >
                            {currentStep === STEPS.length - 1 ? (
                                <>
                                    <Save size={18} /> Save Report
                                </>
                            ) : (
                                <>
                                    Next Step <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CreateReportWizard;
