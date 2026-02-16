import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, CreditCard } from 'lucide-react';
import { StatsCard, LoadingSpinner } from '../../components/ui/PixelUI';
import api from '../../services/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats').then(r => setStats(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of your shop</p>
            <div className="grid-4">
                <StatsCard title="Total Products" value={stats?.total_products || 0} icon={Package} />
                <StatsCard title="Total Orders" value={stats?.total_orders || 0} icon={ShoppingBag} />
                <StatsCard title="Total Users" value={stats?.total_users || 0} icon={Users} />
                <StatsCard title="Revenue" value={`${(stats?.total_revenue || 0).toLocaleString()} MMK`} icon={CreditCard} />
            </div>
        </div>
    );
}
