import React from 'react';
import { useExamPolicyStore } from '../../../../../../store/examPolicyStore';
import { Eye, EyeOff, Globe, Lock } from 'lucide-react';

const VisibilityConfig = ({ isLocked }) => {
    const { policy } = useExamPolicyStore();
    const visibilityRules = policy?.visibilityRules || {
        autoPublishResults: false,
        showRankInReportCard: true,
        showPercentile: false,
        allowParentView: true,
        showGraceMarksToParents: false
    };

    const handleChange = (field, value) => {
        if (isLocked) return;
        useExamPolicyStore.setState({
            policy: {
                ...policy,
                visibilityRules: {
                    ...visibilityRules,
                    [field]: value
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Visibility & Publishing Rules</h3>
                <p className="text-sm text-gray-500">Manage how and when exam results are shared with stakeholders.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-indigo-600" />
                        Publishing Strategy
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block">Auto-Publish Results</label>
                                <p className="text-xs text-gray-500">Publish immediately after teacher approval</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={visibilityRules.autoPublishResults}
                                disabled={isLocked}
                                onChange={(e) => handleChange('autoPublishResults', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block">Parent Portal Visibility</label>
                                <p className="text-xs text-gray-500">Allow parents to view detailed marksheet</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={visibilityRules.allowParentView}
                                disabled={isLocked}
                                onChange={(e) => handleChange('allowParentView', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Lock size={18} className="text-indigo-600" />
                        Report Card Content
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded border border-gray-200">
                                    {visibilityRules.showRankInReportCard ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-red-600" />}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block">Show Class Rank</label>
                                    <p className="text-xs text-gray-500">Display student's rank in the class</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={visibilityRules.showRankInReportCard}
                                disabled={isLocked}
                                onChange={(e) => handleChange('showRankInReportCard', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded border border-gray-200">
                                    {visibilityRules.showPercentile ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-red-600" />}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block">Show Percentile</label>
                                    <p className="text-xs text-gray-500">Display relative performance metric</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={visibilityRules.showPercentile}
                                disabled={isLocked}
                                onChange={(e) => handleChange('showPercentile', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisibilityConfig;
