import React from 'react';

// Sacred Lotus-Sun Face Mask Emblem from Golf Gita header & footer
export const EmblemLogo = ({ className = "w-10 h-10", size = 44, color = "#d4af37" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Central Crown / Flame Lotus Petal */}
    <path
      d="M50 8 C47 22 43 32 50 42 C57 32 53 22 50 8Z"
      fill={color}
    />
    {/* Inner teardrop in top flame */}
    <path
      d="M50 16 C48.5 24 46.5 29 50 35 C53.5 29 51.5 24 50 16Z"
      fill="#14171a"
    />
    
    {/* Diagonal Upper Petals */}
    <path
      d="M62 16 C67 28 62 38 52 44 C62 40 73 34 62 16Z"
      fill={color}
    />
    <path
      d="M38 16 C33 28 38 38 48 44 C38 40 27 34 38 16Z"
      fill={color}
    />

    {/* Side Petals / Sun Rays */}
    <path
      d="M75 32 C78 44 71 52 58 52 C71 50 79 42 75 32Z"
      fill={color}
    />
    <path
      d="M25 32 C22 44 29 52 42 52 C29 50 21 42 25 32Z"
      fill={color}
    />

    <path
      d="M78 52 C76 64 68 70 56 65 C68 66 77 60 78 52Z"
      fill={color}
    />
    <path
      d="M22 52 C24 64 32 70 44 65 C32 66 23 60 22 52Z"
      fill={color}
    />

    {/* Bottom Petals */}
    <path
      d="M64 72 C58 82 52 82 50 70 C54 77 60 78 64 72Z"
      fill={color}
    />
    <path
      d="M36 72 C42 82 48 82 50 70 C46 77 40 78 36 72Z"
      fill={color}
    />

    {/* Face Mask / Sun disc Center */}
    <circle cx="50" cy="58" r="16" fill={color} />
    {/* Split face shadow for dual divine nature */}
    <path
      d="M50 42 A16 16 0 0 1 50 74 Z"
      fill="#121316"
      opacity="0.9"
    />
    
    {/* Eyes */}
    <ellipse cx="44" cy="56" rx="2.5" ry="1.5" fill={color} />
    <ellipse cx="56" cy="56" rx="2.5" ry="1.5" fill="#121316" />
    
    {/* Sacred Third Eye / Tilak */}
    <ellipse cx="50" cy="48" rx="1.5" ry="3" fill="#e8c36a" />

    {/* Subtle smile/calm expression curve */}
    <path
      d="M45 64 Q50 67 55 64"
      stroke="#caa257"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />

    {/* Rays surround */}
    <circle cx="50" cy="58" r="20" stroke={color} strokeWidth="1" strokeDasharray="1.5 4" opacity="0.8" />
  </svg>
);

// Ornate 18 Emblem for Caddie's Note
export const CaddieNoteEmblem = ({ className = "", size = 160 }) => (
  <svg
    width={size}
    height={size * 0.65}
    viewBox="0 0 240 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Horizontal filigree lines */}
    <line x1="20" y1="75" x2="80" y2="75" stroke="#caa257" strokeWidth="1.5" />
    <circle cx="18" cy="75" r="2.5" fill="#caa257" />
    <line x1="160" y1="75" x2="220" y2="75" stroke="#caa257" strokeWidth="1.5" />
    <circle cx="222" cy="75" r="2.5" fill="#caa257" />

    {/* Delicate scroll accents */}
    <path d="M70 75 C75 68 85 70 88 75 C85 80 75 82 70 75Z" fill="#caa257" opacity="0.7" />
    <path d="M170 75 C165 68 155 70 152 75 C155 80 165 82 170 75Z" fill="#caa257" opacity="0.7" />

    {/* Upper sunburst and crest */}
    <circle cx="120" cy="30" r="12" fill="#caa257" />
    <path d="M120 10 L120 18" stroke="#caa257" strokeWidth="2" strokeLinecap="round" />
    <path d="M106 16 L112 22" stroke="#caa257" strokeWidth="2" strokeLinecap="round" />
    <path d="M134 16 L128 22" stroke="#caa257" strokeWidth="2" strokeLinecap="round" />
    <path d="M100 30 L108 30" stroke="#caa257" strokeWidth="2" strokeLinecap="round" />
    <path d="M140 30 L132 30" stroke="#caa257" strokeWidth="2" strokeLinecap="round" />

    {/* Mask / divine crown in crest */}
    <path
      d="M112 30 Q120 22 128 30 Q124 38 120 40 Q116 38 112 30Z"
      fill="#14171a"
    />

    {/* Open Book Arch */}
    <path
      d="M95 95 C108 85 116 88 120 92 C124 88 132 85 145 95 L145 52 C132 46 124 48 120 52 C116 48 108 46 95 52 Z"
      fill="none"
      stroke="#caa257"
      strokeWidth="2.5"
    />
    <path
      d="M95 98 C108 88 116 91 120 95 C124 91 132 88 145 98"
      stroke="#caa257"
      strokeWidth="1.5"
      fill="none"
    />

    {/* Roman/Numerals 18 in center of book */}
    <text
      x="108"
      y="76"
      fontFamily="'Cinzel', 'Cormorant Garamond', serif"
      fontSize="22"
      fontWeight="700"
      fill="#caa257"
      textAnchor="middle"
    >
      1
    </text>
    <text
      x="130"
      y="76"
      fontFamily="'Cinzel', 'Cormorant Garamond', serif"
      fontSize="22"
      fontWeight="700"
      fill="#caa257"
      textAnchor="middle"
    >
      8
    </text>

    {/* Baroque leaves under book */}
    <path
      d="M102 100 C92 110 82 104 78 112 C92 114 105 106 112 98 Z"
      fill="#caa257"
    />
    <path
      d="M138 100 C148 110 158 104 162 112 C148 114 135 106 128 98 Z"
      fill="#caa257"
    />
  </svg>
);

// Retailer Icons
export const AmazonIcon = () => (
  <span className="inline-flex items-center text-amber-300 font-bold tracking-tight text-sm">
    <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.9 14.2c-.4.3-.8.4-1.3.4-1 0-1.5-.6-1.5-1.5 0-1.3 1-1.7 2.8-1.7v.5c0 .9 0 2.3 0 2.3zm2.5 3.3c-.2.2-.5.3-.8.1-.8-.6-1.8-1.1-2.9-1.1-1.8 0-2.8 1.1-2.8 2.5 0 1.6 1.3 2.7 3.3 2.7 1.4 0 2.7-.6 3.4-1.3.3-.3.6-.1.6.3l.1 1c-1 .8-2.5 1.4-4.3 1.4-3.1 0-5.2-1.9-5.2-4.5 0-2.4 1.7-4.2 4.6-4.2 1.3 0 2.4.4 3.1.8v-2.3c0-1.7-.9-2.5-2.8-2.5-1.2 0-2.5.4-3.5 1.1-.3.2-.6.1-.7-.2l-.4-.8c-.1-.3 0-.6.3-.8 1.3-.9 2.9-1.4 4.6-1.4 2.8 0 4.4 1.4 4.4 4.2v5.7c0 .4.2.6.5.6.3 0 .5-.2.5-.2l.4.7c-.2.3-.6.5-1 .5-.6 0-1.1-.4-1.3-1.1l-.2-.3z" />
    </svg>
    amazon
  </span>
);

export const FlipkartIcon = () => (
  <span className="inline-flex items-center text-yellow-400 font-bold tracking-tight text-sm">
    <span className="bg-yellow-400 text-blue-900 rounded-sm px-1 py-0.5 text-xs font-black mr-1">
      f
    </span>
    flipkart
  </span>
);

export const KindleIcon = () => (
  <span className="inline-flex items-center text-orange-300 font-medium tracking-tight text-sm">
    <span className="font-serif italic font-bold mr-1 text-base">k</span>
    kindle
  </span>
);
