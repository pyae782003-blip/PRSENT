import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Gift, Truck, Star } from 'lucide-react';
import { Button } from '../../components/ui/PixelUI';
import api from '../../services/api';
import PagodaDecor from '../../components/svg/PagodaDecor';
import LacquerwareBowl from '../../components/svg/LacquerwareBowl';
import Parasol from '../../components/svg/Parasol';
import Pottery from '../../components/svg/Pottery';

export default function LandingPage() {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        api.get('/products?limit=4').then(r => {
            const products = r.data.products || r.data || [];
            setFeatured(Array.isArray(products) ? products.slice(0, 4) : []);
        }).catch(() => { });
    }, []);

    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg-circle1" />
                <div className="hero-bg-circle2" />

                {/* Decorative side pagodas */}
                <PagodaDecor className="hero-side-pagoda hero-side-pagoda-left hide-mobile" />
                <PagodaDecor className="hero-side-pagoda hero-side-pagoda-right hide-mobile" />

                <div className="hero-inner animate-fade-in" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Centered Pagoda icon */}
                    <PagodaDecor style={{ width: '100px', marginBottom: '32px' }} />

                    <h1>မြန်မာ့လက်မှုပညာ</h1>
                    <p style={{ margin: '0 auto 36px', textAlign: 'center' }}>Discover unique artisan gifts — lacquerware, textiles, jewelry, and treasures curated from Myanmar's finest workshops.</p>
                    <div className="hero-buttons" style={{ justifyContent: 'center' }}>
                        <Link to="/products"><Button size="lg">Shop Now <ArrowRight size={16} /></Button></Link>
                        <Link to="/categories"><Button variant="secondary" size="lg">Browse Categories</Button></Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features">
                <div className="container">
                    <div className="grid-3">
                        <div className="feature-card">
                            <div className="feature-icon"><Pottery style={{ width: '32px' }} /></div>
                            <h3 className="feature-title">Handcrafted</h3>
                            <p className="feature-desc">Every piece made by skilled Myanmar artisans with traditional techniques</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Truck size={24} /></div>
                            <h3 className="feature-title">Fast Delivery</h3>
                            <p className="feature-desc">Nationwide shipping across Myanmar with careful packaging</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Parasol style={{ width: '32px' }} /></div>
                            <h3 className="feature-title">Quality Assured</h3>
                            <p className="feature-desc">Authentic traditional materials and craftsmanship guaranteed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featured.length > 0 && (
                <section className="section section-gray">
                    <div className="container">
                        <div className="flex-between section-header">
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <LacquerwareBowl style={{ width: '24px' }} />
                                    <p className="section-label" style={{ marginBottom: 0 }}>Curated Selection</p>
                                </div>
                                <h2 className="section-title">Featured Products</h2>
                            </div>
                            <Link to="/products" className="hide-mobile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#737373', transition: 'color 0.2s' }}>
                                View all <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="grid-4">
                            {featured.map((product, i) => (
                                <Link key={product.id} to={`/products/${product.id}`} className="product-card animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="product-card-img">
                                        {product.images?.[0]?.url ? (
                                            <img src={product.images[0].url} alt={product.name} />
                                        ) : (
                                            <Gift size={36} style={{ color: '#d4d4d4' }} />
                                        )}
                                    </div>
                                    <div className="product-card-body">
                                        <div className="product-card-name">{product.name}</div>
                                        <div className="product-card-price">
                                            {Number(product.price).toLocaleString()} <span>MMK</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="section section-dark" style={{ textAlign: 'center', padding: '96px 0' }}>
                <div className="container">
                    <div className="section-cta-icon"><Star size={24} /></div>
                    <h2 className="section-title" style={{ marginBottom: '16px' }}>Start Your Collection</h2>
                    <p style={{ color: '#a3a3a3', maxWidth: '400px', margin: '0 auto 40px', lineHeight: '1.7' }}>
                        Each piece tells a story of Myanmar's rich cultural heritage. Find the perfect gift today.
                    </p>
                    <Link to="/products">
                        <Button variant="outline" size="lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                            Explore All Products
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

