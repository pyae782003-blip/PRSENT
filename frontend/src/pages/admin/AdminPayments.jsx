import { useState, useEffect } from 'react';
import { Check, X as XIcon, Eye } from 'lucide-react';
import { Badge, Table, Modal, LoadingSpinner } from '../../components/ui/PixelUI';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewSlip, setViewSlip] = useState(null);

    const load = () => {
        api.get('/admin/payments')
            .then(r => setPayments(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleAction = async (id, status) => {
        try {
            await api.put(`/admin/payments/${id}`, { status });
            toast.success(`Payment ${status}`);
            load();
        } catch { toast.error('Failed'); }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">Payments</h1>
            <p className="page-subtitle" style={{ marginBottom: '24px' }}>{payments.length} payment records</p>

            <Table headers={['Order', 'Customer', 'Amount', 'Status', 'Actions']}>
                {payments.map(p => (
                    <tr key={p.id}>
                        <td><span className="text-bold">#{p.order_id}</span></td>
                        <td>{p.order?.user?.name || '—'}</td>
                        <td>{Number(p.amount || p.order?.total || 0).toLocaleString()} MMK</td>
                        <td><Badge variant={p.status === 'approved' ? 'success' : p.status === 'rejected' ? 'danger' : 'warning'}>{p.status}</Badge></td>
                        <td>
                            <span style={{ display: 'flex', gap: '4px' }}>
                                {p.slip_url && <button className="btn-icon" title="View slip" onClick={() => setViewSlip(p.slip_url)}><Eye size={14} /></button>}
                                {p.status === 'pending' && (
                                    <>
                                        <button className="btn-icon btn-icon-success" title="Approve" onClick={() => handleAction(p.id, 'approved')}><Check size={14} /></button>
                                        <button className="btn-icon btn-icon-danger" title="Reject" onClick={() => handleAction(p.id, 'rejected')}><XIcon size={14} /></button>
                                    </>
                                )}
                            </span>
                        </td>
                    </tr>
                ))}
            </Table>

            <Modal isOpen={!!viewSlip} onClose={() => setViewSlip(null)} title="Payment Slip" size="sm">
                {viewSlip && <img src={viewSlip} alt="Payment slip" style={{ width: '100%', borderRadius: '12px' }} />}
            </Modal>
        </div>
    );
}
