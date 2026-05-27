import React from 'react';

interface LogoProps {
  className?: string; // custom styling
  showSlogan?: boolean;
}

export default function MapStoreLogo({ className = '', showSlogan = true }: LogoProps) {
  return (
    <div className={`flex flex-col items-center select-none ${className}`} id="mapstore-logo">
      <div className="relative flex items-center justify-center py-2 px-4 gap-2">
        {/* Brand visual flower container */}
        <div className="flex items-center">
          <span className="font-sans font-extrabold text-3xl md:text-4xl tracking-tight text-[#5eead4] dark:text-[#4ade80]">
            MapStore
          </span>
        </div>

        {/* Floating 8-petal customized mint flower/asterisk logo symbol */}
        <div className="absolute -top-1 -right-4 text-[#5eead4] dark:text-[#4ade80] animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-8 h-8 md:w-10 md:h-10 fill-current"
          >
            {/* Symmetrical flower star matching the attachment */}
            <g transform="translate(50,50)">
              {Array.from({ length: 8 }).map((_, i) => (
                <rect
                  key={i}
                  x="-6"
                  y="-35"
                  width="12"
                  height="26"
                  rx="6"
                  transform={`rotate(${i * 45})`}
                />
              ))}
              <circle cx="0" cy="0" r="8" className="text-black dark:text-[#121214]" />
            </g>
          </svg>
        </div>
      </div>
      {showSlogan && (
        <span className="text-xs font-sans tracking-[0.2em] uppercase text-gray-500 font-semibold dark:text-gray-400 mt-0.5">
          Reaching you
        </span>
      )}
    </div>
  );
}
