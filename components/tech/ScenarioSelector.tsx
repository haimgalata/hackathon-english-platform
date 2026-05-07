'use client';

import { motion } from 'framer-motion';
import { SCENARIOS } from '@/lib/scenarios';
import type { ScenarioKey } from '@/types';

interface ScenarioSelectorProps {
  selected: ScenarioKey;
  onSelect: (key: ScenarioKey) => void;
}

const SCENARIO_ACCENT: Record<ScenarioKey, { color: string; glow: string; border: string }> = {
  interview: { color: '#00d4ff', glow: 'rgba(0,212,255,0.12)', border: 'rgba(0,212,255,0.4)' },
  friends:   { color: '#34d399', glow: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.4)' },
  workplace: { color: '#e040fb', glow: 'rgba(224,64,251,0.12)', border: 'rgba(224,64,251,0.4)' },
};

export default function ScenarioSelector({ selected, onSelect }: ScenarioSelectorProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
      {(Object.values(SCENARIOS)).map((scenario) => {
        const isSelected = scenario.key === selected;
        const accent = SCENARIO_ACCENT[scenario.key];

        return (
          <motion.button
            key={scenario.key}
            onClick={() => onSelect(scenario.key)}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 flex flex-col items-start gap-1 px-3.5 py-2.5 rounded-xl text-left transition-all min-w-[130px]"
            style={{
              background: isSelected ? accent.glow : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isSelected ? accent.border : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span
              className="text-[10px] font-bold leading-tight tracking-wide uppercase"
              style={{ color: isSelected ? accent.color : 'rgba(255,255,255,0.5)' }}
            >
              {scenario.label}
            </span>
            <span className="text-[10px] leading-tight" style={{ color: isSelected ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)' }}>
              {scenario.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
