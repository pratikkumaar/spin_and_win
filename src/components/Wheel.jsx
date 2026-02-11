import React, { useEffect, useState } from 'react';
import './Wheel.css';

// --- CONFIGURATION ---
// 1. COLORS: Define the segment colors here.
const PALETTE = {
    redDark: '#466871',      // Teal/Gray Blue
    redLight: '#d3879f',     // Dusty Pink/Rose
    gold: '#f59e0b',         // Gold for Grand Prize
    goldGradient: 'linear-gradient(135deg, #fde68a 0%, #d97706 100%)',
    text: '#ffffff',
    textGold: '#fffbeb'     // Very light gold/white
};

// 2. ICONS: Map your custom icon components or image URLs here.
// The user (you) can replace these emoji strings with <img src="..." /> or SVGs.
const ICONS = {
    'Youlry.com': '🎟️',
    'Chocolate': '🍫',
    'Roses': '🌹',
    'Teddy': '🧸',
    'Necklace': '📿',
    'Pendant': '✨',
    'Dinner': '🍽️',
    'Watch': '⌚'
};

const getIcon = (label) => {
    if (label.includes('Youlry')) return ICONS['Youlry.com'];
    if (label.includes('Chocolate')) return ICONS['Chocolate'];
    if (label.includes('Roses')) return ICONS['Roses'];
    if (label.includes('Teddy')) return ICONS['Teddy'];
    if (label.includes('Necklace')) return ICONS['Necklace']; // Grand Prize
    if (label.includes('Pendant')) return ICONS['Pendant'];
    if (label.includes('Dinner')) return ICONS['Dinner'];
    if (label.includes('Watch')) return ICONS['Watch'];
    return '🎁';
};

const getSegmentColor = (index, label) => {
    // Special case for Grand Prize (Necklace)
    if (label.includes('Necklace')) return 'url(#gold-texture)'; // Use SVG Gradient/Pattern

    // Alternating Pinks
    return index % 2 === 0 ? PALETTE.redDark : PALETTE.redLight;
};

const Wheel = ({ segments, winnerIndex, isSpinning, onSpinComplete }) => {
    const [rotation, setRotation] = useState(0);

    const numSegments = segments.length;
    const anglePerSegment = 360 / numSegments;

    useEffect(() => {
        if (winnerIndex !== null && isSpinning) {
            // Calculate target to land pointer (top) on the winner
            // Rotation is clockwise. 
            // If winner is at Index 0. Segment 0 spans [0, angle]. Center is angle/2.
            // We want Center of Segment 0 to be at -90 (Top).
            // Current 0 is at East (0 deg).
            // Rotate -90 moves 0 to North.
            // Target Angle = 360 - (index * angle) - (angle/2).
            // This aligns the center of the segment to East.
            // Since container is rotated -90 in CSS (or we do it here), let's calculate based on standard circle.

            // The container SVG is rotated -90deg to put index 0 at top.
            // Target Angle calculation:
            // 360 - (index * anglePerSegment) -> moves the start of segment 0 to 0deg (East)
            // - anglePerSegment/2 -> centers the segment at 0deg (East)
            // Since the whole wheel is rotated -90deg, the "East" position visually becomes "North".
            // So we DO NOT need an extra offset if our goal is Top (North).
            // However, let's verify visual alignment.
            // visualAngle = logicalAngle - 90.
            // We want visualAngle to be 0 (if pointer is at East) or -90 (if pointer is at North)?
            // CSS has pointer at Top.
            // Let's stick to the previous logic which worked for stopping:

            const segmentCenterOffset = anglePerSegment / 2;
            const targetAngle = 360 - (winnerIndex * anglePerSegment) - segmentCenterOffset;

            // Adjust for existing rotation to prevent jerk
            const currentMod = rotation % 360;
            let ticksNeeded = targetAngle - currentMod;
            if (ticksNeeded < 0) ticksNeeded += 360;

            const totalRotation = rotation + ticksNeeded + (360 * 5); // 5 spins

            setRotation(totalRotation);

            const timeout = setTimeout(() => {
                onSpinComplete();
            }, 4000);

            return () => clearTimeout(timeout);
        }
    }, [winnerIndex, isSpinning]);

    const createSector = (index) => {
        const angle = 360 / numSegments;
        const startAngle = index * angle;
        const endAngle = (index + 1) * angle;

        // SVG Path Math
        const x1 = 50 + 50 * Math.cos(startAngle * Math.PI / 180);
        const y1 = 50 + 50 * Math.sin(startAngle * Math.PI / 180);
        const x2 = 50 + 50 * Math.cos(endAngle * Math.PI / 180);
        const y2 = 50 + 50 * Math.sin(endAngle * Math.PI / 180);

        const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

        const midAngle = startAngle + (angle / 2);

        // --- Customization Config ---
        const label = segments[index];
        const isGrandPrize = label.includes('Necklace');

        // Text Placement (Push text further out)
        const textRadius = 38;
        const textX = 50 + textRadius * Math.cos(midAngle * Math.PI / 180);
        const textY = 50 + textRadius * Math.sin(midAngle * Math.PI / 180);

        // Icon Placement (Closer to center)
        const iconRadius = 24;
        const iconX = 50 + iconRadius * Math.cos(midAngle * Math.PI / 180);
        const iconY = 50 + iconRadius * Math.sin(midAngle * Math.PI / 180);

        // Rotate items to point towards center
        const itemsRotation = midAngle + 90;

        // Split text for multiline
        const lines = label.split('\n');

        return (
            <g key={index}>
                <path
                    d={d}
                    fill={getSegmentColor(index, label)}
                    stroke="#fbbf24" // Gold divider
                    strokeWidth="0.8"
                />

                {/* Text Group */}
                <g transform={`translate(${textX}, ${textY}) rotate(${itemsRotation})`}>
                    <text
                        fill={isGrandPrize ? '#78350f' : 'white'} // Dark brown text on gold, white otherwise
                        fontSize="3.2"
                        fontWeight="500"
                        fontFamily='SourceSansPro'
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
                    >
                        {lines.map((line, i) => (
                            <tspan x="0" dy={i === 0 ? (lines.length > 1 ? "-1.2" : "0") : "3.5"} key={i}>
                                {line}
                            </tspan>
                        ))}
                    </text>
                </g>

                {/* Icon Group - REPLACE WITH YOUR <image> TAG HERE */}
                <g transform={`translate(${iconX}, ${iconY}) rotate(${itemsRotation})`}>
                    {/* Placeholder for custom icon. User can replace <text> with <image x="-5" y="-5" width="10" height="10" href={myIconUrl} /> */}
                    <text
                        fontSize="9"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform="rotate(180)" // Flip emoji to face center correctly
                        style={{ filter: isGrandPrize ? 'none' : 'grayscale(0.2)' }}
                    >
                        {getIcon(label)}
                    </text>
                </g>
            </g>
        );
    };

    return (
        <div className="wheel-container">
            {/* Pointer facing down from top (Heart) */}
            <div className="wheel-pointer" />

            <div
                className="wheel-rotate"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <defs>
                        {/* Gradient for the Gold Segment */}
                        <linearGradient id="gold-texture" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fef3c7" />
                            <stop offset="25%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#fbbf24" />
                            <stop offset="75%" stopColor="#d97706" />
                            <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                    </defs>
                    {segments.map((_, i) => createSector(i))}
                </svg>
            </div>

            {/* Center Cap Structure */}
            <div className="wheel-center">
                {/* Rings created via CSS */}
                <div className="wheel-center-inner">
                    <div className="wheel-center-heart">❤</div>
                </div>
            </div>
        </div>
    );
};

export default Wheel;
