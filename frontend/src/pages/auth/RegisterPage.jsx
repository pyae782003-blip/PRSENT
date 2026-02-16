import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Alert } from '../../components/ui/PixelUI';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try { await register(form); navigate('/'); }
        catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
        finally { setLoading(false); }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Create account</h1>
                    <p className="auth-subtitle">Start shopping for handmade gifts</p>
                </div>
                <div className="auth-form">
                    {error && <Alert variant="error">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Input label="Name" value={form.name} onChange={set('name')} placeholder="Your name" required />
                        <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
                        <div className="form-row">
                            <Input label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
                            <Input label="Confirm Password" type="password" value={form.password_confirmation} onChange={set('password_confirmation')} placeholder="••••••••" required />
                        </div>
                        <Button className="btn-full" disabled={loading} style={{ marginTop: '8px' }}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>
                </div>
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
