
import React from 'react';
import { Book, Edit, Ban, ArchiveRestore } from 'lucide-react';
import SubjectStatusBadge from './SubjectStatusBadge';

const SubjectsTable = ({ subjects, allClasses = [], allCourses = [], onEdit, onDeactivate, onReactivate }) => {

    const getClassName = (cls) => {
        if (typeof cls === 'object' && cls.name) return cls.name;
        const found = allClasses.find(c => (c._id || c.id) === cls);
        return found ? found.name : (typeof cls === 'string' ? `ID: ${cls.slice(-6)}` : 'Unknown');
    };

    const getCourseName = (course) => {
        if (typeof course === 'object' && course.name) return course.name;
        const found = allCourses.find(c => (c._id || c.id) === course);
        return found ? found.name : (typeof course === 'string' ? `ID: ${course.slice(-6)}` : 'Unknown');
    };

    const getAssignedItems = (sub) => {
        const classes = (sub.classIds || sub.assignedClasses || []).filter(Boolean);
        const courses = (sub.courseIds || []).filter(Boolean);
        const items = [
            ...classes.map(c => ({ name: getClassName(c), type: 'class' })),
            ...courses.map(c => ({ name: getCourseName(c), type: 'course' }))
        ];
        return items;
    };

    if (!subjects || subjects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Book className="text-gray-400" size={32} />
                </div>
                <h3 className="text-gray-900 font-medium">No Subjects Defined</h3>
                <p className="text-gray-500 text-sm mt-1">Create subjects to build your curriculum.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-100 border-b-2 border-gray-200 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Code & Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Assigned Classes</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm bg-white">
                        {subjects.map((sub) => (
                            <tr key={sub._id || sub.id} className="group hover:bg-indigo-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">{sub.name}</span>
                                        <span className="text-xs text-gray-400 font-mono">{sub.code}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs capitalize">
                                        {sub.type?.replace('_', ' + ') || 'Theory'}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                        {(() => {
                                            const items = getAssignedItems(sub);
                                            if (items.length === 0) {
                                                return <span className="text-gray-400 text-xs italic">Unassigned</span>;
                                            }
                                            return (
                                                <>
                                                    {items.slice(0, 3).map((item, idx) => (
                                                        <span key={idx} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] border border-blue-100">
                                                            {item.name}
                                                        </span>
                                                    ))}
                                                    {items.length > 3 && (
                                                        <span className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                                                            +{items.length - 3} more
                                                        </span>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <SubjectStatusBadge status={sub.status} />
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(sub); }}
                                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit Details"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        {sub.status === 'active' ? (
                                            onDeactivate && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeactivate(sub); }}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Deactivate"
                                                >
                                                    <Ban size={16} />
                                                </button>
                                            )
                                        ) : (
                                            onReactivate && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onReactivate(sub); }}
                                                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Activate"
                                                >
                                                    <ArchiveRestore size={16} />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubjectsTable;
