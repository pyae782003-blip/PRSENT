import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Button, Badge, Modal, Input, TextArea, Select, Table, LoadingSpinner, Alert } from '../../components/ui/PixelUI';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '' });
    const [imageUrls, setImageUrls] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Delete confirmation modal state
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const load = () => {
        Promise.all([api.get('/products'), api.get('/categories')])
            .then(([p, c]) => {
                setProducts(p.data.products || p.data || []);
                setCategories(c.data.categories || c.data || []);
            })
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const openNew = () => {
        setEditing(null);
        setForm({ name: '', description: '', price: '', stock: '', category_id: '' });
        setImageUrls('');
        setError('');
        setModalOpen(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({
            name: p.name,
            description: p.description || '',
            price: String(p.price),
            stock: String(p.stock),
            category_id: p.category_id ? String(p.category_id) : ''
        });
        setImageUrls(p.images?.map(i => i.url).join('\n') || '');
        setError('');
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const images = imageUrls.split('\n').map(s => s.trim()).filter(Boolean);

        // Build data with proper types for the backend
        const data = {
            name: form.name,
            description: form.description || '',
            price: parseFloat(form.price) || 0,
            stock: parseInt(form.stock, 10) || 0,
            category_id: form.category_id ? parseInt(form.category_id, 10) : null,
            images,
        };

        try {
            if (editing) {
                await api.put(`/admin/products/${editing.id}`, data);
                toast.success('Product updated successfully!');
            } else {
                await api.post('/admin/products', data);
                toast.success('Product added successfully!');
            }
            setModalOpen(false);
            load();
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong';
            setError(msg);
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = (product) => {
        setDeleteTarget(product);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/admin/products/${deleteTarget.id}`);
            toast.success(`"${deleteTarget.name}" deleted!`);
            setDeleteTarget(null);
            load();
        } catch {
            toast.error('Failed to delete product');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 className="page-title">Products</h1>
                    <p className="text-sm text-muted">{products.length} products</p>
                </div>
                <Button onClick={openNew}><Plus size={16} /> Add Product</Button>
            </div>

            <Table headers={['Product', 'Category', 'Price', 'Stock', 'Actions']}>
                {products.map(p => (
                    <tr key={p.id}>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {p.images?.[0]?.url ? (
                                    <img src={p.images[0].url} alt={p.name}
                                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface-2, #f0f0f0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Package size={16} style={{ opacity: 0.4 }} />
                                    </div>
                                )}
                                <span className="text-bold">{p.name}</span>
                            </div>
                        </td>
                        <td>{p.category?.name || '—'}</td>
                        <td>{Number(p.price).toLocaleString()} MMK</td>
                        <td><Badge variant={p.stock > 0 ? 'success' : 'danger'}>{p.stock > 0 ? `${p.stock} in stock` : 'Out'}</Badge></td>
                        <td>
                            <span style={{ display: 'flex', gap: '4px' }}>
                                <button className="btn-icon" title="Edit" onClick={() => openEdit(p)}><Edit size={14} /></button>
                                <button className="btn-icon btn-icon-danger" title="Delete" onClick={() => confirmDelete(p)}><Trash2 size={14} /></button>
                            </span>
                        </td>
                    </tr>
                ))}
            </Table>

            {/* Add / Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'}>
                {error && <Alert variant="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Input label="Name" value={form.name} onChange={set('name')} required />
                    <TextArea label="Description" value={form.description} onChange={set('description')} />
                    <div className="form-row">
                        <Input label="Price (MMK)" type="number" value={form.price} onChange={set('price')} required />
                        <Input label="Stock" type="number" value={form.stock} onChange={set('stock')} required />
                    </div>
                    <Select label="Category" value={form.category_id} onChange={set('category_id')}>
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                    <TextArea
                        label="Image URLs (one per line)"
                        value={imageUrls}
                        onChange={e => setImageUrls(e.target.value)}
                        placeholder="https://example.com/image1.jpg"
                        rows={3}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : (editing ? 'Update' : 'Create')}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product" size="sm">
                <p style={{ marginBottom: '8px' }}>
                    Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>?
                </p>
                <p className="text-muted text-sm" style={{ marginBottom: '20px' }}>This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
