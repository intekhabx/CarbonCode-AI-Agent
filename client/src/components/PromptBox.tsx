import type { KeyboardEvent } from "react";
import { ArrowUp, Mic, Paperclip } from "lucide-react";

type PromptBoxProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function PromptBox({ value, onChange, onSubmit }: PromptBoxProps) {
  // Enter submits, Shift + Enter adds a new line
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full rounded-3xl border border-white/15 bg-white/[0.06] p-3 text-left shadow-glass backdrop-blur-2xl transition focus-within:border-coral/50 sm:rounded-[32px] sm:p-4">
      <textarea value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} rows={4} placeholder="Create a portfolio website..." className="w-full resize-none bg-transparent px-3 py-2 text-cream placeholder:text-cream/40 outline-none" />

      <div className="mt-2 flex items-center justify-between">
        <button type="button" aria-label="Attach file" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 text-peach transition hover:border-peach hover:text-coral sm:h-10 sm:w-10">
          <Paperclip size={16} />
        </button>

        <div className="flex items-center gap-2">
          <button type="button" aria-label="Voice prompt" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 text-peach transition hover:border-peach hover:text-coral sm:h-10 sm:w-10">
            <Mic size={16} />
          </button>

          <button type="button" onClick={onSubmit} disabled={!value.trim()} aria-label="Generate app" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-crimson to-peach text-white shadow-glow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:w-10">
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
