import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Badge, LoadingSpinner, EmptyState } from '../../components/ui/PixelUI';
import api from '../../services/api';

const statusColor = { pending: 'warning', awaiting_payment: 'warning', payment_review: 'info', confirmed: 'info', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' };

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders').then(r => {
            setOrders(r.data.orders || r.data || []);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container page">
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">Track and manage your orders</p>

            {orders.length === 0 ? (
                <EmptyState icon={ShoppingBag} title="No orders yet" description="Your orders will appear here" />
            ) : (
                <div>
                    {orders.map(order => (
                        <Link to={`/orders/${order.id}`} key={order.id} className="order-card">
                            <div className="order-card-header">
                                <span className="order-card-id">Order #{order.id}</span>
                                <Badge variant={statusColor[order.status] || 'default'}>{order.status}</Badge>
                            </div>
                            <div className="order-card-footer">
                                <span className="order-card-meta">
                                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} · {new Date(order.created_at).toLocaleDateString()}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span className="order-card-total">{Number(order.total).toLocaleString()} MMK</span>
                                    <ArrowRight size={14} style={{ color: '#a3a3a3' }} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
