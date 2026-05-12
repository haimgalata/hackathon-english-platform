type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizes: Record<AvatarSize, { outer: string; inner: string; svg: string }> = {
  sm: { outer: "w-8 h-8", inner: "w-8 h-8", svg: "w-5 h-5" },
  md: { outer: "w-12 h-12", inner: "w-12 h-12", svg: "w-7 h-7" },
  lg: { outer: "w-16 h-16", inner: "w-16 h-16", svg: "w-9 h-9" },
  xl: { outer: "w-24 h-24", inner: "w-24 h-24", svg: "w-14 h-14" },
};

type Props = {
  size?: AvatarSize;
  speaking?: boolean;
  className?: string;
};

export function TechyAvatar({ size = "md", speaking = false, className = "" }: Props) {
  const s = sizes[size];
  return (
    <div className={`relative flex-shrink-0 ${s.outer} ${className}`}>
      {speaking && (
        <span
          className="absolute inset-0 rounded-full bg-brand-primary/30 animate-pulse_ring"
          aria-hidden="true"
        />
      )}
      <div
        className={`${s.inner} rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-glow-sm`}
      >
        <TechyFace className={s.svg} />
      </div>
    </div>
  );
}

function TechyFace({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {/* Head */}
      <circle cx="16" cy="13" r="7" fill="white" fillOpacity="0.95" />
      {/* Eyes */}
      <circle cx="13.5" cy="12" r="1.2" fill="#6366F1" />
      <circle cx="18.5" cy="12" r="1.2" fill="#6366F1" />
      {/* Smile */}
      <path d="M13 15.5 Q16 18 19 15.5" stroke="#6366F1" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Body/circuit lines */}
      <rect x="11" y="21" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.75" />
      <rect x="13" y="23.5" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.55" />
      <rect x="14.5" y="26" width="3" height="1.5" rx="0.75" fill="white" fillOpacity="0.35" />
      {/* Antenna */}
      <line x1="16" y1="6" x2="16" y2="3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16" cy="2.5" r="1" fill="white" fillOpacity="0.9" />
    </svg>
  );
}
