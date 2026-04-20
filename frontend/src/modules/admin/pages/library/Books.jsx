import React, { useState, useEffect, useMemo } from 'react';
import { Book as BookIcon, Plus, Search, Filter, BookOpen, Clock, AlertTriangle, LayoutGrid, Building2, Trash2, Edit2 } from 'lucide-react';
import { useAdminStore } from '../../../../store/adminStore';

const BooksCatalog = () => {
    const { 
        books, fetchBooks, 
        branches, fetchBranches,
        addBook
    } = useAdminStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [branchId, setBranchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '', author: '', isbn: '', category: '', 
        quantity: 1, rackNumber: '', publisher: '',
        branchId: ''
    });

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);
            await fetchBooks({ branchId, search: searchTerm });
            setLoading(false);
        };
        loadBooks();
    }, [branchId, searchTerm, fetchBooks]);

    const stats = useMemo(() => {
        return [
            { label: 'Total Books', value: books.reduce((acc, b) => acc + (b.quantity || 0), 0), icon: BookIcon, bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600' },
            { label: 'Available', value: books.reduce((acc, b) => acc + (b.availableQuantity || 0), 0), icon: BookOpen, bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
            { label: 'Issued', value: books.reduce((acc, b) => acc + (b.quantity - b.availableQuantity), 0), icon: Clock, bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
            { label: 'Categories', value: new Set(books.map(b => b.category)).size, icon: LayoutGrid, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' }
        ];
    }, [books]);

    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!newBook.branchId) return alert('Please select a branch');
        await addBook(newBook);
        setShowAddModal(false);
        setNewBook({ title: '', author: '', isbn: '', category: '', quantity: 1, rackNumber: '', publisher: '', branchId: '' });
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Books Catalog</h1>
                    <p className="text-gray-500 text-sm mt-1">Inventory of books available across library branches.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                    <Plus size={18} /> Add New Book
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.iconColor}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title, author, or ISBN..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select 
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm font-semibold"
                    >
                        <option value="">Select Branch</option>
                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Book Details</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ISBN / Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Availability</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading books...</td></tr>
                            ) : books.length > 0 ? (
                                books.map((book) => (
                                    <tr key={book._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-100">
                                                    <BookIcon size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase">{book.title}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">By {book.author}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-gray-700">{book.isbn || 'N/A'}</div>
                                            <div className="text-[10px] font-bold text-indigo-500 uppercase">{book.category}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className={`text-sm font-black ${book.availableQuantity > 0 ? 'text-gray-900' : 'text-rose-500'}`}>
                                                    {book.availableQuantity} / {book.quantity}
                                                </span>
                                                <div className="w-12 bg-gray-100 h-1 rounded-full mt-1 overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all ${book.availableQuantity > 2 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                        style={{ width: `${(book.availableQuantity / book.quantity) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                <LayoutGrid size={12} /> {book.rackNumber || 'Gen-01'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                                                <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No books found. Select a branch or try a different search.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Book Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
                            <h3 className="font-bold">Add New Book to Collection</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">&times;</button>
                        </div>
                        <form onSubmit={handleAddBook} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Select Branch</label>
                                    <select 
                                        required
                                        value={newBook.branchId}
                                        onChange={e => setNewBook({...newBook, branchId: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-xl text-sm font-bold"
                                    >
                                        <option value="">Choose Branch</option>
                                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Book Title</label>
                                    <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-xl text-sm font-medium" 
                                        value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Author</label>
                                    <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-xl text-sm font-medium" 
                                        value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Category</label>
                                    <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-xl text-sm font-medium" 
                                        value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">ISBN</label>
                                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-xl text-sm font-medium" 
                                        value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Quantity</label>
                                    <input type="number" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-xl text-sm font-medium" 
                                        value={newBook.quantity} onChange={e => setNewBook({...newBook, quantity: parseInt(e.target.value)})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Rack Number</label>
                                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-xl text-sm font-medium" 
                                        value={newBook.rackNumber} onChange={e => setNewBook({...newBook, rackNumber: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Publisher</label>
                                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none rounded-xl text-sm font-medium" 
                                        value={newBook.publisher} onChange={e => setNewBook({...newBook, publisher: e.target.value})} />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Add Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BooksCatalog;
