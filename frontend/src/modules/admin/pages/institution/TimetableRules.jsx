
import React, { useState } from 'react';
import { History } from 'lucide-react';

import RuleLockBanner from './components/timetable-rules/RuleLockBanner';
import GlobalTimeSettings from './components/timetable-rules/GlobalTimeSettings';
import PeriodRules from './components/timetable-rules/PeriodRules';
import WorkloadRules from './components/timetable-rules/WorkloadRules';
import ConflictRules from './components/timetable-rules/ConflictRules';

const TimetableRules = () => {
    // State simulating backend configuration
    const [isLocked, setIsLocked] = useState(true); // Default locked for safety
    const [hasActiveSession, setHasActiveSession] = useState(true); // Mock Active Session

    const [rules, setRules] = useState({
        // Global
        startTime: '08:00',
        endTime: '15:30',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

        // Period
        periodDuration: 45,
        shortBreakDuration: 15,
        lunchBreakDuration: 45,
        maxPeriodsStudent: 8,
        maxPeriodsTeacher: 6,

        // Workload
        maxConsecutive: 3,
        maxWeeklyHours: 24,
        minFreePeriods: 2,

        // Conflict
        preventTeacherOverlap: true,
        preventRoomOverlap: true,
        preventStudentOverlap: true,
        allowExamOverride: false
    });

    const handleChange = (key, value) => {
        setRules(prev => ({ ...prev, [key]: value }));
    };

    const handleToggleLock = () => {
        if (isLocked) {
            const reason = window.prompt("To UNLOCK rules, please provide an Admin Reason for the audit log:");
            if (reason) {
                // Log logic
                setIsLocked(false);
            }
        } else {
            const confirm = window.confirm("Are you sure you want to LOCK the rules? This will finalize the timetable constraints.");
            if (confirm) setIsLocked(true);
        }
    };

    const handleSave = () => {
        // Mock API
        console.log("Saving Rules:", rules);
        alert("Timetable Rules Saved Successfully.");
        setIsLocked(true); // Auto lock after save
    };

    return (
        <div className="h-full relative pb-10">
            {/* Sticky Header with Lock Logic */}
            <RuleLockBanner
                isLocked={isLocked}
                onToggleLock={handleToggleLock}
                onSave={handleSave}
                hasActiveSession={hasActiveSession}
            />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* Intro Text */}
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start gap-3">
                    <History className="text-indigo-600 mt-1 shrink-0" size={20} />
                    <div className="text-sm text-indigo-900">
                        <p className="font-semibold">Constraint Logic Active</p>
                        <p className="opacity-80 mt-1">
                            These rules control the <strong>Auto-Scheduler Engine</strong>.
                            Changes here will affect how the system validates manual timetable entries and generates automatic schedules.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GlobalTimeSettings
                        ruleData={rules}
                        onChange={handleChange}
                        isLocked={isLocked}
                    />
                    <PeriodRules
                        ruleData={rules}
                        onChange={handleChange}
                        isLocked={isLocked}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WorkloadRules
                        ruleData={rules}
                        onChange={handleChange}
                        isLocked={isLocked}
                    />
                    <ConflictRules
                        ruleData={rules}
                        onChange={handleChange}
                        isLocked={isLocked}
                    />
                </div>
            </div>
        </div>
    );
};

export default TimetableRules;
