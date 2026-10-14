import React from 'react';

export const NavUnderline = ({ className = '', active = false }) => {
  return (
    <span
      className={`nav-underline-flourish ${active ? 'is-active' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg
        width="75"
        height="6"
        viewBox="0 0 75 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="nav-underline-svg"
      >
        {/* Left branch - starts at center circle (34.5, 2.8) and draws outwards to the left curved dash */}
        <path
          d="M 34.5 2.8 L 15.5 2.8 C 13.8 2.8 12.2 4.9 10.4 4.8 C 8.2 4.6 7 1.4 4.6 1.1 C 2.6 0.9 0.8 1.8 0.8 4.2"
          className="nav-flourish-path nav-flourish-left"
          stroke="currentColor"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Center circle - scales in from center */}
        <circle
          cx="37.5"
          cy="2.8"
          r="1.8"
          className="nav-flourish-circle"
          stroke="currentColor"
          strokeWidth="0.85"
          fill="none"
        />
        {/* Right branch - starts at center circle (40.5, 2.8) and draws outwards to the right curved dash */}
        <path
          d="M 40.5 2.8 L 59.5 2.8 C 61.2 2.8 62.8 4.9 64.6 4.8 C 66.8 4.6 68 1.4 70.4 1.1 C 72.4 0.9 74.2 1.8 74.2 4.2"
          className="nav-flourish-path nav-flourish-right"
          stroke="currentColor"
          strokeWidth="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

export default NavUnderline;
