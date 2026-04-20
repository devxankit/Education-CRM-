import React, { useState, useEffect } from 'react';
import { BookOpen, User, Calendar, CheckCircle, ArrowRightLeft, Search, Clock, AlertCircle, Bookmark } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { format, addDays } from 'date-fns';

const BookIssuance = () => {
    const { 
        books, fetchBooks,
        libraryMembers, fetchLibraryMembers,
        issueBook, returnBook,
        branches, fetchBranches
    } = useAdminStore();

    const [branchId, setBranchId] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [dueDate, setDueDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
    const [searchBook, setSearchBook] = useState('');
    const [searchMember, setSearchMember] = useState('');

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        if (branchId) {
            fetchBooks({ branchId });
            fetchLibraryMembers({ branchId });
        }
        // Clear selection when branch changes
        setSelectedBook(null);
        setSelectedMember(null);
    }, [branchId, fetchBooks, fetchLibraryMembers]);

    const filteredBooks = books.filter(b => 
        (b.title.toLowerCase().includes(searchBook.toLowerCase()) || b.isbn.includes(searchBook)) && b.availableQuantity > 0
    );

    const filteredMembers = libraryMembers.filter(m => {
        const name = m.memberType === 'student' 
                ? `${m.studentId?.firstName} ${m.studentId?.lastName}` 
                : `${m.teacherId?.firstName} ${m.teacherId?.lastName}`;
        return name.toLowerCase().includes(searchMember.toLowerCase()) || m.libraryCardNo.includes(searchMember);
    });

    const handleIssue = async () => {
        if (!branchId) return alert('Please select a branch first');
        if (!selectedBook || !selectedMember) return;
        await issueBook({
            bookId: selectedBook._id,
            memberId: selectedMember._id,
            dueDate,
            branchId
        });
        setSelectedBook(null);
        setSelectedMember(null);
    };

    return (
        <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen font-['Inter']">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg ring-4 ring-indigo-50">
                        <ArrowRightLeft size={24} />
                    </div>
                    Book Issuance
                </h1>
                <p className="text-gray-500 text-sm mt-1 font-medium">Issue books to members and track loan periods.</p>
            </div>

            {/* Branch Selection */}
            <div className="max-w-xs">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1">Select Active Branch</label>
                <select 
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 transition-all outline-none text-sm font-semibold shadow-sm"
                >
                    <option value="">Choose a branch...</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Book Selection Side */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 min-h-[400px]">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen size={18} className="text-indigo-500" />
                                1. Select Book
                            </h3>
                            {selectedBook && (
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Selected</span>
                            )}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Search by title or ISBN..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                                value={searchBook}
                                onChange={(e) => setSearchBook(e.target.value)}
                            />
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {filteredBooks.map(book => (
                                <button 
                                    key={book._id}
                                    onClick={() => setSelectedBook(book)}
                                    className={`w-full text-left p-3 rounded-2xl border transition-all ${selectedBook?._id === book._id ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' : 'border-gray-50 hover:border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <div className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">{book.title}</div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">By {book.author}</span>
                                        <span className="text-[10px] font-black text-indigo-500">{book.availableQuantity} left</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Member Selection Side */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 min-h-[400px]">
                    <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <User size={18} className="text-emerald-500" />
                                2. Select Member
                            </h3>
                            {selectedMember && (
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Selected</span>
                            )}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Search by name or card number..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 transition-all outline-none text-sm font-medium"
                                value={searchMember}
                                onChange={(e) => setSearchMember(e.target.value)}
                            />
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {filteredMembers.map(member => {
                                const name = member.memberType === 'student' 
                                    ? `${member.studentId?.firstName} ${member.studentId?.lastName}` 
                                    : `${member.teacherId?.firstName} ${member.teacherId?.lastName}`;
                                return (
                                    <button 
                                        key={member._id}
                                        onClick={() => setSelectedMember(member)}
                                        className={`w-full text-left p-3 rounded-2xl border transition-all ${selectedMember?._id === member._id ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-gray-50 hover:border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <div className="font-bold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors uppercase">{name}</div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">#{member.libraryCardNo}</span>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase">{member.memberType}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Issuance Summary & Confirm */}
            {selectedBook && selectedMember && (
                <div className="bg-indigo-600 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 animate-in slide-in-from-bottom-5 duration-500 shadow-2xl shadow-indigo-200">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/20 rounded-[28px] backdrop-blur-md hidden sm:block">
                            <Bookmark size={32} />
                        </div>
                        <div>
                            <div className="text-sm font-black uppercase tracking-[0.2em] opacity-60 mb-1">Issue Confirmation</div>
                            <h2 className="text-xl font-black">
                                Issuing <span className="text-amber-300">"{selectedBook.title}"</span> to <span className="text-emerald-300">{selectedMember.memberType === 'student' ? selectedMember.studentId?.firstName : selectedMember.teacherId?.firstName}</span>
                            </h2>
                            <div className="mt-2 flex items-center gap-4 text-xs font-bold text-indigo-100">
                                <span className="flex items-center gap-1.5"><Calendar size={14} /> Today: {format(new Date(), 'dd MMM')}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} /> Due: {format(new Date(dueDate), 'dd MMM')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="space-y-1 w-full sm:w-40">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 ml-1">Return Due Date</label>
                            <input 
                                type="date"
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm font-bold focus:bg-white focus:text-gray-900 transition-all outline-none"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handleIssue}
                            className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-xl w-full sm:w-auto"
                        >
                            Confirm Issue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookIssuance;
