import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, StickyNote, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-orange-50/50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 z-30 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b">
                        <h1 className="text-xl font-bold text-primary-600">NoteApp</h1>
                        <p className="text-sm text-slate-500 mt-1 truncate">Hello, {user?.name}</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        <Link
                            to="/"
                            className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <Home size={20} />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <StickyNote size={20} />
                            <span>My Notes</span>
                        </Link>
                    </nav>

                    <div className="p-4 border-t">
                        <Button
                            variant="secondary"
                            className="w-full flex items-center justify-center space-x-2"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between z-10">
                    <h1 className="font-bold text-lg">NoteApp</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2">
                        <Menu size={24} />
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
