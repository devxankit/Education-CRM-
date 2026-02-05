import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, FileText, Users, Loader2, Trash2, Edit, BookOpen } from 'lucide-react';
import { useTeacherStore } from '../../../store/teacherStore';

const HomeworkDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const homeworkList = useTeacherStore(state => state.homeworkList);
    const getHomeworkById = useTeacherStore(state => state.getHomeworkById);
    const deleteHomework = useTeacherStore(state => state.deleteHomework);

    const [homework, setHomework] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchHomework = async () => {
            // First check if it's in the list
            const fromList = homeworkList.find(hw => hw._id === id || hw.id === id);
            if (fromList) {
                setHomework(fromList);
                setIsLoading(false);
                return;
            }

            // Otherwise fetch from API
            const data = await getHomeworkById(id);
            if (data) {
                setHomework(data);
            }
            setIsLoading(false);
        };

        fetchHomework();
    }, [id, homeworkList, getHomeworkById]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this homework?')) {
            setIsDeleting(true);
            const success = await deleteHomework(id);
            if (success) {
                navigate('/teacher/homework');
            } else {
                alert('Failed to delete homework');
            }
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!homework) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center">
                    <BookOpen className="mx-auto text-gray-300 mb-3" size={40} />
                    <h2 className="text-xl font-bold text-gray-900">Homework not found</h2>
                    <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-medium">Go Back</button>
                </div>
            </div>
        );
    }

    const className = homework.classId?.name ? `${homework.classId.name}-${homework.sectionId?.name || ''}` : 'N/A';
    const subjectName = homework.subjectId?.name || homework.subject || 'N/A';
    const dueDate = homework.dueDate ? new Date(homework.dueDate).toLocaleDateString() : 'No due date';
    const status = homework.status === 'published' ? 'Active' : homework.status;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Homework Details</h1>
                    </div>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                </div>
            </div>

            <main className="max-w-md mx-auto px-4 pt-6">

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                    <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                            {subjectName}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${status === 'Active' || status === 'published'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                            {status}
                        </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">{homework.title || 'Homework Title'}</h2>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-6">
                        <span className="flex items-center gap-1">
                            <Users size={14} /> Class {className}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> Due: {dueDate}
                        </span>
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Instructions</h3>
                        <p className="whitespace-pre-wrap">
                            {homework.instructions || 'No instructions provided.'}
                        </p>
                    </div>

                    {homework.attachments && homework.attachments.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-900">Attachments</h3>
                            {homework.attachments.map((attachment, index) => (
                                <a
                                    key={index}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                        <FileText size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {attachment.name || `Attachment ${index + 1}`}
                                        </span>
                                        <span className="text-xs text-gray-400">{attachment.size || 'PDF'}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Submissions</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Total Submitted</span>
                        <span className="text-sm font-bold text-gray-900">{homework.submissionCount || 0} / {homework.totalStudents || '--'}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                        <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${homework.totalStudents ? (homework.submissionCount / homework.totalStudents) * 100 : 0}%` }}
                        ></div>
                    </div>
                    <button
                        onClick={() => navigate(`/teacher/homework/${id}/submissions`)}
                        className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        View All Submissions
                    </button>
                </div>

                {/* Posted Date */}
                <div className="mt-4 text-center text-xs text-gray-400">
                    Posted on {new Date(homework.createdAt).toLocaleDateString()}
                </div>

            </main>
        </div>
    );
};

export default HomeworkDetailPage;
