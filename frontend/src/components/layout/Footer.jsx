import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ✦ Artisan's Memories
                    </div>
                    <p className="footer-desc">
                        Handcrafted treasures and meaningful gifts, curated with love from Myanmar's finest artisans.
                    </p>
                </div>
                <div>
                    <div className="footer-heading">Quick Links</div>
                    <Link to="/products" className="footer-link">Products</Link>
                    <Link to="/categories" className="footer-link">Categories</Link>
                </div>
                <div>
                    <div className="footer-heading">Support</div>
                    <div className="footer-link">hello@artisansmemories.com</div>
                    <div className="footer-link">Yangon, Myanmar</div>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} Artisan's Memories. All rights reserved.
            </div>
        </footer>
    );
}
