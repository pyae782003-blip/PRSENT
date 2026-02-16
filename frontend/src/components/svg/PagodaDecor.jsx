const PagodaDecor = ({ className = "", style }) => (
    <svg viewBox="0 0 120 160" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M60 5 L55 30 L65 30 Z" fill="hsl(42 85% 55%)" />
        <circle cx="60" cy="5" r="4" fill="hsl(42 85% 65%)" />
        <path d="M40 30 L60 22 L80 30 L75 40 L45 40 Z" fill="hsl(42 80% 58%)" stroke="hsl(25 40% 25%)" strokeWidth="1.5" />
        <path d="M35 42 L60 33 L85 42 L80 55 L40 55 Z" fill="hsl(42 78% 55%)" stroke="hsl(25 40% 25%)" strokeWidth="1.5" />
        <path d="M28 57 L60 46 L92 57 L87 72 L33 72 Z" fill="hsl(42 75% 52%)" stroke="hsl(25 40% 25%)" strokeWidth="1.5" />
        <rect x="35" y="72" width="50" height="55" rx="3" fill="hsl(42 70% 50%)" stroke="hsl(25 40% 25%)" strokeWidth="1.5" />
        <path d="M50 127 L50 100 Q60 92 70 100 L70 127 Z" fill="hsl(25 40% 25%)" />
        <path d="M53 127 L53 103 Q60 96 67 103 L67 127 Z" fill="hsl(25 35% 18%)" />
        <rect x="25" y="127" width="70" height="12" rx="3" fill="hsl(42 65% 48%)" stroke="hsl(25 40% 25%)" strokeWidth="1.5" />
        <rect x="20" y="139" width="80" height="10" rx="3" fill="hsl(42 60% 45%)" stroke="hsl(25 40% 25%)" strokeWidth="1.5" />
        <circle cx="60" cy="2" r="2" fill="hsl(42 90% 75%)" />
    </svg>
);

export default PagodaDecor;
