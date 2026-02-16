import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Gift } from 'lucide-react';
import { Button, EmptyState, LoadingSpinner } from '../../components/ui/PixelUI';
import api from '../../services/api';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/favorites').then(r => setFavorites(r.data.favorites || r.data || [])).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const removeFav = async (productId) => {
        await api.delete(`/favorites/${productId}`).catch(() => { });
        setFavorites(prev => prev.filter(f => (f.product?.id || f.product_id || f.id) !== productId));
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container page">
            <h1 className="page-title">Favorites</h1>
            <p className="page-subtitle">Your saved products</p>

            {favorites.length === 0 ? (
                <EmptyState icon={Heart} title="No favorites yet" description="Browse products and save your favorites"
                    action={<Link to="/products"><Button>Browse Products</Button></Link>} />
            ) : (
                <div className="grid-4">
                    {favorites.map(fav => {
                        const p = fav.product || fav;
                        return (
                            <div className="product-card" key={fav.id || p.id} style={{ position: 'relative' }}>
                                <button className="btn-icon btn-icon-danger" onClick={() => removeFav(p.id)}
                                    style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2, background: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                                    <Trash2 size={14} />
                                </button>
                                <Link to={`/products/${p.id}`}>
                                    <div className="product-card-img">
                                        {p.images?.[0]?.url ? <img src={p.images[0].url} alt={p.name} /> : <Gift size={36} style={{ color: '#d4d4d4' }} />}
                                    </div>
                                    <div className="product-card-body">
                                        <div className="product-card-name">{p.name}</div>
                                        <div className="product-card-price">{Number(p.price).toLocaleString()} <span>MMK</span></div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
