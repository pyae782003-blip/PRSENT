import { useState, useEffect } from 'react';
import { Trash2, Shield, ShieldOff } from 'lucide-react';
import { Badge, Table, LoadingSpinner } from '../../components/ui/PixelUI';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        api.get('/admin/users')
            .then(r => setUsers(r.data.users || r.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const toggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
        try {
            await api.put(`/admin/users/${user.id}`, { role: newRole });
            toast.success(`Role updated to ${newRole}`);
            load();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };

    const handleDelete = async (user) => {
        if (!confirm(`Delete user "${user.name}"? This will also remove their orders, payments, and favorites.`)) return;
        try {
            await api.delete(`/admin/users/${user.id}`);
            toast.success('User deleted');
            load();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">Users</h1>
            <p className="page-subtitle" style={{ marginBottom: '24px' }}>{users.length} registered users</p>

            <Table headers={['Name', 'Email', 'Role', 'Joined', 'Actions']}>
                {users.map(u => (
                    <tr key={u.id}>
                        <td><span className="text-bold">{u.name}</span></td>
                        <td className="text-muted">{u.email}</td>
                        <td><Badge variant={u.role === 'admin' ? 'primary' : 'default'}>{u.role || 'user'}</Badge></td>
                        <td className="text-muted">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td>
                            <span style={{ display: 'flex', gap: '4px' }}>
                                <button className="btn-icon" title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'} onClick={() => toggleRole(u)}>
                                    {u.role === 'admin' ? <ShieldOff size={14} /> : <Shield size={14} />}
                                </button>
                                <button className="btn-icon btn-icon-danger" title="Delete user" onClick={() => handleDelete(u)}>
                                    <Trash2 size={14} />
                                </button>
                            </span>
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
}
