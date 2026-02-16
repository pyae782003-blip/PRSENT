import { useState, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { Badge, Button, Modal, Select, Table, LoadingSpinner, Alert } from '../../components/ui/PixelUI';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'awaiting_payment', 'payment_review', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColor = { pending: 'warning', awaiting_payment: 'warning', payment_review: 'info', confirmed: 'info', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' };

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailOrder, setDetailOrder] = useState(null);

    const load = () => {
        api.get('/admin/orders')
            .then(r => setOrders(r.data.orders || r.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/orders/${id}`, { status });
            toast.success('Order status updated');
            load();
        } catch { toast.error('Failed to update'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this order? This will also remove related items and payments.')) return;
        try {
            await api.delete(`/admin/orders/${id}`);
            toast.success('Order deleted');
            load();
        } catch { toast.error('Failed to delete'); }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">Orders</h1>
            <p className="page-subtitle" style={{ marginBottom: '24px' }}>{orders.length} orders</p>

            <Table headers={['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions']}>
                {orders.map(o => (
                    <tr key={o.id}>
                        <td><span className="text-bold">#{o.id}</span></td>
                        <td>{o.user?.name || '—'}</td>
                        <td>{o.items?.length || 0} items</td>
                        <td>{Number(o.total).toLocaleString()} MMK</td>
                        <td>
                            <select className="form-input" value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                                style={{ width: 'auto', padding: '4px 8px', fontSize: '12px', borderRadius: '8px' }}>
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                            </select>
                        </td>
                        <td className="text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td>
                            <span style={{ display: 'flex', gap: '4px' }}>
                                <button className="btn-icon" title="View details" onClick={() => setDetailOrder(o)}><Eye size={14} /></button>
                                <button className="btn-icon btn-icon-danger" title="Delete" onClick={() => handleDelete(o.id)}><Trash2 size={14} /></button>
                            </span>
                        </td>
                    </tr>
                ))}
            </Table>

            {/* Order Detail Modal */}
            <Modal isOpen={!!detailOrder} onClose={() => setDetailOrder(null)} title={`Order #${detailOrder?.id}`}>
                {detailOrder && (
                    <div>
                        <p><strong>Customer:</strong> {detailOrder.user?.name} ({detailOrder.user?.email})</p>
                        <p><strong>Status:</strong> <Badge variant={statusColor[detailOrder.status]}>{detailOrder.status}</Badge></p>
                        <p><strong>Total:</strong> {Number(detailOrder.total).toLocaleString()} MMK</p>
                        <p><strong>Address:</strong> {detailOrder.shipping_address || '—'}</p>
                        <p><strong>Phone:</strong> {detailOrder.phone || '—'}</p>
                        {detailOrder.notes && <p><strong>Notes:</strong> {detailOrder.notes}</p>}
                        <p><strong>Date:</strong> {new Date(detailOrder.created_at).toLocaleString()}</p>

                        {detailOrder.items?.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                                <strong>Items:</strong>
                                <table style={{ width: '100%', marginTop: '8px', fontSize: '13px' }}>
                                    <thead><tr><th style={{ textAlign: 'left' }}>Product</th><th>Qty</th><th>Price</th></tr></thead>
                                    <tbody>
                                        {detailOrder.items.map((item, i) => (
                                            <tr key={i}>
                                                <td>{item.product?.name || item.product_name || '—'}</td>
                                                <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                                <td style={{ textAlign: 'right' }}>{Number(item.price).toLocaleString()} MMK</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {detailOrder.payment && (
                            <div style={{ marginTop: '16px' }}>
                                <strong>Payment:</strong> <Badge variant={detailOrder.payment.status === 'approved' ? 'success' : detailOrder.payment.status === 'rejected' ? 'danger' : 'warning'}>{detailOrder.payment.status}</Badge>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
