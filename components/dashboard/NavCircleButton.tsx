'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface NavCircleButtonProps {
  href: string;
  label: string;
  icon: string;
  color: string;
  description?: string;
}

export default function NavCircleButton({ href, label, icon, color, description }: NavCircleButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={href}
          className={`flex flex-col items-center justify-center w-44 h-44 rounded-full bg-gradient-to-br ${color} shadow-xl text-white font-bold text-2xl select-none`}
        >
          <span className="text-5xl mb-1 drop-shadow">{icon}</span>
          <span className="tracking-wide">{label}</span>
        </Link>
      </motion.div>
      {description && (
        <p className="text-xs text-slate-500 text-center max-w-[140px]">{description}</p>
      )}
    </div>
  );
}
