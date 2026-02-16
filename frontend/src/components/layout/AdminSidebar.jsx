import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FolderOpen, ShoppingBag, CreditCard, Users, ArrowLeft, X } from 'lucide-react';

const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminSidebar({ isOpen, onClose }) {
    const location = useLocation();

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            {/* Mobile Close Button */}
            <div className="admin-sidebar-close-row">
                <button onClick={onClose} className="admin-sidebar-close-btn">
                    <X size={20} />
                </button>
            </div>
            <Link to="/" className="admin-sidebar-back">
                <ArrowLeft size={14} /> Back to shop
            </Link>
            <nav className="admin-sidebar-nav">
                {links.map(({ to, label, icon: Icon, exact }) => {
                    const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                    return (
                        <Link key={to} to={to} className={`admin-nav-item ${active ? 'active' : ''}`}>
                            <Icon size={18} /> {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

