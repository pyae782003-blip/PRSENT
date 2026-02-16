const Parasol = ({ className = "" }) => (
    <svg viewBox="0 0 220 260" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="107" y="90" width="6" height="160" rx="3" fill="hsl(25 40% 30%)" />
        <circle cx="110" cy="252" r="8" fill="hsl(25 40% 30%)" />
        <path d="M10 95 Q110 -10 210 95 Z" fill="hsl(0 60% 48%)" stroke="hsl(25 40% 20%)" strokeWidth="2.5" />
        <path d="M110 10 L50 90" stroke="hsl(42 85% 62%)" strokeWidth="1.5" />
        <path d="M110 10 L170 90" stroke="hsl(42 85% 62%)" strokeWidth="1.5" />
        <path d="M110 10 L20 92" stroke="hsl(42 85% 62%)" strokeWidth="1.5" />
        <path d="M110 10 L200 92" stroke="hsl(42 85% 62%)" strokeWidth="1.5" />
        <path d="M110 10 L110 95" stroke="hsl(42 85% 62%)" strokeWidth="1.5" />
        <circle cx="60" cy="65" r="6" fill="hsl(42 85% 65%)" />
        <circle cx="110" cy="50" r="6" fill="hsl(42 85% 65%)" />
        <circle cx="160" cy="65" r="6" fill="hsl(42 85% 65%)" />
        <circle cx="60" cy="65" r="2.5" fill="hsl(0 55% 40%)" />
        <circle cx="110" cy="50" r="2.5" fill="hsl(0 55% 40%)" />
        <circle cx="160" cy="65" r="2.5" fill="hsl(0 55% 40%)" />
        {[60, 110, 160].map((cx, i) => {
            const cy = i === 1 ? 50 : 65;
            return [0, 72, 144, 216, 288].map((angle) => (
                <circle
                    key={`${cx}-${angle}`}
                    cx={cx + Math.cos((angle * Math.PI) / 180) * 9}
                    cy={cy + Math.sin((angle * Math.PI) / 180) * 9}
                    r="3"
                    fill="hsl(330 50% 70%)"
                    opacity="0.7"
                />
            ));
        })}
        <path d="M10 95 Q30 105 50 95 Q70 105 90 95 Q110 105 130 95 Q150 105 170 95 Q190 105 210 95" stroke="hsl(42 85% 55%)" strokeWidth="2.5" fill="none" />
        <circle cx="110" cy="8" r="6" fill="hsl(42 85% 55%)" stroke="hsl(25 40% 25%)" strokeWidth="2" />
    </svg>
);

export default Parasol;
