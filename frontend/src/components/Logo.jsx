import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-logo"
      >
        {/* Modern geometric background */}
        <path
          d="M20 2C10.0589 2 2 10.0589 2 20C2 29.9411 10.0589 38 20 38C29.9411 38 38 29.9411 38 20C38 10.0589 29.9411 2 20 2Z"
          className="fill-indigo-50 dark:fill-indigo-900/30 animate-pulse-slow"
        />
        
        {/* Stylized invoice icon */}
        <path
          d="M13 12C13 11.4477 13.4477 11 14 11H26C26.5523 11 27 11.4477 27 12V28C27 28.5523 26.5523 29 26 29H14C13.4477 29 13 28.5523 13 28V12Z"
          className="fill-indigo-500 dark:fill-indigo-400 animate-document"
        />
        
        {/* Modern accent elements */}
        <path
          d="M16 16H24"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-white dark:stroke-gray-800 animate-line-1"
        />
        <path
          d="M16 20H24"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-white dark:stroke-gray-800 animate-line-2"
        />
        <path
          d="M16 24H20"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-white dark:stroke-gray-800 animate-line-3"
        />
        
        {/* Decorative accent */}
        <path
          d="M26 11L24 13"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="stroke-indigo-600 dark:stroke-indigo-300 animate-accent"
        />
      </svg>
      
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-300">
          InvoiceGen
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Professional Billing
        </span>
      </div>
    </div>
  );
};

export default Logo;
