const LacquerwareBowl = ({ className = "" }) => (
    <svg viewBox="0 0 200 180" className={className} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="130" rx="80" ry="20" fill="hsl(25 40% 25%)" />
        <path d="M20 130 Q20 60 100 50 Q180 60 180 130" fill="hsl(0 70% 35%)" stroke="hsl(25 40% 25%)" strokeWidth="3" />
        <path d="M30 125 Q30 70 100 62 Q170 70 170 125" fill="hsl(0 65% 42%)" />
        <path d="M50 90 Q75 80 100 90 Q125 80 150 90" stroke="hsl(42 85% 62%)" strokeWidth="2.5" fill="none" />
        <path d="M55 105 Q80 95 100 105 Q120 95 145 105" stroke="hsl(42 85% 62%)" strokeWidth="2.5" fill="none" />
        <circle cx="65" cy="97" r="3" fill="hsl(42 85% 62%)" />
        <circle cx="100" cy="95" r="3" fill="hsl(42 85% 62%)" />
        <circle cx="135" cy="97" r="3" fill="hsl(42 85% 62%)" />
        <ellipse cx="100" cy="52" rx="72" ry="10" fill="hsl(0 60% 48%)" stroke="hsl(42 85% 62%)" strokeWidth="2" />
        <path d="M55 70 Q60 65 65 72" stroke="white" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
);

export default LacquerwareBowl;
