
import React, { useState, useEffect } from 'react';
import { Save, Briefcase, DollarSign, Heart, Shield } from 'lucide-react';
import ContractRulesPanel from './ContractRulesPanel';
import ExitRulesPanel from './ExitRulesPanel';

const EmploymentTypeForm = ({ type: initialData, onSave, onCancel }) => {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Active',
        contractBased: false,

        // Payroll & Benefits
        payrollEligible: true,
        benefitsEligible: true,
        pfEligible: true,
        esicEligible: true,

        // Modules
        contractRules: { durationType: 'Fixed Term', durationMonths: 12 },
        exitRules: { noticePeriod: 30, probationMonths: 6 }
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                description: '',
                status: 'Active',
                contractBased: false,
                payrollEligible: true,
                benefitsEligible: true,
                pfEligible: true,
                esicEligible: true,
                contractRules: { durationType: 'Fixed Term', durationMonths: 12 },
                exitRules: { noticePeriod: 30, probationMonths: 6 }
            });
        }
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">

            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="text-indigo-600" size={20} />
                        <h2 className="text-xl font-bold text-gray-900">{initialData ? formData.name : 'New Employment Type'}</h2>
                    </div>
                    <p className="text-xs text-gray-500 pl-7">Define rules and policies for this category.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm font-bold text-sm"
                    >
                        <Save size={16} /> Save Rules
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">

                {/* 1. Basic Details */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Employment Type Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Permanent Staff"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type Classification</label>
                        <div className="flex items-center gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.contractBased}
                                    onChange={(e) => handleChange('contractBased', e.target.checked)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-bold text-gray-800">Is Contract Based?</span>
                            </label>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows="2"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="Brief description of eligibility..."
                        ></textarea>
                    </div>
                </div>

                {/* 2. Contract Rules (Conditional) */}
                <ContractRulesPanel
                    visible={formData.contractBased}
                    data={formData.contractRules}
                    onChange={(val) => handleChange('contractRules', val)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* 3. Payroll & Compliance */}
                    <div className="border border-gray-200 rounded-lg p-5">
                        <h4 className="text-sm font-bold text-green-700 mb-4 flex items-center gap-2">
                            <DollarSign size={16} /> Payroll & Finances
                        </h4>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Payroll Calculation Eligible</span>
                                <input
                                    type="checkbox"
                                    checked={formData.payrollEligible}
                                    onChange={(e) => handleChange('payrollEligible', e.target.checked)}
                                    className="rounded text-green-600 focus:ring-green-500"
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Overtime Applicable</span>
                                <input
                                    type="checkbox"
                                    checked={true} readOnly
                                    className="rounded text-green-600 focus:ring-green-500"
                                />
                            </label>
                        </div>
                    </div>

                    {/* 4. Benefits */}
                    <div className="border border-gray-200 rounded-lg p-5">
                        <h4 className="text-sm font-bold text-blue-700 mb-4 flex items-center gap-2">
                            <Heart size={16} /> Benefits & Welfare
                        </h4>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Provident Fund (PF)</span>
                                <input
                                    type="checkbox"
                                    checked={formData.pfEligible}
                                    onChange={(e) => handleChange('pfEligible', e.target.checked)}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Health Insurance (ESIC)</span>
                                <input
                                    type="checkbox"
                                    checked={formData.esicEligible}
                                    onChange={(e) => handleChange('esicEligible', e.target.checked)}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                            </label>
                        </div>
                    </div>

                </div>

                {/* 5. Exit Rules */}
                <ExitRulesPanel
                    data={formData.exitRules}
                    onChange={(val) => handleChange('exitRules', val)}
                />

                {/* Warning Footer */}
                {initialData && (
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex items-start gap-3">
                        <Shield className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                        <div>
                            <h4 className="text-sm font-bold text-yellow-900">Compliance Warning</h4>
                            <p className="text-xs text-yellow-800 mt-1">
                                Disabling payroll or benefits for an active employment type may cause statutory non-compliance.
                                Ensure you have consulted HR policy before saving.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default EmploymentTypeForm;
