import { useState } from 'react';
import { Button, Input, Alert } from '../../components/ui/PixelUI';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ProfilePage() {
    const { user } = useAuth();
    const [passwords, setPasswords] = useState({ current_password: '', password: '', password_confirmation: '' });
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const handlePassword = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        try { await api.put('/user/password', passwords); setMsg('Password updated!'); setPasswords({ current_password: '', password: '', password_confirmation: '' }); }
        catch (err) { setError(err.response?.data?.message || 'Failed to update'); }
    };

    return (
        <div className="container page" style={{ maxWidth: '600px' }}>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">Manage your account</p>

            <div className="card-flat" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Account Info</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                        <div className="text-sm text-muted">Name</div>
                        <div className="text-sm text-bold">{user?.name}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted">Email</div>
                        <div className="text-sm text-bold">{user?.email}</div>
                    </div>
                </div>
            </div>

            <div className="card-flat" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Change Password</h3>
                {msg && <Alert variant="success">{msg}</Alert>}
                {error && <Alert variant="error">{error}</Alert>}
                <form onSubmit={handlePassword}>
                    <Input label="Current Password" type="password" value={passwords.current_password}
                        onChange={e => setPasswords({ ...passwords, current_password: e.target.value })} required />
                    <div className="form-row">
                        <Input label="New Password" type="password" value={passwords.password}
                            onChange={e => setPasswords({ ...passwords, password: e.target.value })} required />
                        <Input label="Confirm New Password" type="password" value={passwords.password_confirmation}
                            onChange={e => setPasswords({ ...passwords, password_confirmation: e.target.value })} required />
                    </div>
                    <Button style={{ marginTop: '8px' }}>Update Password</Button>
                </form>
            </div>
        </div>
    );
}
