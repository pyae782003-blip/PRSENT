import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { AdminRoute } from '../auth/ProtectedRoute';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <AdminRoute>
            <div className="admin-layout">
                {/* Mobile Header */}
                <div className="admin-mobile-header">
                    <div className="admin-mobile-title">Admin Dashboard</div>
                    <button
                        className="admin-menu-btn"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Sidebar Backdrop */}
                {sidebarOpen && (
                    <div
                        className="admin-sidebar-overlay"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <AdminSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </AdminRoute>
    );
}
