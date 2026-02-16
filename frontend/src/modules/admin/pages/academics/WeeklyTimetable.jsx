import React, { useState, useEffect, useCallback } from 'react';
import { Save, Plus, Trash2, Clock, MapPin, Video, Filter, AlertCircle, School, GraduationCap } from 'lucide-react';
import { useAdminStore, selectAcademicYearsForSelect } from '../../../../store/adminStore';
import { useAppStore } from '../../../../store/index';

const WeeklyTimetable = () => {
    const academicYears = useAdminStore(selectAcademicYearsForSelect);
    const {
        branches, fetchBranches,
        classes, fetchClasses,
        courses, fetchCourses,
        sections, fetchSections,
        fetchAcademicYears,
        teachers, fetchTeachers,
        fetchTimetable, saveTimetable,
        timetable,
        fetchSubjects, subjects,
        fetchTeacherMappings, teacherMappings,
        fetchTimetableRules, timetableRules
    } = useAdminStore();

    const user = useAppStore(state => state.user);

    // Mode: 'school' or 'college'
    const [timetableMode, setTimetableMode] = useState('school');

    // Selections
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedYearId, setSelectedYearId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [activeDay, setActiveDay] = useState('Mon');

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Form State for current day's schedule
    const [localSchedule, setLocalSchedule] = useState({
        Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
    });

    // Validation state
    const [validationErrors, setValidationErrors] = useState({});

    // Initial Fetch
    useEffect(() => {
        fetchBranches();
        fetchAcademicYears();
        fetchTeachers();
        fetchTeacherMappings(); // Fetch all mappings initially or we can fetch by branch
    }, []);

    // Branch selection
    useEffect(() => {
        if (!selectedBranchId) {
            if (user?.branchId) setSelectedBranchId(user.branchId);
            else if (branches.length > 0) setSelectedBranchId(branches[0]._id);
        }
    }, [user, branches]);

    // Fetch classes, courses and mappings when branch changes
    useEffect(() => {
        if (selectedBranchId) {
            fetchClasses(selectedBranchId);
            fetchCourses(selectedBranchId);
            fetchSubjects(selectedBranchId);
            fetchTeacherMappings({ branchId: selectedBranchId });
            fetchTimetableRules(selectedBranchId);
        }
    }, [selectedBranchId]);

    // Reset selections when mode changes
    useEffect(() => {
        if (timetableMode === 'school') {
            setSelectedCourseId('');
            setSelectedClassId('');
            setSelectedSectionId('');
        } else {
            setSelectedClassId('');
            setSelectedSectionId('');
        }
    }, [timetableMode]);

    // Set Active Year
    useEffect(() => {
        if (academicYears.length > 0 && !selectedYearId) {
            const active = academicYears.find(y => y.status === 'active');
            setSelectedYearId(active?._id || academicYears[0]._id);
        }
    }, [academicYears]);

    // Fetch sections when class changes
    useEffect(() => {
        if (selectedClassId) {
            fetchSections(selectedClassId);
            setSelectedSectionId('');
        }
    }, [selectedClassId]);

    // Fetch Timetable when context changes
    useEffect(() => {
        if (selectedYearId) {
            // For school: require sectionId, for college: require courseId
            if (timetableMode === 'school' && selectedSectionId) {
                fetchTimetable({ academicYearId: selectedYearId, sectionId: selectedSectionId })
                    .then(data => {
                        if (data && data.schedule) {
                            const fullSchedule = { ...data.schedule };
                            days.forEach(day => {
                                if (!fullSchedule[day]) fullSchedule[day] = [];
                            });
                            setLocalSchedule(fullSchedule);
                        } else {
                            setLocalSchedule({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });
                        }
                        
                        // Auto-select first working day
                        if (timetableRules?.workingDays?.length > 0) {
                            const currentDayFullName = activeDay === 'Mon' ? 'Monday' : activeDay === 'Tue' ? 'Tuesday' : activeDay === 'Wed' ? 'Wednesday' : activeDay === 'Thu' ? 'Thursday' : activeDay === 'Fri' ? 'Friday' : activeDay === 'Sat' ? 'Saturday' : 'Sunday';
                            
                            if (!timetableRules.workingDays.includes(currentDayFullName)) {
                                const firstWorkingDay = days.find(d => {
                                    const fullName = d === 'Mon' ? 'Monday' : d === 'Tue' ? 'Tuesday' : d === 'Wed' ? 'Wednesday' : d === 'Thu' ? 'Thursday' : d === 'Fri' ? 'Friday' : d === 'Sat' ? 'Saturday' : 'Sunday';
                                    return timetableRules.workingDays.includes(fullName);
                                });
                                if (firstWorkingDay) setActiveDay(firstWorkingDay);
                            }
                        }
                    });
            } else if (timetableMode === 'college' && selectedCourseId) {
                fetchTimetable({ academicYearId: selectedYearId, courseId: selectedCourseId })
                    .then(data => {
                        if (data && data.schedule) {
                            const fullSchedule = { ...data.schedule };
                            days.forEach(day => {
                                if (!fullSchedule[day]) fullSchedule[day] = [];
                            });
                            setLocalSchedule(fullSchedule);
                        } else {
                            setLocalSchedule({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });
                        }
                        
                        // Auto-select first working day
                        if (timetableRules?.workingDays?.length > 0) {
                            const currentDayFullName = activeDay === 'Mon' ? 'Monday' : activeDay === 'Tue' ? 'Tuesday' : activeDay === 'Wed' ? 'Wednesday' : activeDay === 'Thu' ? 'Thursday' : activeDay === 'Fri' ? 'Friday' : activeDay === 'Sat' ? 'Saturday' : 'Sunday';
                            
                            if (!timetableRules.workingDays.includes(currentDayFullName)) {
                                const firstWorkingDay = days.find(d => {
                                    const fullName = d === 'Mon' ? 'Monday' : d === 'Tue' ? 'Tuesday' : d === 'Wed' ? 'Wednesday' : d === 'Thu' ? 'Thursday' : d === 'Fri' ? 'Friday' : d === 'Sat' ? 'Saturday' : 'Sunday';
                                    return timetableRules.workingDays.includes(fullName);
                                });
                                if (firstWorkingDay) setActiveDay(firstWorkingDay);
                            }
                        }
                    });
            }
        }
    }, [selectedYearId, selectedSectionId, selectedCourseId, timetableMode, timetableRules]);

    // Time Helper Functions
    const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const minutesToTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleAddPeriod = () => {
        let startTime = '09:00';
        let duration = timetableRules?.periodDuration || 45;

        const currentPeriods = localSchedule[activeDay] || [];
        
        if (currentPeriods.length > 0) {
            // Start after the last period
            startTime = currentPeriods[currentPeriods.length - 1].endTime;
        } else if (timetableRules?.startTime) {
            // First period of the day
            startTime = timetableRules.startTime;
        }

        const startMinutes = timeToMinutes(startTime);
        const endMinutes = startMinutes + duration;
        const endTime = minutesToTime(endMinutes);

        const newPeriod = {
            subjectId: '',
            teacherId: '',
            startTime: startTime,
            endTime: endTime,
            room: '',
            type: 'offline'
        };
        setLocalSchedule(prev => ({
            ...prev,
            [activeDay]: [...prev[activeDay], newPeriod]
        }));
    };

    const handleRemovePeriod = (index) => {
        setLocalSchedule(prev => ({
            ...prev,
            [activeDay]: prev[activeDay].filter((_, i) => i !== index)
        }));
    };

    const handleUpdatePeriod = (index, field, value) => {
        setLocalSchedule(prev => {
            const updatedDay = [...prev[activeDay]];
            const currentPeriod = updatedDay[index];
            
            // If subject changes, clear the teacher selection if teacher is not assigned to new subject
            if (field === 'subjectId' && value) {
                const newSubjectId = value;
                const currentTeacherId = currentPeriod.teacherId?._id || currentPeriod.teacherId;
                
                // Check if current teacher is assigned to the new subject
                if (currentTeacherId && !isTeacherAssignedToSubject(currentTeacherId, newSubjectId)) {
                    updatedDay[index] = { ...currentPeriod, [field]: value, teacherId: '' };
                } else {
                    updatedDay[index] = { ...currentPeriod, [field]: value };
                }
            } else {
                updatedDay[index] = { ...currentPeriod, [field]: value };
            }
            
            // Clear validation errors for this row when anything changes
            const errorKey = `${activeDay}-${index}`;
            if (validationErrors[errorKey]) {
                const newErrors = { ...validationErrors };
                delete newErrors[errorKey];
                setValidationErrors(newErrors);
            }
            
            return { ...prev, [activeDay]: updatedDay };
        });
    };

    // Helper to get filtered teachers for a subject
    const getFilteredTeachers = (subjectId) => {
        if (!subjectId) return []; // Return empty if no subject selected
        
        // Find teachers mapped to this subject
        const mappedTeacherIds = teacherMappings
            .filter(m => (m.subjectId?._id || m.subjectId) === subjectId)
            .map(m => m.teacherId?._id || m.teacherId);
            
        if (mappedTeacherIds.length === 0) return []; // Return empty if no teachers mapped to this subject
        
        return teachers.filter(t => mappedTeacherIds.includes(t._id || t.id));
    };

    // Check if teacher is assigned to subject
    const isTeacherAssignedToSubject = (teacherId, subjectId) => {
        if (!teacherId || !subjectId) return true;
        
        const isMapped = teacherMappings.some(m => 
            (m.teacherId?._id || m.teacherId) === teacherId && 
            (m.subjectId?._id || m.subjectId) === subjectId
        );
        
        return isMapped;
    };

    // Time Validation Helpers
    const isTimeWithinRules = (startTime, endTime) => {
        if (!timetableRules || !startTime || !endTime) return { valid: true };

        const ruleStartMins = timeToMinutes(timetableRules.startTime || '08:00');
        const ruleEndMins = timeToMinutes(timetableRules.endTime || '15:30');
        const startMins = timeToMinutes(startTime);
        const endMins = timeToMinutes(endTime);

        if (startMins < ruleStartMins) return { valid: false, message: `Start time cannot be before ${timetableRules.startTime}` };
        if (endMins > ruleEndMins) return { valid: false, message: `End time cannot be after ${timetableRules.endTime}` };
        if (startMins >= endMins) return { valid: false, message: `Start time must be before end time` };

        return { valid: true };
    };

    const handleSave = async () => {
        if (!selectedYearId || !selectedBranchId) {
            alert('Please select Academic Year and Branch');
            return;
        }

        // For school: require classId and sectionId, for college: require courseId
        if (timetableMode === 'school' && (!selectedClassId || !selectedSectionId)) {
            alert('Please select Class and Section');
            return;
        }

        if (timetableMode === 'college' && !selectedCourseId) {
            alert('Please select Course');
            return;
        }

        // Validate all periods
        const newErrors = {};
        let hasError = false;

        Object.keys(localSchedule).forEach(day => {
            // Check if day is a working day
            if (timetableRules?.workingDays && !timetableRules.workingDays.includes(day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday')) {
                if (localSchedule[day].length > 0) {
                    newErrors[`${day}-day`] = `${day} is marked as a non-working day in Timetable Rules.`;
                    hasError = true;
                }
            }

            localSchedule[day].forEach((period, index) => {
                // 1. Teacher Assignment Validation
                if (period.subjectId && period.teacherId) {
                    const isValid = isTeacherAssignedToSubject(
                        period.teacherId?._id || period.teacherId, 
                        period.subjectId?._id || period.subjectId
                    );
                    if (!isValid) {
                        newErrors[`${day}-${index}`] = "Teacher is not assigned to this subject in Teacher-Subject Mapping";
                        hasError = true;
                    }
                }

                // 2. Time Range Validation (Rules)
                const timeValidation = isTimeWithinRules(period.startTime, period.endTime);
                if (!timeValidation.valid) {
                    newErrors[`${day}-${index}-time`] = timeValidation.message;
                    hasError = true;
                }

                // 3. Period Duration Validation
                if (period.startTime && period.endTime && timetableRules?.periodDuration) {
                    const startMins = timeToMinutes(period.startTime);
                    const endMins = timeToMinutes(period.endTime);
                    const duration = endMins - startMins;
                    const expectedDuration = timetableRules.periodDuration;
                    if (Math.abs(duration - expectedDuration) > 5) { // Allow 5 min tolerance
                        newErrors[`${day}-${index}-duration`] = `Period duration should be ${expectedDuration} minutes (currently ${duration} min)`;
                        hasError = true;
                    }
                }
            });

            // 4. Max Periods Per Day Validation (Student)
            if (timetableRules?.maxPeriodsStudent && localSchedule[day].length > timetableRules.maxPeriodsStudent) {
                newErrors[`${day}-max-periods`] = `Maximum ${timetableRules.maxPeriodsStudent} periods allowed per day`;
                hasError = true;
            }

            // 5. Teacher Overlap Validation
            if (timetableRules?.preventTeacherOverlap !== false) {
                const teacherPeriods = {};
                localSchedule[day].forEach((period, index) => {
                    const teacherId = period.teacherId?._id || period.teacherId;
                    if (teacherId && period.startTime && period.endTime) {
                        if (!teacherPeriods[teacherId]) {
                            teacherPeriods[teacherId] = [];
                        }
                        teacherPeriods[teacherId].push({ index, startTime: period.startTime, endTime: period.endTime });
                    }
                });

                Object.keys(teacherPeriods).forEach(teacherId => {
                    const periods = teacherPeriods[teacherId];
                    for (let i = 0; i < periods.length; i++) {
                        for (let j = i + 1; j < periods.length; j++) {
                            const p1 = periods[i];
                            const p2 = periods[j];
                            const start1 = timeToMinutes(p1.startTime);
                            const end1 = timeToMinutes(p1.endTime);
                            const start2 = timeToMinutes(p2.startTime);
                            const end2 = timeToMinutes(p2.endTime);

                            if ((start1 < end2 && end1 > start2)) {
                                newErrors[`${day}-${p1.index}-overlap`] = "Teacher has overlapping periods";
                                newErrors[`${day}-${p2.index}-overlap`] = "Teacher has overlapping periods";
                                hasError = true;
                            }
                        }
                    }
                });
            }

            // 6. Room Overlap Validation
            if (timetableRules?.preventRoomOverlap !== false) {
                const roomPeriods = {};
                localSchedule[day].forEach((period, index) => {
                    const room = period.room;
                    if (room && period.startTime && period.endTime) {
                        if (!roomPeriods[room]) {
                            roomPeriods[room] = [];
                        }
                        roomPeriods[room].push({ index, startTime: period.startTime, endTime: period.endTime });
                    }
                });

                Object.keys(roomPeriods).forEach(room => {
                    const periods = roomPeriods[room];
                    for (let i = 0; i < periods.length; i++) {
                        for (let j = i + 1; j < periods.length; j++) {
                            const p1 = periods[i];
                            const p2 = periods[j];
                            const start1 = timeToMinutes(p1.startTime);
                            const end1 = timeToMinutes(p1.endTime);
                            const start2 = timeToMinutes(p2.startTime);
                            const end2 = timeToMinutes(p2.endTime);

                            if ((start1 < end2 && end1 > start2)) {
                                newErrors[`${day}-${p1.index}-room-overlap`] = "Room is already booked for this time";
                                newErrors[`${day}-${p2.index}-room-overlap`] = "Room is already booked for this time";
                                hasError = true;
                            }
                        }
                    }
                });
            }

            // 7. Max Consecutive Periods Validation
            if (timetableRules?.maxConsecutive) {
                const sortedPeriods = [...localSchedule[day]]
                    .filter(p => p.startTime && p.endTime)
                    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

                let consecutiveCount = 1;
                let maxConsecutive = 1;
                for (let i = 1; i < sortedPeriods.length; i++) {
                    const prevEnd = timeToMinutes(sortedPeriods[i - 1].endTime);
                    const currStart = timeToMinutes(sortedPeriods[i].startTime);
                    if (currStart <= prevEnd + 15) { // 15 min break tolerance
                        consecutiveCount++;
                        maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
                    } else {
                        consecutiveCount = 1;
                    }
                }

                if (maxConsecutive > timetableRules.maxConsecutive) {
                    newErrors[`${day}-consecutive`] = `Maximum ${timetableRules.maxConsecutive} consecutive periods allowed`;
                    hasError = true;
                }
            }
        });

        // 8. Weekly Validations - Max Periods Per Teacher
        if (timetableRules?.maxPeriodsTeacher) {
            const teacherWeeklyCounts = {};
            Object.keys(localSchedule).forEach(day => {
                localSchedule[day].forEach(period => {
                    const teacherId = period.teacherId?._id || period.teacherId;
                    if (teacherId) {
                        if (!teacherWeeklyCounts[teacherId]) {
                            teacherWeeklyCounts[teacherId] = { count: 0, periods: [] };
                        }
                        teacherWeeklyCounts[teacherId].count++;
                        teacherWeeklyCounts[teacherId].periods.push({ day, teacherId, period });
                    }
                });
            });

            Object.keys(teacherWeeklyCounts).forEach(teacherId => {
                if (teacherWeeklyCounts[teacherId].count > timetableRules.maxPeriodsTeacher) {
                    teacherWeeklyCounts[teacherId].periods.forEach(({ day, period }) => {
                        const periodIndex = localSchedule[day].indexOf(period);
                        if (periodIndex !== -1) {
                            newErrors[`${day}-${periodIndex}-teacher-max`] = `Teacher exceeds weekly limit (${teacherWeeklyCounts[teacherId].count}/${timetableRules.maxPeriodsTeacher})`;
                            hasError = true;
                        }
                    });
                }
            });
        }

        // 9. Weekly Validations - Max Weekly Hours
        if (timetableRules?.maxWeeklyHours) {
            const teacherWeeklyHours = {};
            Object.keys(localSchedule).forEach(day => {
                localSchedule[day].forEach(period => {
                    const teacherId = period.teacherId?._id || period.teacherId;
                    if (teacherId && period.startTime && period.endTime) {
                        if (!teacherWeeklyHours[teacherId]) {
                            teacherWeeklyHours[teacherId] = 0;
                        }
                        const startMins = timeToMinutes(period.startTime);
                        const endMins = timeToMinutes(period.endTime);
                        const durationHours = (endMins - startMins) / 60;
                        teacherWeeklyHours[teacherId] += durationHours;
                    }
                });
            });

            Object.keys(teacherWeeklyHours).forEach(teacherId => {
                if (teacherWeeklyHours[teacherId] > timetableRules.maxWeeklyHours) {
                    // Find all periods for this teacher and mark them
                    Object.keys(localSchedule).forEach(day => {
                        localSchedule[day].forEach((period, index) => {
                            const periodTeacherId = period.teacherId?._id || period.teacherId;
                            if (periodTeacherId === teacherId) {
                                newErrors[`${day}-${index}-weekly-hours`] = `Teacher exceeds weekly hours limit (${teacherWeeklyHours[teacherId].toFixed(1)}h/${timetableRules.maxWeeklyHours}h)`;
                                hasError = true;
                            }
                        });
                    });
                }
            });
        }

        if (hasError) {
            setValidationErrors(newErrors);
            alert('Some assignments are invalid. Please check the highlighted periods.');
            return;
        }

        try {
            // Clean up localSchedule to only include essential IDs for saving
            const cleanedSchedule = {};
            Object.keys(localSchedule).forEach(day => {
                cleanedSchedule[day] = localSchedule[day]
                    .filter(period => period.subjectId) // Only include periods with a subject
                    .map(period => {
                        const subjectId = period.subjectId?._id || period.subjectId;
                        const teacherId = period.teacherId?._id || period.teacherId;
                        
                        // Only include teacherId if it's a valid value (not empty string)
                        const cleanedPeriod = {
                            subjectId: subjectId || null,
                            startTime: period.startTime || '',
                            endTime: period.endTime || '',
                            room: period.room || '',
                            type: period.type || 'offline',
                            link: period.link || ''
                        };
                        
                        // Only add teacherId if it exists and is not empty
                        if (teacherId && teacherId !== '') {
                            cleanedPeriod.teacherId = teacherId;
                        }
                        
                        return cleanedPeriod;
                    });
            });

            // Ensure academicYearId is not empty before sending
            if (!selectedYearId || selectedYearId === '') {
                alert('Please select Academic Year');
                return;
            }

            await saveTimetable({
                academicYearId: selectedYearId,
                branchId: selectedBranchId,
                classId: timetableMode === 'school' ? selectedClassId : null,
                courseId: timetableMode === 'college' ? selectedCourseId : null,
                sectionId: timetableMode === 'school' ? selectedSectionId : null,
                schedule: cleanedSchedule
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Weekly Timetable</h1>
                    <p className="text-gray-500 text-sm">Manage class schedules and teacher assignments</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                    <Save size={18} />
                    Save Timetable
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
                {/* Mode Toggle */}
                <div className="mb-4 flex items-center gap-4 pb-4 border-b border-gray-100">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mode:</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setTimetableMode('school')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                timetableMode === 'school'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <School size={16} />
                            School (Class)
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimetableMode('college')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                timetableMode === 'college'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <GraduationCap size={16} />
                            College (Course)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Branch</label>
                        <select
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Academic Year</label>
                        <select
                            value={selectedYearId}
                            onChange={(e) => setSelectedYearId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            <option value="">Select Academic Year</option>
                            {academicYears.map(y => <option key={y._id} value={y._id}>{y.name}</option>)}
                        </select>
                    </div>

                    {/* School Mode: Class & Section */}
                    {timetableMode === 'school' && (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1 flex items-center gap-1">
                                    <School size={12} />
                                    Class
                                </label>
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Section</label>
                                <select
                                    value={selectedSectionId}
                                    onChange={(e) => setSelectedSectionId(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                    disabled={!selectedClassId}
                                >
                                    <option value="">Select Section</option>
                                    {(sections[selectedClassId] || []).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>
                        </>
                    )}

                    {/* College Mode: Course */}
                    {timetableMode === 'college' && (
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1 flex items-center gap-1">
                                <GraduationCap size={12} />
                                Course/Program
                            </label>
                            <select
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {(timetableMode === 'school' && selectedSectionId) || (timetableMode === 'college' && selectedCourseId) ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Day Tabs */}
                    <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
                        {days.map(day => {
                            const dayFullName = day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday';
                            const isWorkingDay = timetableRules?.workingDays?.includes(dayFullName);
                            
                            return (
                                <button
                                    key={day}
                                    onClick={() => setActiveDay(day)}
                                    className={`px-8 py-4 text-sm font-semibold transition-all border-b-2 shrink-0 relative ${activeDay === day
                                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        } ${!isWorkingDay ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <span>{dayFullName}</span>
                                        {!isWorkingDay && (
                                            <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded uppercase tracking-wider">Off</span>
                                        )}
                                        {isWorkingDay && (
                                            <div className={`w-1 h-1 rounded-full ${activeDay === day ? 'bg-indigo-600' : 'bg-green-400'}`}></div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-6">
                        {/* Day-level validation errors */}
                        {validationErrors[`${activeDay}-day`] && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                                <AlertCircle size={18} />
                                {validationErrors[`${activeDay}-day`]}
                            </div>
                        )}
                        {validationErrors[`${activeDay}-max-periods`] && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                                <AlertCircle size={18} />
                                {validationErrors[`${activeDay}-max-periods`]}
                            </div>
                        )}
                        {validationErrors[`${activeDay}-consecutive`] && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                                <AlertCircle size={18} />
                                {validationErrors[`${activeDay}-consecutive`]}
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-bold text-gray-800">
                                    {activeDay} Schedule
                                </h2>
                                {localSchedule[activeDay]?.length > (timetableRules?.maxPeriodsStudent || 8) && (
                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full border border-amber-100 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        Exceeds Daily Limit ({timetableRules?.maxPeriodsStudent || 8})
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleAddPeriod}
                                className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
                            >
                                <Plus size={16} />
                                Add Period
                            </button>
                        </div>

                        <div className="space-y-4">
                            {localSchedule[activeDay]?.length > 0 ? (
                                localSchedule[activeDay].map((period, index) => (
                                    <div key={index} className={`flex flex-wrap items-end gap-4 p-4 rounded-xl border relative group transition-all ${validationErrors[`${activeDay}-${index}`] ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Subject</label>
                                            <select
                                                value={period.subjectId?._id || period.subjectId || ''}
                                                onChange={(e) => handleUpdatePeriod(index, 'subjectId', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            >
                                                <option value="">Select Subject</option>
                                                {subjects
                                                    .filter(s => {
                                                        // Filter subjects based on mode
                                                        if (timetableMode === 'school') {
                                                            // For school: show subjects assigned to selected class
                                                            return !selectedClassId || (s.classIds || []).some(cid => 
                                                                (cid._id || cid) === selectedClassId
                                                            );
                                                        } else {
                                                            // For college: show subjects assigned to selected course
                                                            return !selectedCourseId || (s.courseIds || []).some(cid => 
                                                                (cid._id || cid) === selectedCourseId
                                                            );
                                                        }
                                                    })
                                                    .map(s => <option key={s._id} value={s._id}>{s.name}</option>)
                                                }
                                            </select>
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Teacher</label>
                                            <select
                                                value={period.teacherId?._id || period.teacherId || ''}
                                                onChange={(e) => handleUpdatePeriod(index, 'teacherId', e.target.value)}
                                                disabled={!period.subjectId?._id && !period.subjectId}
                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all ${
                                                    !isTeacherAssignedToSubject(period.teacherId?._id || period.teacherId, period.subjectId?._id || period.subjectId) 
                                                        ? 'border-red-500 text-red-600' 
                                                        : 'border-gray-200'
                                                } ${!period.subjectId?._id && !period.subjectId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <option value="">
                                                    {!period.subjectId?._id && !period.subjectId 
                                                        ? 'Select Subject First' 
                                                        : getFilteredTeachers(period.subjectId?._id || period.subjectId).length === 0
                                                        ? 'No Teachers Assigned'
                                                        : 'Select Teacher'}
                                                </option>
                                                {/* Show only teachers assigned to the selected subject */}
                                                {getFilteredTeachers(period.subjectId?._id || period.subjectId).map(t => (
                                                    <option key={t._id || t.id} value={t._id || t.id}>
                                                        {t.firstName} {t.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                            {period.subjectId?._id || period.subjectId ? (
                                                getFilteredTeachers(period.subjectId?._id || period.subjectId).length === 0 && (
                                                    <p className="text-[10px] text-amber-600 mt-1 ml-1">
                                                        No teachers assigned to this subject
                                                    </p>
                                                )
                                            ) : null}
                                        </div>

                                        {/* Display all validation errors for this period */}
                                        {(validationErrors[`${activeDay}-${index}`] || 
                                          validationErrors[`${activeDay}-${index}-time`] ||
                                          validationErrors[`${activeDay}-${index}-duration`] ||
                                          validationErrors[`${activeDay}-${index}-overlap`] ||
                                          validationErrors[`${activeDay}-${index}-room-overlap`] ||
                                          validationErrors[`${activeDay}-${index}-teacher-max`] ||
                                          validationErrors[`${activeDay}-${index}-weekly-hours`]) && (
                                            <div className="absolute -bottom-5 left-4 text-[10px] font-bold text-red-500 space-y-0.5 max-w-[300px]">
                                                {validationErrors[`${activeDay}-${index}`] && (
                                                    <div>{validationErrors[`${activeDay}-${index}`]}</div>
                                                )}
                                                {validationErrors[`${activeDay}-${index}-time`] && (
                                                    <div>{validationErrors[`${activeDay}-${index}-time`]}</div>
                                                )}
                                                {validationErrors[`${activeDay}-${index}-duration`] && (
                                                    <div>{validationErrors[`${activeDay}-${index}-duration`]}</div>
                                                )}
                                                {validationErrors[`${activeDay}-${index}-overlap`] && (
                                                    <div>{validationErrors[`${activeDay}-${index}-overlap`]}</div>
                                                )}
                                                {validationErrors[`${activeDay}-${index}-room-overlap`] && (
                                                    <div>{validationErrors[`${activeDay}-${index}-room-overlap`]}</div>
                                                )}
                                                {validationErrors[`${activeDay}-${index}-teacher-max`] && (
                                                    <div>{validationErrors[`${activeDay}-${index}-teacher-max`]}</div>
                                                )}
                                                {validationErrors[`${activeDay}-${index}-weekly-hours`] && (
                                                    <div>{validationErrors[`${activeDay}-${index}-weekly-hours`]}</div>
                                                )}
                                            </div>
                                        )}

                                        <div className="w-32">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Start Time</label>
                                            <input
                                                type="time"
                                                value={period.startTime}
                                                onChange={(e) => handleUpdatePeriod(index, 'startTime', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>

                                        <div className="w-32">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">End Time</label>
                                            <input
                                                type="time"
                                                value={period.endTime}
                                                onChange={(e) => handleUpdatePeriod(index, 'endTime', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>

                                        <div className="w-32">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Room/Link</label>
                                            <input
                                                type="text"
                                                placeholder={period.type === 'online' ? 'Meet Link' : 'Room No'}
                                                value={period.room || period.link || ''}
                                                onChange={(e) => handleUpdatePeriod(index, period.type === 'online' ? 'link' : 'room', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            />
                                        </div>

                                        <div className="w-32">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Type</label>
                                            <select
                                                value={period.type}
                                                onChange={(e) => handleUpdatePeriod(index, 'type', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                            >
                                                <option value="offline">Offline</option>
                                                <option value="online">Online</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={() => handleRemovePeriod(index)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <Clock className="mx-auto text-gray-300 mb-3" size={40} />
                                    <p className="text-gray-500 font-medium">No periods added for this day</p>
                                    <button
                                        onClick={handleAddPeriod}
                                        className="text-indigo-600 text-sm font-bold mt-2 hover:underline"
                                    >
                                        Add your first period
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Filter className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Select Context</h3>
                    <p className="text-gray-500">
                        {timetableMode === 'school' 
                            ? 'Please select a class and section to manage the timetable'
                            : 'Please select a course to manage the timetable'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default WeeklyTimetable;
