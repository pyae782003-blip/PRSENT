const Puppet = ({ className = "" }) => (
    <svg viewBox="0 0 180 260" className={className} xmlns="http://www.w3.org/2000/svg">
        <line x1="90" y1="0" x2="90" y2="40" stroke="hsl(25 20% 50%)" strokeWidth="1.5" />
        <line x1="60" y1="10" x2="70" y2="80" stroke="hsl(25 20% 50%)" strokeWidth="1.5" />
        <line x1="120" y1="10" x2="110" y2="80" stroke="hsl(25 20% 50%)" strokeWidth="1.5" />
        <rect x="50" y="0" width="80" height="8" rx="4" fill="hsl(25 40% 35%)" />
        <circle cx="90" cy="55" r="22" fill="hsl(35 55% 72%)" stroke="hsl(25 40% 25%)" strokeWidth="2.5" />
        <circle cx="82" cy="50" r="3" fill="hsl(25 40% 15%)" />
        <circle cx="98" cy="50" r="3" fill="hsl(25 40% 15%)" />
        <path d="M83 62 Q90 68 97 62" stroke="hsl(0 50% 45%)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M68 40 L90 15 L112 40" fill="hsl(42 85% 55%)" stroke="hsl(25 40% 25%)" strokeWidth="2" />
        <circle cx="90" cy="18" r="5" fill="hsl(0 65% 45%)" />
        <path d="M70 77 L65 160 L115 160 L110 77 Z" fill="hsl(0 60% 45%)" stroke="hsl(25 40% 25%)" strokeWidth="2.5" />
        <path d="M72 100 L108 100" stroke="hsl(42 85% 62%)" strokeWidth="2" />
        <path d="M73 120 L107 120" stroke="hsl(42 85% 62%)" strokeWidth="2" />
        <circle cx="90" cy="90" r="4" fill="hsl(42 85% 62%)" />
        <circle cx="90" cy="110" r="4" fill="hsl(42 85% 62%)" />
        <circle cx="90" cy="130" r="4" fill="hsl(42 85% 62%)" />
        <path d="M70 85 L40 120 L45 140" stroke="hsl(35 55% 72%)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M110 85 L140 120 L135 140" stroke="hsl(35 55% 72%)" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M60 155 L50 230 Q90 245 130 230 L120 155 Z" fill="hsl(160 35% 42%)" stroke="hsl(25 40% 25%)" strokeWidth="2.5" />
        <path d="M58 180 Q90 175 122 180" stroke="hsl(42 85% 62%)" strokeWidth="2" fill="none" />
        <path d="M55 205 Q90 200 125 205" stroke="hsl(42 85% 62%)" strokeWidth="2" fill="none" />
        <ellipse cx="70" cy="238" rx="15" ry="8" fill="hsl(25 40% 25%)" />
        <ellipse cx="110" cy="238" rx="15" ry="8" fill="hsl(25 40% 25%)" />
    </svg>
);

export default Puppet;
