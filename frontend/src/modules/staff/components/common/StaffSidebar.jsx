
import React from 'react';

const StaffSidebar = () => {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-indigo-900">EduCRM Staff</h1>
            </div>
            <nav className="mt-6 px-4 space-y-2">
                {/* Menu items will be mapped here using menuConfig */}
                <div className="p-2 text-gray-500 text-sm">Target Menu Here</div>
            </nav>
        </aside>
    );
};

export default StaffSidebar;