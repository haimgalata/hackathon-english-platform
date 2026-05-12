import { TechyAvatar } from "./Avatar";

type Props = {
  speaker: "TECHY" | "STUDENT";
  text: string;
  speaking?: boolean;
};

export function ChatBubble({ speaker, text, speaking = false }: Props) {
  const isTechy = speaker === "TECHY";

  return (
    <div className={`flex gap-3 animate-slide_up ${isTechy ? "justify-start" : "justify-end"}`}>
      {isTechy && <TechyAvatar size="sm" speaking={speaking} />}
      <div className={`max-w-[75%] ${isTechy ? "" : "order-first"}`}>
        <p className={`text-[11px] font-medium mb-1 ${isTechy ? "text-brand-secondary" : "text-slate-400 text-right"}`}>
          {isTechy ? "Techy" : "You"}
        </p>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isTechy
              ? "bg-brand-primary/15 border border-brand-primary/25 text-slate-100 rounded-tl-sm"
              : "bg-white/10 border border-white/15 text-slate-100 rounded-tr-sm"
          }`}
        >
          {text}
        </div>
      </div>
      {!isTechy && <div className="w-8 flex-shrink-0" />}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start animate-slide_up">
      <TechyAvatar size="sm" speaking={true} />
      <div>
        <p className="text-[11px] font-medium mb-1 text-brand-secondary">Techy</p>
        <div className="bg-brand-primary/15 border border-brand-primary/25 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-bounce_dots"
              style={{ animationDelay: `${i * 0.15}s` }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
