
import React, { useState, useEffect } from 'react';
import { 
    Search, 
    RotateCcw, 
    IndianRupee, 
    Calendar,
    User as UserIcon,
    BookOpen,
    Clock,
    CheckCircle,
    Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { API_URL } from '@/app/api';

const LibraryReturnBook = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(null);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        fetchIssuedBooks();
        fetchSettings();
    }, []);

    const fetchIssuedBooks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/library/issued-books`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setIssuedBooks(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to load issued books");
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/library/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) setSettings(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateFine = (dueDate) => {
        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        if (today <= due) return 0;
        
        const diffTime = Math.abs(today - due);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * (settings?.finePerDay || 5);
    };

    const handleReturn = async (issueId, fineAmount) => {
        if (!window.confirm("Are you sure you want to return this book?")) return;
        
        setProcessing(issueId);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/library/return`, {
                issueId,
                returnDate: new Date(),
                fineAmount,
                remarks: "Returned via Admin Panel"
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Book returned successfully!");
                fetchIssuedBooks(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to return book");
        } finally {
            setProcessing(null);
        }
    };

    const filteredIssues = issuedBooks.filter(issue => {
        const member = issue.memberId;
        const student = member?.studentId;
        const teacher = member?.teacherId;
        const name = (student ? `${student.firstName} ${student.lastName}` : `${teacher?.firstName} ${teacher?.lastName}`).toLowerCase();
        const bookTitle = issue.bookId?.title.toLowerCase();
        const cardNo = member?.libraryCardNo.toLowerCase();

        return name.includes(searchTerm.toLowerCase()) || 
               bookTitle.includes(searchTerm.toLowerCase()) || 
               cardNo.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="p-6 min-h-screen bg-gray-50/30">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Return Books</h1>
                <p className="text-gray-500 mt-1">Accept returns and manage late fee calculations</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <div className="max-w-2xl relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 font-bold" />
                        <input 
                            type="text"
                            placeholder="Enter Student Name / Library Card No / Book Title..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm outline-none font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-indigo-600">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <p className="font-bold text-sm uppercase tracking-widest">Loading Records...</p>
                    </div>
                ) : filteredIssues.length > 0 ? (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIssues.map((issue) => {
                            const fine = calculateFine(issue.dueDate);
                            const memberName = issue.memberId?.memberType === 'student' 
                                ? `${issue.memberId?.studentId?.firstName} ${issue.memberId?.studentId?.lastName}`
                                : `${issue.memberId?.teacherId?.firstName} ${issue.memberId?.teacherId?.lastName}`;

                            return (
                                <div key={issue._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                                     {fine > 0 && (
                                        <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase z-10">
                                            Overdue
                                        </div>
                                     )}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase line-clamp-1">{issue.bookId?.title}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">By {issue.bookId?.author} • ID: #{issue.bookId?._id.toString().slice(-6)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 py-4 border-y border-gray-50 mb-4">
                                        <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                                <UserIcon className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold leading-none">{memberName}</p>
                                                <p className="text-[10px] text-gray-400">Card: {issue.memberId?.libraryCardNo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-[11px] font-bold">Due: {format(new Date(issue.dueDate), 'dd MMM yyyy')}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase">Penalty</span>
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className={`w-4 h-4 ${fine > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
                                                <span className={`text-xl font-black ${fine > 0 ? 'text-red-600' : 'text-gray-900'}`}>{fine.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleReturn(issue._id, fine)}
                                            disabled={processing === issue._id}
                                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-tighter hover:bg-black active:scale-95 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                                        >
                                            {processing === issue._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <RotateCcw className="w-4 h-4" />
                                                    Return Book
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-20 text-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No Issued Books Found</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">Try searching with a different term or check if there are any books currently lent out.</p>
                    </div>
                )}
            </div>
            
            {/* Quick Summary Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-indigo-600 text-white p-6 rounded-[32px] shadow-xl shadow-indigo-200 flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-indigo-100 uppercase">Live Sync</p>
                        <p className="text-xl font-black">{issuedBooks.length} Books Active</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <Clock className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Rules Engaged</p>
                        <p className="text-xl font-black text-gray-900">₹{settings?.finePerDay || 0}/Day Fine</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryReturnBook;
