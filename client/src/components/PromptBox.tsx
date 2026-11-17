import type { KeyboardEvent } from "react";
import { ArrowUp, Mic, Paperclip } from "lucide-react";
import { useAppStore } from "../store/appStore";

type PromptBoxProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  height?: number;
};

export default function PromptBox({ value, onChange, onSubmit, height = 6 }: PromptBoxProps) {

  const mode = useAppStore((state) => state.mode);

  // Enter submits, Shift + Enter adds a new line
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full rounded-3xl border border-white/15 bg-white/[0.06] p-3 text-left shadow-glass backdrop-blur-2xl transition focus-within:border-coral/50 sm:rounded-[32px] sm:p-4">
      <textarea value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} rows={height} placeholder={mode === "chat" ? "Ask me anything..." : "Create a portfolio website..."} className="w-full resize-none bg-transparent px-3 py-2 text-cream placeholder:text-cream/40 outline-none" />

      <div className="relative">
        <button type="button" aria-label="Attach file" className="cursor-pointer text-peach hover:text-coral fixed bottom-3 left-3 sm:bottom-4 sm:left-5">
          <Paperclip size={16} />
        </button>

        <div className="flex items-center gap-2 fixed right-2 bottom-2 sm:right-3 sm:bottom-3">
          <button type="button" aria-label="Voice prompt" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 text-peach transition hover:border-peach hover:text-coral sm:h-10 sm:w-10 bg-surface">
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
