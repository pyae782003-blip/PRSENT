import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => { await logout(); navigate('/'); setMenuOpen(false); };
    const close = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo" onClick={close}>
                    <img src="/logo.png" alt="Artisan's Memories" className="navbar-logo-img" />
                    <div>
                        <div className="navbar-logo-text">Artisan's Memories</div>
                        <div className="navbar-logo-sub">Handcrafted Treasures</div>
                    </div>
                </Link>

                {/* Desktop nav links */}
                <div className="navbar-links navbar-desktop">
                    <Link to="/products" className="navbar-link">Products</Link>
                    {user && <Link to="/orders" className="navbar-link">Orders</Link>}
                    {isAdmin && (
                        <Link to="/admin" className="navbar-admin-btn">
                            <Shield size={12} /> Admin
                        </Link>
                    )}
                </div>

                <div className="navbar-actions">
                    {user && (
                        <>
                            <Link to="/favorites" className="navbar-icon-btn"><Heart size={18} /></Link>
                            <Link to="/cart" className="navbar-icon-btn">
                                <ShoppingCart size={18} />
                                {totalItems > 0 && <span className="navbar-badge">{totalItems}</span>}
                            </Link>
                        </>
                    )}

                    {/* Desktop user section */}
                    <span className="navbar-desktop">
                        {user ? (
                            <>
                                <span className="navbar-divider" />
                                <Link to="/profile" className="navbar-user">
                                    <span className="navbar-avatar"><User size={13} /></span>
                                    <span className="truncate">{user.name}</span>
                                </Link>
                                <button onClick={handleLogout} className="navbar-icon-btn">
                                    <LogOut size={15} />
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="navbar-divider" />
                                <Link to="/login" className="navbar-link">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                            </>
                        )}
                    </span>

                    {/* Hamburger button - mobile only */}
                    <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu drawer */}
            {menuOpen && (
                <>
                    <div className="mobile-overlay" onClick={close} />
                    <div className="mobile-drawer">
                        <div className="mobile-drawer-header">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {user ? (
                                    <div className="mobile-user-info">
                                        <div className="navbar-avatar" style={{ width: '36px', height: '36px' }}><User size={16} /></div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
                                            <div style={{ fontSize: '12px', color: '#737373' }}>{user.email}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '14px', color: '#737373' }}>Welcome to Artisan's Memories</div>
                                )}
                                <button onClick={close} className="hamburger-btn" style={{ display: 'flex' }} aria-label="Close menu">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="mobile-drawer-body">
                            <Link to="/products" className="mobile-link" onClick={close}>
                                <ShoppingCart size={18} /> Products
                            </Link>
                            {user && (
                                <>
                                    <Link to="/orders" className="mobile-link" onClick={close}>
                                        <ShoppingCart size={18} /> My Orders
                                    </Link>
                                    <Link to="/favorites" className="mobile-link" onClick={close}>
                                        <Heart size={18} /> Favorites
                                    </Link>
                                    <Link to="/cart" className="mobile-link" onClick={close}>
                                        <ShoppingCart size={18} /> Cart
                                        {totalItems > 0 && <span className="badge badge-dark" style={{ marginLeft: 'auto' }}>{totalItems}</span>}
                                    </Link>
                                    <Link to="/profile" className="mobile-link" onClick={close}>
                                        <User size={18} /> Profile
                                    </Link>
                                </>
                            )}
                            {isAdmin && (
                                <Link to="/admin" className="mobile-link" onClick={close}>
                                    <Shield size={18} /> Admin Panel
                                </Link>
                            )}
                        </div>

                        <div className="mobile-drawer-footer">
                            {user ? (
                                <button className="mobile-link mobile-link-danger" onClick={handleLogout}>
                                    <LogOut size={18} /> Sign Out
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link to="/login" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={close}>Login</Link>
                                    <Link to="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={close}>Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
