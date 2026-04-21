import React, { useState, useEffect } from 'react';
import { 
    BookOpen, 
    Search, 
    Calendar, 
    User,
    CheckCircle,
    Info,
    ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/app/api';

const LibraryIssueBook = () => {
    const [formData, setFormData] = useState({
        memberId: '',
        bookId: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: ''
    });
    const [members, setMembers] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState({ member: '', book: '' });
    
    // Visibility states for dropdowns
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);
    const [showBookDropdown, setShowBookDropdown] = useState(false);

    useEffect(() => {
        fetchMembers();
        fetchBooks();
        // Set default due date to 7 days from now
        const defaultDue = new Date();
        defaultDue.setDate(defaultDue.getDate() + 7);
        setFormData(prev => ({ ...prev, dueDate: defaultDue.toISOString().split('T')[0] }));
    }, []);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/library/members`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) setMembers(response.data.data);
        } catch (error) {
            toast.error("Failed to load members");
        }
    };

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/library/books`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) setBooks(response.data.data.filter(b => b.availableQuantity > 0));
        } catch (error) {
            toast.error("Failed to load books");
        }
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        if (!formData.memberId || !formData.bookId) {
            return toast.error("Please select both student and book");
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/library/issue`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Book issued successfully!");
                setFormData({
                    ...formData,
                    memberId: '',
                    bookId: ''
                });
                setSearchTerm({ member: '', book: '' }); // Reset search terms
                fetchBooks(); // Refresh book list for availability
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to issue book");
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members.filter(m => {
        const student = m.studentId;
        const name = `${student?.firstName || ''} ${student?.lastName || ''}`.toLowerCase();
        return name.includes(searchTerm.member.toLowerCase()) || m.libraryCardNo.includes(searchTerm.member);
    });

    const filteredBooks = books.filter(b => 
        b.title.toLowerCase().includes(searchTerm.book.toLowerCase()) || 
        b.author.toLowerCase().includes(searchTerm.book.toLowerCase())
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Issue New Book</h1>
                <p className="text-gray-500 mt-1">Lend books to students and staff members</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleIssue} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        {/* Member Selection */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Student / Member</label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Search student by name or card no..."
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                    value={searchTerm.member}
                                    onFocus={() => setShowMemberDropdown(true)}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setSearchTerm({ ...searchTerm, member: e.target.value });
                                        setShowMemberDropdown(true);
                                    }}
                                />
                                {showMemberDropdown && filteredMembers.length > 0 && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto">
                                        {filteredMembers.map(m => (
                                            <button
                                                key={m._id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, memberId: m._id });
                                                    setSearchTerm({ ...searchTerm, member: `${m.studentId?.firstName} ${m.studentId?.lastName} (${m.libraryCardNo})` });
                                                    setShowMemberDropdown(false);
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-indigo-50 flex items-center justify-between group transition-colors"
                                            >
                                                <div className="text-sm">
                                                    <span className="font-bold text-gray-900">{m.studentId?.firstName} {m.studentId?.lastName}</span>
                                                    <span className="ml-2 text-indigo-500 font-medium">#{m.libraryCardNo}</span>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-200 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Book Selection */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Book</label>
                            <div className="relative group">
                                <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Search book by title or author..."
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                    value={searchTerm.book}
                                    onFocus={() => setShowBookDropdown(true)}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setSearchTerm({ ...searchTerm, book: e.target.value });
                                        setShowBookDropdown(true);
                                    }}
                                />
                                {showBookDropdown && filteredBooks.length > 0 && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto">
                                        {filteredBooks.map(b => (
                                            <button
                                                key={b._id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, bookId: b._id });
                                                    setSearchTerm({ ...searchTerm, book: b.title });
                                                    setShowBookDropdown(false);
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-indigo-50 flex items-center justify-between group transition-colors"
                                            >
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm italic">"{b.title}"</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">By {b.author}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-200 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="date"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        value={formData.issueDate}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="date"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        min={formData.issueDate}
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 active:scale-95 transition-all disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Confirm Book Issuance
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-indigo-900 uppercase text-xs tracking-widest">Issuance Policy</h3>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-indigo-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2"></div>
                                <span className="font-medium">Student limit: 3 books</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-indigo-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2"></div>
                                <span className="font-medium">Duration: Max 14 days</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-indigo-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2"></div>
                                <span className="font-medium">Card mandatory for all</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-indigo-200" />
                        </div>
                        <h4 className="font-bold text-gray-900">Selection Preview</h4>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            {formData.memberId ? "Member Selected" : "Please select a student"} <br/>
                            {formData.bookId ? "Book Selected" : "Please select a book"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryIssueBook;
