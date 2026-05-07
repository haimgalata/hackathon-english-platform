type BadgeVariant = 'score' | 'level' | 'new' | 'default';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  score:   'bg-blue-100 text-blue-700',
  level:   'bg-purple-100 text-purple-700',
  new:     'bg-green-100 text-green-700',
  default: 'bg-slate-100 text-slate-700',
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
