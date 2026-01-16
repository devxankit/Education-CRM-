import React from 'react';
import TeacherHeader from '../components/common/TeacherHeader';
import { teacherProfile } from '../data/dashboardData';

const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <TeacherHeader user={teacherProfile} />
            <main className="max-w-2xl mx-auto px-4 pt-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
                    <p className="text-gray-600">Profile page coming soon...</p>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
