import React, { useState, useEffect, useRef } from 'react';
import { 
    BookOpen, User, Calendar, CheckCircle, 
    ArrowRightLeft, Search, Clock, AlertCircle, 
    Bookmark, ChevronDown, X 
} from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';
import { format, addDays } from 'date-fns';
import { twMerge } from 'tailwind-merge';

const BookIssuance = () => {
    const { 
        books, fetchBooks,
        libraryMembers, fetchLibraryMembers,
        issueBook,
        branches, fetchBranches
    } = useAdminStore();

    const [branchId, setBranchId] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [dueDate, setDueDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
    
    // Search & Dropdown State
    const [searchBook, setSearchBook] = useState('');
    const [searchMember, setSearchMember] = useState('');
    const [showBookDropdown, setShowBookDropdown] = useState(false);
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);

    // Refs for outside click detection
    const bookRef = useRef(null);
    const memberRef = useRef(null);

    useEffect(() => {
        fetchBranches();
        
        const handleClickOutside = (event) => {
            if (bookRef.current && !bookRef.current.contains(event.target)) setShowBookDropdown(false);
            if (memberRef.current && !memberRef.current.contains(event.target)) setShowMemberDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [fetchBranches]);

    useEffect(() => {
        if (branchId) {
            fetchBooks({ branchId });
            fetchLibraryMembers({ branchId });
        }
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
        setSearchBook('');
        setSearchMember('');
    };

    return (
        <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen font-['Inter']">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg ring-4 ring-indigo-50">
                            <ArrowRightLeft size={24} />
                        </div>
                        Book Issuance
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Lend books to students and staff members</p>
                </div>

                <div className="w-full md:w-64">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1">Active Branch</label>
                    <select 
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 transition-all outline-none text-sm font-semibold shadow-sm"
                    >
                        <option value="">Choose Branch</option>
                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Member Selection */}
                    <div className="space-y-2 relative" ref={memberRef}>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Student / Member</label>
                        {!selectedMember ? (
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Search student by name or card no..."
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-emerald-500 transition-all outline-none text-sm font-medium"
                                    value={searchMember}
                                    onChange={(e) => {
                                        setSearchMember(e.target.value);
                                        setShowMemberDropdown(true);
                                    }}
                                    onFocus={() => setShowMemberDropdown(true)}
                                    disabled={!branchId}
                                />
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-emerald-900 uppercase">
                                            {selectedMember.memberType === 'student' 
                                                ? `${selectedMember.studentId?.firstName} ${selectedMember.studentId?.lastName}` 
                                                : `${selectedMember.teacherId?.firstName} ${selectedMember.teacherId?.lastName}`}
                                        </div>
                                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">ID: {selectedMember.libraryCardNo}</div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedMember(null)} className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-500 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        )}

                        {showMemberDropdown && !selectedMember && branchId && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                {filteredMembers.length > 0 ? filteredMembers.map(m => {
                                    const name = m.memberType === 'student' 
                                        ? `${m.studentId?.firstName} ${m.studentId?.lastName}` 
                                        : `${m.teacherId?.firstName} ${m.teacherId?.lastName}`;
                                    return (
                                        <button 
                                            key={m._id}
                                            onClick={() => {
                                                setSelectedMember(m);
                                                setShowMemberDropdown(false);
                                            }}
                                            className="w-full px-5 py-3 text-left hover:bg-slate-50 flex items-center justify-between group border-b border-gray-50 last:border-0"
                                        >
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors uppercase">{name}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase">Card No: {m.libraryCardNo}</div>
                                            </div>
                                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded uppercase tracking-wider">{m.memberType}</span>
                                        </button>
                                    );
                                }) : (
                                    <div className="p-8 text-center text-gray-400 text-sm">No members found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Book Selection */}
                    <div className="space-y-2 relative" ref={bookRef}>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Select Book</label>
                        {!selectedBook ? (
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Search book by title or author..."
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                                    value={searchBook}
                                    onChange={(e) => {
                                        setSearchBook(e.target.value);
                                        setShowBookDropdown(true);
                                    }}
                                    onFocus={() => setShowBookDropdown(true)}
                                    disabled={!branchId}
                                />
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                                        <Bookmark size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-indigo-900 uppercase">{selectedBook.title}</div>
                                        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">By {selectedBook.author}</div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedBook(null)} className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-500 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        )}

                        {showBookDropdown && !selectedBook && branchId && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                {filteredBooks.length > 0 ? filteredBooks.map(b => (
                                    <button 
                                        key={b._id}
                                        onClick={() => {
                                            setSelectedBook(b);
                                            setShowBookDropdown(false);
                                        }}
                                        className="w-full px-5 py-3 text-left hover:bg-slate-50 flex items-center justify-between group border-b border-gray-50 last:border-0"
                                    >
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase">{b.title}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">By {b.author}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-indigo-500 uppercase">{b.availableQuantity} available</div>
                                            <div className="text-[9px] font-bold text-gray-300">#{b.isbn || 'NO-ISBN'}</div>
                                        </div>
                                    </button>
                                )) : (
                                    <div className="p-8 text-center text-gray-400 text-sm">No books found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Issue Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                readOnly
                                value={format(new Date(), 'dd MMMM, yyyy')}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 cursor-default"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Due Date</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                            <input 
                                type="date"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:border-indigo-500 transition-all outline-none text-sm font-bold shadow-sm"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4">
                    <button 
                        onClick={handleIssue}
                        disabled={!selectedBook || !selectedMember}
                        className={twMerge(
                            "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl",
                            selectedBook && selectedMember 
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100" 
                                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                        )}
                    >
                        {selectedBook && selectedMember ? (
                            <>
                                <CheckCircle size={20} />
                                Confirm & Issue Book
                            </>
                        ) : (
                            "Select Student & Book to Continue"
                        )}
                    </button>
                </div>
            </div>

            {/* Selection Summary Floating Badge (Mobile/Small Screens) */}
            {selectedBook && selectedMember && (
                <div className="fixed bottom-6 left-6 right-6 md:hidden">
                    <div className="bg-indigo-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                        <div className="text-xs font-bold">
                            Ready to issue <span className="text-amber-400">{selectedBook.title}</span>
                        </div>
                        <button onClick={handleIssue} className="bg-white text-indigo-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Confirm</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookIssuance;
