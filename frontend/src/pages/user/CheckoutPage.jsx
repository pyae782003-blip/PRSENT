import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, TextArea, Alert } from '../../components/ui/PixelUI';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({ shipping_address: '', phone: '', notes: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const orderItems = items.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price }));
            const res = await api.post('/orders', {
                items: orderItems,
                total: totalPrice,
                ...form
            });
            clearCart();
            const orderId = res.data.order?.id || res.data.id;
            navigate(`/orders/${orderId}`);
        } catch (err) { setError(err.response?.data?.message || 'Checkout failed'); }
        finally { setLoading(false); }
    };

    if (items.length === 0) return <div className="container page"><Alert>Your cart is empty</Alert></div>;

    return (
        <div className="container page">
            <h1 className="page-title">Checkout</h1>
            <p className="page-subtitle">Complete your order</p>

            <div className="checkout-layout">
                <div className="card-flat" style={{ padding: '28px' }}>
                    {error && <Alert variant="error">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Input label="Shipping Address" value={form.shipping_address} onChange={set('shipping_address')} placeholder="Enter your full address" required />
                        <Input label="Phone Number" value={form.phone} onChange={set('phone')} placeholder="09-xxx-xxx-xxx" required />
                        <TextArea label="Notes (optional)" value={form.notes} onChange={set('notes')} placeholder="Special instructions..." />
                        <Button className="btn-full" disabled={loading} style={{ marginTop: '8px' }}>
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </Button>
                    </form>
                </div>

                <div className="cart-summary">
                    <div className="cart-summary-title">Order Summary</div>
                    {items.map(item => (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }} key={item.id}>
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px', color: '#525252' }}>{item.name} × {item.quantity}</span>
                            <span style={{ fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="cart-summary-total"><span>Total</span><span>{totalPrice.toLocaleString()} MMK</span></div>
                </div>
            </div>
        </div>
    );
}
