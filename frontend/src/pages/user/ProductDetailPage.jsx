import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Gift, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { Button, LoadingSpinner, Badge, Alert } from '../../components/ui/PixelUI';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ProductDetailPage() {
    const { id } = useParams();
    const { addItem } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        api.get(`/products/${id}`).then(r => setProduct(r.data.product || r.data)).catch(() => { }).finally(() => setLoading(false));
    }, [id]);

    const handleAdd = () => { addItem(product, qty); setAdded(true); setTimeout(() => setAdded(false), 2000); };
    const toggleFav = () => { api.post('/favorites', { product_id: id }).catch(() => { }); };

    if (loading) return <LoadingSpinner />;
    if (!product) return <div className="container page"><Alert variant="error">Product not found</Alert></div>;

    return (
        <div className="container page">
            <Link to="/products" className="back-link"><ArrowLeft size={16} /> Back to Products</Link>

            <div className="detail-grid">
                <div className="detail-img">
                    {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} />
                    ) : (
                        <Gift size={64} style={{ color: '#d4d4d4' }} />
                    )}
                </div>
                <div className="detail-info">
                    {product.category && <Badge variant="default">{product.category.name}</Badge>}
                    <h1 className="detail-name" style={{ marginTop: '8px' }}>{product.name}</h1>
                    <div className="detail-price">{Number(product.price).toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 500, color: '#a3a3a3' }}>MMK</span></div>
                    <p className="detail-desc">{product.description}</p>

                    <div style={{ marginBottom: '16px' }}>
                        {product.stock > 0 ? (
                            <Badge variant="success">In Stock ({product.stock})</Badge>
                        ) : (
                            <Badge variant="danger">Out of Stock</Badge>
                        )}
                    </div>

                    {user && product.stock > 0 && (
                        <>
                            <div className="qty-control" style={{ marginBottom: '20px', width: 'fit-content' }}>
                                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
                                <span className="qty-value">{qty}</span>
                                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}><Plus size={14} /></button>
                            </div>
                            <div className="detail-actions">
                                <Button onClick={handleAdd}><ShoppingCart size={16} /> {added ? 'Added!' : 'Add to Cart'}</Button>
                                <Button variant="outline" onClick={toggleFav}><Heart size={16} /> Favorite</Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
