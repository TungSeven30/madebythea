'use client';

/**
 * Display rack of clothing items for sale
 */

import { motion } from 'framer-motion';
import { ClothingPreview } from '@/components/shared';
import { PriceTag } from '@/components/ui';
import type { ClothingItem } from '@/types';

interface ClothesRackProps {
  items: ClothingItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ClothesRack({ items, selectedId, onSelect }: ClothesRackProps) {
  return (
    <div className="bg-amber-100 rounded-3xl border-4 border-amber-300 p-4">
      <div className="text-center text-2xl mb-3">🧥 Your Clothes 🧥</div>
      <div className="flex flex-wrap gap-4 justify-center">
        {items.map((item) => (
          <motion.div
            key={item.id}
            className={`
              relative flex flex-col items-center gap-1 p-2 rounded-xl cursor-pointer
              ${selectedId === item.id ? 'bg-purple-200 ring-4 ring-purple-400' : 'bg-white'}
            `}
            onClick={() => onSelect(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={selectedId === item.id ? { y: [0, -5, 0] } : {}}
            transition={{ repeat: selectedId === item.id ? Infinity : 0, duration: 0.5 }}
          >
            <ClothingPreview item={item} size="small" />
            <PriceTag price={item.price} size="small" />
            {selectedId === item.id && (
              <motion.div
                className="absolute -top-2 -right-2 text-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                👆
              </motion.div>
            )}
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="text-gray-500 py-8">
            No clothes yet! Go to Workshop to make some.
          </div>
        )}
      </div>
    </div>
  );
}
