import React from "react";

interface LogoProps {
  variant?: "full" | "icon";
  showText?: boolean;
  width?: number;
  height?: number;
  className?: string;
  animate?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = "full", 
  showText = true,
  width, 
  height, 
  className = "",
  animate = false
}) => {
  if (variant === "icon") {
    return (
      <svg 
        width={width || 32} 
        height={height || 32} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#3C50E0"/>
        <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="20" r="14" stroke="#3C50E0" strokeOpacity="0.2" strokeWidth="4"/>
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={width || (showText ? 120 : 32)} 
        height={height || 40} 
        viewBox={showText ? "0 0 120 40" : "0 0 40 40"} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Icon Element */}
        <rect x="2" y="6" width="28" height="28" rx="8" fill="#3C50E0"/>
        <path d="M10 20L14 24L22 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        
        {/* IDL Text */}
        {showText && (
          <text 
            x="42" 
            y="30" 
            fontFamily="Outfit, sans-serif" 
            fontSize="28" 
            fontWeight="900" 
            fill="currentColor" 
            className="text-gray-900 dark:text-white"
            style={{ letterSpacing: "-1px" }}
          >
            IDL<tspan fill="#3C50E0">.</tspan>
          </text>
        )}
        
        {/* Subtle Glow */}
        <circle cx="14" cy="20" r="16" stroke="#3C50E0" strokeOpacity="0.1" strokeWidth="4"/>
      </svg>

      {animate && (
        <div className="flex flex-col justify-center overflow-hidden animate-reveal-text">
          <span className="text-gray-400 dark:text-white/40 text-[10px] uppercase tracking-widest font-medium leading-none mb-1">
            Invental
          </span>
          <span className="text-gray-900 dark:text-white text-sm font-bold leading-none">
            Data Labs
          </span>
        </div>
      )}
    </div>
  );
};



export default Logo;
