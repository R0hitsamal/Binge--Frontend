import React from 'react';

const BingeLogo = ({ size = 36, showText = true, animate = false }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, userSelect: 'none' }}>
      {/* Stylized "B" Logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={animate ? { animation: 'pulse-glow 2.5s ease-in-out infinite' } : {}}
      >
        {/* Background circle */}
        <circle cx="30" cy="30" r="30" fill="#e63946" />
        {/* Film reel ring */}
        <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Decorative dots like film reel holes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 30 + 23 * Math.cos(rad);
          const y = 30 + 23 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="2" fill="rgba(0,0,0,0.4)" />;
        })}
        {/* Bold "B" letterform */}
        <text
          x="30"
          y="42"
          textAnchor="middle"
          fontFamily="'Bebas Neue', cursive"
          fontSize="36"
          fontWeight="900"
          fill="white"
          style={{ letterSpacing: '-1px' }}
        >
          B
        </text>
        {/* Play triangle inside B */}
        <polygon
          points="24,26 24,34 32,30"
          fill="rgba(0,0,0,0.25)"
        />
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: size * 0.75,
            letterSpacing: '0.12em',
            color: '#f0f0f8',
            lineHeight: 1,
          }}
        >
          BINGE
        </span>
      )}
    </div>
  );
};

export default BingeLogo;
