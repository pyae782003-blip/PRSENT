import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, Gift } from 'lucide-react';
import { Button, EmptyState } from '../../components/ui/PixelUI';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

    if (items.length === 0) {
        return (
            <div className="container page">
                <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Add some products to get started"
                    action={<Link to="/products"><Button>Browse Products</Button></Link>} />
            </div>
        );
    }

    return (
        <div className="container page">
            <h1 className="page-title">Shopping Cart</h1>
            <p className="page-subtitle">{totalItems} item{totalItems > 1 ? 's' : ''} in your cart</p>

            {/* Responsive Cart Layout */}
            <div className="cart-layout">
                {/* Cart Items */}
                <div>
                    {items.map(item => (
                        <div className="cart-item" key={item.id}>
                            <div className="cart-item-img">
                                {item.images?.[0]?.url ? <img src={item.images[0].url} alt={item.name} /> : <Gift size={24} style={{ color: '#d4d4d4' }} />}
                            </div>
                            <div className="cart-item-info">
                                <div className="cart-item-name">{item.name}</div>
                                <div className="cart-item-price">{Number(item.price).toLocaleString()} MMK each</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                    <div className="qty-control">
                                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button>
                                    </div>
                                    <button className="btn-icon btn-icon-danger" onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="cart-item-total">{(item.price * item.quantity).toLocaleString()} MMK</div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="cart-summary">
                    <div className="cart-summary-title">Order Summary</div>
                    <div className="cart-summary-row"><span className="label">Subtotal</span><span className="value">{totalPrice.toLocaleString()} MMK</span></div>
                    <div className="cart-summary-row"><span className="label">Shipping</span><span className="value" style={{ color: '#16a34a' }}>Free</span></div>
                    <div className="cart-summary-total"><span>Total</span><span>{totalPrice.toLocaleString()} MMK</span></div>
                    <Link to="/checkout" style={{ display: 'block', marginTop: '16px' }}>
                        <Button className="btn-full">Proceed to Checkout</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
