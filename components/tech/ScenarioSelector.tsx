'use client';

import { motion } from 'framer-motion';
import { SCENARIOS } from '@/lib/scenarios';
import type { ScenarioKey } from '@/types';

interface ScenarioSelectorProps {
  selected: ScenarioKey;
  onSelect: (key: ScenarioKey) => void;
}

export default function ScenarioSelector({ selected, onSelect }: ScenarioSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 px-1 scrollbar-hide">
      {(Object.values(SCENARIOS)).map((scenario) => {
        const isSelected = scenario.key === selected;
        return (
          <motion.button
            key={scenario.key}
            onClick={() => onSelect(scenario.key)}
            whileTap={{ scale: 0.96 }}
            className={`flex-shrink-0 flex flex-col items-start gap-1 px-4 py-3 rounded-2xl border-2 text-left transition-all min-w-[140px] ${
              isSelected
                ? `bg-gradient-to-br ${scenario.color} border-transparent text-white shadow-md`
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'
            }`}
          >
            <span className="text-xl">{scenario.icon}</span>
            <span className="text-xs font-bold leading-tight">{scenario.label}</span>
            <span className={`text-xs leading-tight ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
              {scenario.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
