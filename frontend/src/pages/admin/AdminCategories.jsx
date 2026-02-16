import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button, Modal, Input, TextArea, Table, LoadingSpinner, Alert } from '../../components/ui/PixelUI';
import api from '../../services/api';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [error, setError] = useState('');

    const load = () => { api.get('/categories').then(r => setCategories(r.data.categories || r.data || [])).finally(() => setLoading(false)); };
    useEffect(load, []);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
    const openNew = () => { setEditing(null); setForm({ name: '', description: '' }); setError(''); setModalOpen(true); };
    const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setError(''); setModalOpen(true); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        try {
            if (editing) await api.put(`/admin/categories/${editing.id}`, form);
            else await api.post('/admin/categories', form);
            setModalOpen(false); load();
        } catch (err) { setError(err.response?.data?.message || 'Failed'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete?')) return;
        await api.delete(`/admin/categories/${id}`).catch(() => { }); load();
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 className="page-title">Categories</h1>
                    <p className="text-sm text-muted">{categories.length} categories</p>
                </div>
                <Button onClick={openNew}><Plus size={16} /> Add Category</Button>
            </div>

            <Table headers={['Name', 'Description', 'Products', 'Actions']}>
                {categories.map(c => (
                    <tr key={c.id}>
                        <td><span className="text-bold">{c.name}</span></td>
                        <td className="text-muted">{c.description || '—'}</td>
                        <td>{c._count?.products ?? '—'}</td>
                        <td>
                            <span style={{ display: 'flex', gap: '4px' }}>
                                <button className="btn-icon" onClick={() => openEdit(c)}><Edit size={14} /></button>
                                <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                            </span>
                        </td>
                    </tr>
                ))}
            </Table>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} size="sm">
                {error && <Alert variant="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Input label="Name" value={form.name} onChange={set('name')} required />
                    <TextArea label="Description" value={form.description} onChange={set('description')} />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
