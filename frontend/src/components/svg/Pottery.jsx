const Pottery = ({ className = "" }) => (
    <svg viewBox="0 0 180 200" className={className} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="90" cy="185" rx="45" ry="10" fill="hsl(25 40% 25%)" />
        <path d="M45 185 Q35 140 50 100 Q60 70 90 65 Q120 70 130 100 Q145 140 135 185 Z" fill="hsl(18 50% 52%)" stroke="hsl(25 40% 25%)" strokeWidth="2.5" />
        <path d="M55 178 Q47 140 58 105 Q67 78 90 74 Q113 78 122 105 Q133 140 125 178 Z" fill="hsl(18 45% 58%)" />
        <path d="M70 68 Q70 50 75 42 Q82 35 90 33 Q98 35 105 42 Q110 50 110 68" fill="hsl(18 50% 52%)" stroke="hsl(25 40% 25%)" strokeWidth="2.5" />
        <ellipse cx="90" cy="33" rx="18" ry="6" fill="hsl(18 45% 48%)" stroke="hsl(25 40% 25%)" strokeWidth="2" />
        <path d="M58 120 Q90 110 122 120" stroke="hsl(42 85% 62%)" strokeWidth="2.5" fill="none" />
        <path d="M55 140 Q90 130 125 140" stroke="hsl(42 85% 62%)" strokeWidth="2.5" fill="none" />
        <path d="M57 160 Q90 150 123 160" stroke="hsl(42 85% 62%)" strokeWidth="2.5" fill="none" />
        <path d="M90 98 L80 108 L90 118 L100 108 Z" fill="none" stroke="hsl(42 85% 62%)" strokeWidth="2" />
        <circle cx="90" cy="108" r="3" fill="hsl(42 85% 62%)" />
        <path d="M68 85 Q72 80 74 88" stroke="white" strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
    </svg>
);

export default Pottery;
