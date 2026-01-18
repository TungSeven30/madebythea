'use client';

/**
 * Visual preview of a clothing item
 */

import { motion } from 'framer-motion';
import type { ClothingItem, ClothingShape, ClothingColor, ClothingPattern } from '@/types';
import { COLOR_HEX } from '@/types';

interface ClothingPreviewProps {
  item?: ClothingItem;
  shape?: ClothingShape;
  color?: ClothingColor;
  pattern?: ClothingPattern;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  draggable?: boolean;
  className?: string;
}

const sizeStyles = {
  small: 'w-16 h-20',
  medium: 'w-24 h-28',
  large: 'w-32 h-40',
};

/**
 * Render SVG for each clothing shape
 */
function ClothingSvg({ shape, fill, stroke }: { shape: ClothingShape; fill: string; stroke: string }) {
  switch (shape) {
    case 'shirt':
      return (
        <g>
          {/* T-shirt body */}
          <path
            d="M22 18 L22 48 L38 48 L38 18 L44 18 L44 28 L38 28 L38 18 L22 18 L22 28 L16 28 L16 18 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          {/* Neckline */}
          <path
            d="M26 18 Q30 22 34 18"
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
          />
        </g>
      );
    case 'dress':
      return (
        <g>
          {/* Dress body - A-line */}
          <path
            d="M24 14 L24 20 L18 48 L42 48 L36 20 L36 14 Q30 18 24 14 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          {/* Straps */}
          <line x1="26" y1="8" x2="26" y2="14" stroke={stroke} strokeWidth="2" />
          <line x1="34" y1="8" x2="34" y2="14" stroke={stroke} strokeWidth="2" />
        </g>
      );
    case 'pants':
      return (
        <g>
          {/* Pants with two legs */}
          <path
            d="M20 12 L40 12 L40 24 L36 48 L32 48 L30 28 L28 48 L24 48 L20 24 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          {/* Waistband */}
          <line x1="20" y1="16" x2="40" y2="16" stroke={stroke} strokeWidth="1.5" />
        </g>
      );
    case 'skirt':
      return (
        <g>
          {/* Flared skirt */}
          <path
            d="M24 14 L36 14 L36 18 L44 48 L16 48 L24 18 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          {/* Waistband */}
          <rect x="24" y="14" width="12" height="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </g>
      );
    default:
      return (
        <rect x="20" y="15" width="20" height="30" fill={fill} stroke={stroke} strokeWidth="1.5" />
      );
  }
}

/**
 * Get pattern overlay
 */
function PatternOverlay({
  pattern,
  color,
}: {
  pattern: ClothingPattern;
  color: string;
}) {
  const patternColor = color === '#FFFFFF' ? '#CCCCCC' : '#FFFFFF';

  switch (pattern) {
    case 'stripes':
      return (
        <g opacity="0.5">
          <line x1="22" y1="0" x2="22" y2="60" stroke={patternColor} strokeWidth="2" />
          <line x1="28" y1="0" x2="28" y2="60" stroke={patternColor} strokeWidth="2" />
          <line x1="34" y1="0" x2="34" y2="60" stroke={patternColor} strokeWidth="2" />
        </g>
      );
    case 'dots':
      return (
        <g opacity="0.6">
          <circle cx="25" cy="20" r="2" fill={patternColor} />
          <circle cx="35" cy="20" r="2" fill={patternColor} />
          <circle cx="30" cy="30" r="2" fill={patternColor} />
          <circle cx="25" cy="40" r="2" fill={patternColor} />
          <circle cx="35" cy="40" r="2" fill={patternColor} />
        </g>
      );
    case 'hearts':
      return (
        <g opacity="0.7" fill={patternColor}>
          <path d="M30 22 C28 18 24 18 24 22 C24 26 30 30 30 30 C30 30 36 26 36 22 C36 18 32 18 30 22" transform="scale(0.5) translate(30, 30)" />
          <path d="M30 22 C28 18 24 18 24 22 C24 26 30 30 30 30 C30 30 36 26 36 22 C36 18 32 18 30 22" transform="scale(0.5) translate(30, 60)" />
        </g>
      );
    case 'stars':
      return (
        <g opacity="0.7" fill={patternColor}>
          <polygon points="30,16 31,19 34,19 32,21 33,24 30,22 27,24 28,21 26,19 29,19" />
          <polygon points="30,32 31,35 34,35 32,37 33,40 30,38 27,40 28,37 26,35 29,35" />
        </g>
      );
    default:
      return null;
  }
}

export function ClothingPreview({
  item,
  shape: propShape,
  color: propColor,
  pattern: propPattern,
  size = 'medium',
  onClick,
  draggable = false,
  className = '',
}: ClothingPreviewProps) {
  const shape = item?.shape ?? propShape ?? 'shirt';
  const color = item?.color ?? propColor ?? 'white';
  const pattern = item?.pattern ?? propPattern ?? 'none';

  const colorHex = COLOR_HEX[color];

  return (
    <motion.div
      className={`
        ${sizeStyles[size]}
        bg-white rounded-xl border-4 border-gray-200
        flex items-center justify-center
        ${onClick ? 'cursor-pointer hover:border-purple-400' : ''}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={onClick || draggable ? { scale: 1.05 } : {}}
      whileTap={onClick || draggable ? { scale: 0.95 } : {}}
      draggable={draggable}
    >
      <svg viewBox="0 0 60 55" className="w-full h-full p-1">
        {/* Shadow */}
        <g transform="translate(2, 2)" opacity="0.15">
          <ClothingSvg shape={shape} fill="#000000" stroke="transparent" />
        </g>
        {/* Main shape */}
        <ClothingSvg shape={shape} fill={colorHex} stroke="#00000044" />
        {/* Pattern overlay */}
        <PatternOverlay pattern={pattern} color={colorHex} />
      </svg>
    </motion.div>
  );
}
