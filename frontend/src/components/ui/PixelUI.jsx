/* Clean UI Component Library — Pure CSS */

export function Button({ children, variant = 'primary', size = '', className = '', ...props }) {
    const cls = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`;
    return <button className={cls} {...props}>{children}</button>;
}
export const PixelButton = Button;

export function Card({ children, className = '', hover = true, ...props }) {
    return <div className={`${hover ? 'card' : 'card-flat'} ${className}`} {...props}>{children}</div>;
}
export const PixelCard = Card;

export function Input({ label, error, className = '', ...props }) {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <input className={`form-input ${error ? 'form-input-error' : ''} ${className}`} {...props} />
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
export const PixelInput = Input;

export function TextArea({ label, error, className = '', ...props }) {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <textarea className={`form-input ${error ? 'form-input-error' : ''} ${className}`} {...props} />
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
export const PixelTextArea = TextArea;

export function Select({ label, error, children, className = '', ...props }) {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <select className={`form-input ${className}`} {...props}>{children}</select>
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
export const PixelSelect = Select;

export function Badge({ children, variant = 'default', className = '' }) {
    const map = { default: 'badge-default', primary: 'badge-dark', success: 'badge-success', warning: 'badge-warning', danger: 'badge-danger', info: 'badge-info' };
    return <span className={`badge ${map[variant] || map.default} ${className}`}>{children}</span>;
}
export const PixelBadge = Badge;

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-backdrop" onClick={onClose} />
            <div className={`modal modal-${size}`}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}

export function StatsCard({ title, value, icon: Icon, trend }) {
    return (
        <div className="stats-card">
            <div>
                <p className="stats-label">{title}</p>
                <p className="stats-value">{value}</p>
                {trend !== undefined && (
                    <p className={`stats-trend ${trend > 0 ? 'stats-trend-up' : 'stats-trend-down'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </p>
                )}
            </div>
            {Icon && <div className="stats-icon"><Icon size={22} /></div>}
        </div>
    );
}

export function LoadingSpinner() {
    return <div className="spinner-wrap"><div className="spinner" /></div>;
}

export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="empty-state">
            {Icon && <div className="empty-icon"><Icon size={28} /></div>}
            <h3 className="empty-title">{title}</h3>
            {description && <p className="empty-desc">{description}</p>}
            {action}
        </div>
    );
}

export function Table({ headers, children }) {
    return (
        <div className="table-wrap">
            <table className="table">
                <thead>
                    <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

export function Alert({ variant = 'info', children, className = '' }) {
    const map = { info: 'alert-info', success: 'alert-success', warning: 'alert-warning', danger: 'alert-error', error: 'alert-error' };
    return <div className={`alert ${map[variant] || map.info} ${className}`}>{children}</div>;
}
