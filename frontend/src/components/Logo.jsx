import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      {/* Modern animated logo with rupee symbol */}
      <div className="relative w-12 h-12">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          className="transform transition-transform hover:scale-105"
        >
          {/* Background circle with gradient */}
          <circle 
            cx="24" 
            cy="24" 
            r="22" 
            className="fill-indigo-100 dark:fill-indigo-900/30"
          />
          
          {/* Document shape */}
          <rect 
            x="14" 
            y="10" 
            width="20" 
            height="28" 
            rx="3" 
            className="fill-indigo-500 dark:fill-indigo-400"
          />

          {/* Large Rupee Symbol */}
          <g className="stroke-white dark:stroke-gray-200">
            {/* Top line */}
            <path
              d="M21 16H31"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-draw"
            />
            {/* Middle line */}
            <path
              d="M21 22H31"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-draw"
            />
            {/* Vertical line */}
            <path
              d="M24 16L24 34"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-draw"
            />
            {/* Diagonal line */}
            <path
              d="M29 34L19 22"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-draw-delayed"
            />
          </g>

          {/* Decorative dots */}
          <circle
            cx="17"
            cy="16"
            r="1"
            className="fill-white dark:fill-gray-200 animate-pulse"
          />
          <circle
            cx="17"
            cy="22"
            r="1"
            className="fill-white dark:fill-gray-200 animate-pulse"
          />
        </svg>
      </div>
      
      {/* Brand text with modern gradient */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold relative">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-gradient">
            InvoiceGen
          </span>
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium tracking-wide">
          Smart Billing Solutions
        </span>
      </div>
    </div>
  );
};

export default Logo;
