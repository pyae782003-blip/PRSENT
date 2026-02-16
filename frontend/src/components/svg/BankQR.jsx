// Simple QR Code placeholder SVG component
// Replace the `src` in OrderDetailPage with your actual bank QR code image

export default function BankQR({ size = 160, ...props }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <rect width="160" height="160" rx="8" fill="white" />
            {/* Top-left finder pattern */}
            <rect x="12" y="12" width="40" height="40" rx="4" fill="#3d2b1f" />
            <rect x="18" y="18" width="28" height="28" rx="2" fill="white" />
            <rect x="24" y="24" width="16" height="16" rx="1" fill="#3d2b1f" />
            {/* Top-right finder pattern */}
            <rect x="108" y="12" width="40" height="40" rx="4" fill="#3d2b1f" />
            <rect x="114" y="18" width="28" height="28" rx="2" fill="white" />
            <rect x="120" y="24" width="16" height="16" rx="1" fill="#3d2b1f" />
            {/* Bottom-left finder pattern */}
            <rect x="12" y="108" width="40" height="40" rx="4" fill="#3d2b1f" />
            <rect x="18" y="114" width="28" height="28" rx="2" fill="white" />
            <rect x="24" y="120" width="16" height="16" rx="1" fill="#3d2b1f" />
            {/* Data modules (decorative pattern) */}
            {[60, 68, 76, 84, 92, 100].map(x =>
                [60, 68, 76, 84, 92, 100].map(y => (
                    <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" rx="1"
                        fill={(x + y) % 16 === 0 ? 'white' : '#3d2b1f'} />
                ))
            )}
            {[12, 20, 28, 36, 44].map(x =>
                [60, 68, 76, 84, 92].map(y => (
                    <rect key={`h-${x}-${y}`} x={x} y={y} width="6" height="6" rx="1"
                        fill={(x * y) % 3 === 0 ? '#3d2b1f' : 'white'} />
                ))
            )}
            {[60, 68, 76, 84, 92].map(x =>
                [12, 20, 28, 36, 44].map(y => (
                    <rect key={`v-${x}-${y}`} x={x} y={y} width="6" height="6" rx="1"
                        fill={(x + y) % 3 === 0 ? '#3d2b1f' : 'white'} />
                ))
            )}
            {[108, 116, 124, 132, 140].map(x =>
                [60, 68, 76, 84, 92, 100, 108, 116, 124, 132].map(y => (
                    <rect key={`r-${x}-${y}`} x={x} y={y} width="6" height="6" rx="1"
                        fill={(x * y) % 5 < 2 ? '#3d2b1f' : 'white'} />
                ))
            )}
            {[60, 68, 76, 84, 92, 100].map(x =>
                [108, 116, 124, 132, 140].map(y => (
                    <rect key={`b-${x}-${y}`} x={x} y={y} width="6" height="6" rx="1"
                        fill={(x + y) % 4 < 2 ? '#3d2b1f' : 'white'} />
                ))
            )}
        </svg>
    );
}
