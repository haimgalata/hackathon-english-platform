type BadgeVariant = 'score' | 'level' | 'new' | 'default';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  score:   'bg-[#00d4ff]/[0.1] text-[#00d4ff] border border-[#00d4ff]/20',
  level:   'bg-[#e040fb]/[0.1] text-[#e040fb] border border-[#e040fb]/20',
  new:     'bg-emerald-500/[0.1] text-emerald-400 border border-emerald-500/20',
  default: 'bg-white/[0.06] text-white/60 border border-white/[0.1]',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </span>
  );
}
