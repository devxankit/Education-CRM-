import React, { useState } from 'react';
import { Book, Plus, Search, Filter, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import LibraryStats from './components/LibraryStats';
import { mockBooks, libraryStats } from '../../data/libraryData';

const BooksCatalog = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const stats = [
        { label: 'Total Books', value: libraryStats.totalBooks, icon: Book, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { label: 'Available', value: '3,240', icon: BookOpen, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { label: 'Low Stock', value: libraryStats.overdueBooks, icon: Clock, bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
        { label: 'New Arrivals', value: libraryStats.newArrivals, icon: Plus, bgColor: 'bg-purple-50', iconColor: 'text-purple-600' }
    ];

    const filteredBooks = mockBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'In Stock': return 'bg-green-100 text-green-700';
            case 'Low Stock': return 'bg-amber-100 text-amber-700';
            case 'Out of Stock': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex flex-col pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Books Catalog</h1>
                    <p className="text-gray-500 text-sm">Manage library inventory and track book availability.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium transition-all">
                    <Plus size={18} /> Add New Book
                </button>
            </div>

            <LibraryStats stats={stats} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, author, or ISBN..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all">
                        <Filter size={18} /> Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Book Title</th>
                                <th className="px-6 py-4 font-semibold">Author</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">ISBN</th>
                                <th className="px-6 py-4 font-semibold text-center">Qty</th>
                                <th className="px-6 py-4 font-semibold">Rack</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBooks.map((book) => (
                                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{book.title}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{book.author}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                                            {book.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{book.isbn}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-900">{book.available}</span>
                                            <span className="text-gray-400">/{book.total}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{book.rack}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(book.status)}`}>
                                            {book.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BooksCatalog;
