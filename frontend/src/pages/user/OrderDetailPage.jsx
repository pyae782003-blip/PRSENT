import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Gift, Upload } from 'lucide-react';
import { Button, Badge, LoadingSpinner, Alert } from '../../components/ui/PixelUI';
import BankQR from '../../components/svg/BankQR';
import api from '../../services/api';

const statusColor = { pending: 'warning', awaiting_payment: 'warning', payment_review: 'info', confirmed: 'info', processing: 'info', shipped: 'info', delivered: 'success', cancelled: 'danger' };

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        api.get(`/orders/${id}`).then(r => setOrder(r.data.order || r.data)).catch(() => { }).finally(() => setLoading(false));
    }, [id]);

    const handleSlipUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('order_id', id);
        fd.append('payment_slip', file);
        try {
            await api.post('/payments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            const r = await api.get(`/orders/${id}`);
            setOrder(r.data.order || r.data);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.payment_slip?.[0] || err.message || 'Upload failed';
            alert('Upload failed: ' + msg);
            console.error('Payment upload error:', err.response?.data || err);
        }
        finally { setUploading(false); }
    };

    if (loading) return <LoadingSpinner />;
    if (!order) return <div className="container page"><Alert variant="error">Order not found</Alert></div>;

    return (
        <div className="container page">
            <Link to="/orders" className="back-link"><ArrowLeft size={16} /> Back to Orders</Link>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: '4px' }}>Order #{order.id}</h1>
                    <p className="text-sm text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <Badge variant={statusColor[order.status] || 'default'}>{order.status}</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Items */}
                <div className="card-flat" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Items</h3>
                    {order.items?.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                            <div style={{ width: '56px', height: '56px', background: '#fafafa', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Gift size={20} style={{ color: '#d4d4d4' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.product?.name || item.product_name || 'Product'}</div>
                                <div className="text-sm text-muted">Qty: {item.quantity} × {Number(item.price).toLocaleString()} MMK</div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '14px' }}>{(item.quantity * item.price).toLocaleString()} MMK</div>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #171717' }}>
                        <span>Total</span><span>{Number(order.total).toLocaleString()} MMK</span>
                    </div>
                </div>

                {/* Info */}
                <div>
                    <div className="card-flat" style={{ padding: '24px', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Shipping</h3>
                        <p className="text-sm">{order.shipping_address || 'Not provided'}</p>
                        {order.phone && <p className="text-sm text-muted" style={{ marginTop: '4px' }}>{order.phone}</p>}
                        {order.notes && <p className="text-sm text-muted" style={{ marginTop: '4px' }}>{order.notes}</p>}
                    </div>

                    <div className="card-flat" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Payment</h3>

                        {/* Bank Info */}
                        <div className="bank-info-card">
                            <div className="bank-info-qr">
                                <BankQR size={140} />
                                <p style={{ fontSize: '11px', color: 'var(--brown-400)', marginTop: '8px', textAlign: 'center' }}>
                                    Scan QR to pay
                                </p>
                            </div>
                            <div className="bank-info-details">
                                <div className="bank-info-label">Bank Name</div>
                                <div className="bank-info-value">KBZ Bank</div>

                                <div className="bank-info-label">Account Holder</div>
                                <div className="bank-info-value">Artisan's Memories</div>

                                <div className="bank-info-label">Account Number</div>
                                <div className="bank-info-value" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                                    0123 4567 8901 2345
                                </div>

                                <div className="bank-info-label">Amount</div>
                                <div className="bank-info-value" style={{ color: 'var(--red-deep)', fontWeight: 700 }}>
                                    {Number(order.total).toLocaleString()} MMK
                                </div>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--brown-200)', margin: '16px 0', paddingTop: '16px' }}>
                            {order.payment?.slip_url ? (
                                <div>
                                    <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--brown-700)' }}>Your Payment Slip</p>
                                    <img src={order.payment.slip_url} alt="Payment slip" style={{ width: '100%', borderRadius: '12px', border: '1.5px solid var(--gold)' }} />
                                    <p className="text-sm text-muted" style={{ marginTop: '8px' }}>
                                        Status: <Badge variant={order.payment.status === 'approved' ? 'success' : order.payment.status === 'rejected' ? 'danger' : 'warning'}>{order.payment.status}</Badge>
                                    </p>
                                    {order.payment.status === 'rejected' && (
                                        <div style={{ marginTop: '12px' }}>
                                            <p className="text-sm text-muted" style={{ marginBottom: '8px' }}>Payment was rejected. Please upload a new slip.</p>
                                            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                                                <Upload size={14} /> Re-upload Slip
                                                <input type="file" accept="image/*" onChange={handleSlipUpload} style={{ display: 'none' }} />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-muted" style={{ marginBottom: '12px' }}>
                                        Transfer to the account above, then upload your payment slip.
                                    </p>
                                    <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                                        <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Payment Slip'}
                                        <input type="file" accept="image/*" onChange={handleSlipUpload} style={{ display: 'none' }} disabled={uploading} />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
