import React from 'react';

interface IridescentWaveProps {
  className?: string;
}

export const IridescentWave: React.FC<IridescentWaveProps> = ({ className = '' }) => {
  return (
    <div 
      className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Ambient background glows */}
      <div 
        className="absolute -right-10 top-1/4 w-[520px] h-[520px] rounded-full blur-[140px] opacity-40 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, rgba(124, 58, 237, 0.4) 40%, rgba(6, 182, 212, 0.2) 70%, transparent 100%)'
        }}
      />
      <div 
        className="absolute right-1/4 bottom-0 w-[420px] h-[340px] rounded-full blur-[110px] opacity-30 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.7) 0%, rgba(37, 99, 235, 0.4) 50%, transparent 100%)'
        }}
      />
      <div 
        className="absolute right-10 bottom-10 w-[280px] h-[280px] rounded-full blur-[90px] opacity-25 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, rgba(255, 103, 46, 0.3) 50%, transparent 100%)'
        }}
      />

      {/* Flowing Layered Holographic Glass Ribbon Waves */}
      <svg
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover object-right-bottom opacity-90 transition-opacity duration-1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Main Primary Iridescent Ribbon Gradient */}
          <linearGradient id="iridescent-primary" x1="100" y1="700" x2="1100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.1" />
            <stop offset="20%" stopColor="#1e3a8a" stopOpacity="0.65" />
            <stop offset="42%" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#7c3aed" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#ec4899" stopOpacity="0.6" />
            <stop offset="96%" stopColor="#fbbf24" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>

          {/* Secondary Ribbon Gradient (Deep Violet & Cyan Glass) */}
          <linearGradient id="iridescent-cyan-violet" x1="200" y1="800" x2="1000" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#030712" stopOpacity="0" />
            <stop offset="25%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.7" />
            <stop offset="75%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="90%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.5" />
          </linearGradient>

          {/* High Gloss Amber & Specular Ribbon */}
          <linearGradient id="specular-amber-white" x1="400" y1="650" x2="950" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="78%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff672e" stopOpacity="0.4" />
          </linearGradient>

          {/* Subtle Deep Shadow for 3D Depth */}
          <linearGradient id="deep-glass-shadow" x1="600" y1="200" x2="600" y2="800" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#050606" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#050606" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#050606" stopOpacity="0.95" />
          </linearGradient>

          {/* Frosted Glass Filters */}
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="22" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glass-blur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Deep Under-Ribbon Glow Path */}
        <path
          d="M300 800C450 650 600 680 750 560C900 440 980 320 1150 200C1200 160 1250 140 1300 120L1300 800L300 800Z"
          fill="url(#deep-glass-shadow)"
        />

        {/* Back Holographic Ribbon Fold */}
        <path
          d="M200 780C360 620 540 640 700 520C860 400 960 260 1120 180C1180 150 1220 130 1280 100"
          stroke="url(#iridescent-cyan-violet)"
          strokeWidth="110"
          strokeLinecap="round"
          className="opacity-60"
          filter="url(#soft-glow)"
        />

        {/* Main Fluid Glass Wave Body */}
        <path
          d="M150 750C320 580 510 610 680 480C850 350 940 220 1100 140C1160 110 1210 90 1270 70"
          stroke="url(#iridescent-primary)"
          strokeWidth="84"
          strokeLinecap="round"
          className="opacity-80"
        />

        {/* Secondary Front Ribbon with Rich Curvature */}
        <path
          d="M250 820C420 680 580 620 740 540C900 460 1020 310 1160 240C1210 210 1250 180 1300 160"
          stroke="url(#iridescent-cyan-violet)"
          strokeWidth="60"
          strokeLinecap="round"
          className="opacity-70"
        />

        {/* Sharp Luminous Specular Ridge (Glass Light Flare) */}
        <path
          d="M170 740C340 575 525 605 690 475C855 345 945 215 1105 135C1165 105 1215 85 1275 65"
          stroke="url(#specular-amber-white)"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-95"
        />

        {/* Delicate Secondary Specular Edge */}
        <path
          d="M280 810C440 675 595 615 750 535C905 455 1025 305 1165 235"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="opacity-60"
        />

        {/* Subtle Tertiary Amber Highlight Trace */}
        <path
          d="M600 550C720 450 830 380 950 280C1040 200 1110 160 1190 120"
          stroke="url(#specular-amber-white)"
          strokeWidth="16"
          strokeLinecap="round"
          className="opacity-40"
          filter="url(#glass-blur)"
        />
      </svg>

      {/* Atmospheric Vignette & Fade to #050606 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 85% 85%, transparent 30%, rgba(5, 6, 6, 0.4) 60%, #050606 95%)'
        }}
      />
    </div>
  );
};
