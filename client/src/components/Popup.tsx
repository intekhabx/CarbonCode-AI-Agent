
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface PopupProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Popup = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
  onConfirm,
  onCancel,
}: PopupProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/75 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby={description ? "popup-description" : undefined}
        className="w-full max-w-[400px] rounded-2xl border border-line bg-surface p-6 shadow-glass"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-glass text-coral">
            <AlertCircle size={20} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 id="popup-title" className="text-base font-semibold text-label">
              {title}
            </h2>

            {description && (
              <p id="popup-description" className="mt-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-line bg-glass px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-label disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variant === "danger" ? "bg-crimson shadow-glow hover:bg-coral" : "bg-gradient-to-r from-crimson via-coral to-peach text-background hover:brightness-110"}`}
          >
            {isLoading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
