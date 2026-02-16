import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Gift } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '../../components/ui/PixelUI';
import Pagination from '../../components/ui/Pagination';
import api from '../../services/api';
import PagodaDecor from '../../components/svg/PagodaDecor';

const ITEMS_PER_PAGE = 12;

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        Promise.all([api.get('/products'), api.get('/categories')])
            .then(([p, c]) => {
                setProducts(p.data.products || p.data || []);
                setCategories(c.data.categories || c.data || []);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => { setCurrentPage(1); }, [search, catFilter]);

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = !catFilter || p.category_id == catFilter;
        return matchSearch && matchCat;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedProducts = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container page">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                    <h1 className="page-title">Products</h1>
                    <p className="page-subtitle">Browse our handcrafted collection</p>
                </div>
                <PagodaDecor style={{ width: '40px', opacity: 0.8 }} />
            </div>

            {/* Search */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ position: 'relative', maxWidth: '360px', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3' }} />
                    <input className="form-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} />
                </div>
            </div>

            {categories.length > 0 && (
                <div className="filter-pills" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    <button className={`btn btn-sm ${!catFilter ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCatFilter('')}>All</button>
                    {categories.map(c => (
                        <button key={c.id} className={`btn btn-sm ${catFilter == c.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCatFilter(c.id)}>
                            {c.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Results info */}
            <p className="text-sm text-muted" style={{ marginBottom: '16px' }}>
                Showing {paginatedProducts.length} of {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Product Grid */}
            {filtered.length === 0 ? (
                <EmptyState icon={Gift} title="No products found" description="Try adjusting your search or filters" />
            ) : (
                <>
                    <div className="grid-4">
                        {paginatedProducts.map(product => (
                            <Link key={product.id} to={`/products/${product.id}`} className="product-card">
                                <div className="product-card-img">
                                    {product.images?.[0]?.url ? (
                                        <img src={product.images[0].url} alt={product.name} />
                                    ) : (
                                        <Gift size={36} style={{ color: '#d4d4d4' }} />
                                    )}
                                </div>
                                <div className="product-card-body">
                                    {product.category && <div className="product-card-category">{product.category.name}</div>}
                                    <div className="product-card-name">{product.name}</div>
                                    <div className="product-card-price">
                                        {Number(product.price).toLocaleString()} <span>MMK</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}

