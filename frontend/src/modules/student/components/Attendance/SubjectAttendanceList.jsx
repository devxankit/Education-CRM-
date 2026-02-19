import React from 'react';
import SubjectAttendanceRow from './SubjectAttendanceRow';

const SubjectAttendanceList = ({ subjects }) => {
    const sortedSubjects = [...subjects].sort((a, b) => a.percentage - b.percentage);

    return (
    <></>
    );
};

export default SubjectAttendanceList;
