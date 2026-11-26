import { useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, Monitor, Smartphone, Tablet } from "lucide-react";
import PromptBox from "../components/PromptBox";
import { useAppStore } from "../store/appStore";
import ChatAndBuilderHeader from "../components/ChatAndBuilderHeader";


type Message = {
  id: number;
  role: "user" | "ai";
  text: string;
  steps?: string[];
};

const devices = [
  { key: "desktop", label: "Desktop", Icon: Monitor, width: "max-w-full" },
  { key: "tablet", label: "Tablet", Icon: Tablet, width: "max-w-xl" },
  { key: "mobile", label: "Mobile", Icon: Smartphone, width: "max-w-xs" },
];

// Dummy generated code, replace with the real project files later
const dummyCode = `export default function Hero() {
  return (
    <section>
      <h1>Hi, I am a product designer</h1>
      <p>I design simple and clear products.</p>
    </section>
  );
}`;

export default function BuilderPage() {

  // The prompt comes from the home page or from the chat page ("Open in Builder")
  const location = useLocation();
  const firstPrompt = (location.state as { prompt?: string } | null)?.prompt ?? "Create a portfolio website for a product designer.";

  const prompt = useAppStore((state) => state.prompt);
  const setPrompt = useAppStore((state) => state.setPrompt);

  // Dummy messages, replace with real data later
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "user", text: firstPrompt },
    { id: 2, role: "ai", text: "Done. Here is what I built:", steps: ["Layout and navigation", "Hero with your headline", "Projects grid", "Contact section"] },
  ]);
  const [tab, setTab] = useState<"chat" | "preview">("chat");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState(devices[0]);

  const handleSend = () => {
    if (!prompt.trim()) return;

    setMessages([...messages, { id: Date.now(), role: "user", text: prompt.trim() }]);
    setPrompt("");
    // TODO: connect real API and update the preview
  };



  return (
    <div className="flex h-screen flex-col">
      {/* Mobile only: switch between the chat and the preview */}
      <div className="sticky top-0 z-20 md:hidden backdrop-blur-[24px]">
        <ChatAndBuilderHeader title={"i am a devil"} />

        <div className="mx-4 mb-2 flex rounded-full border border-line bg-glass p-1 backdrop-blur-[24px]">
          {(["chat", "preview"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setTab(item)} className={`flex-1 cursor-pointer rounded-full py-2 font-semibold capitalize transition ${tab === item ? "bg-white/15 text-white" : "text-muted"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Chat */}
        <section className={`min-h-0 w-full flex-col md:flex md:w-96 md:shrink-0 md:border-r md:border-line ${tab === "chat" ? "flex" : "hidden"}`}>
          {/* show only header in chatbox in large screen */}
          <div className="hidden md:block">
            <ChatAndBuilderHeader title={"i am a devil"} />
          </div>
          <div className="scrollbar-theme flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="max-w-[85%] self-end rounded-[20px_20px_4px_20px] border border-coral/30 bg-crimson/25 px-4 py-3 text-white">
                  {message.text}
                </div>
              ) : (
                <div key={message.id} className="max-w-[92%] rounded-[20px_20px_20px_4px] border border-line bg-glass px-4 py-3 leading-7 backdrop-blur-[24px]">
                  <p className="text-white">{message.text}</p>
                  {message.steps && (
                    <ul className="mt-2 flex flex-col gap-1 font-mono text-xs text-peach">
                      {message.steps.map((step) => (
                        <li key={step} className="flex items-center gap-2">
                          <Check size={14} className="shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            )}
          </div>

          <div className="p-4 sticky bottom-0 w-full">
            <PromptBox onChange={setPrompt} onSubmit={handleSend} value={prompt} height={2} />
          </div>
        </section>

        {/* Preview */}
        <section className={`min-h-0 min-w-0 flex-1 flex-col gap-3 p-4 md:flex ${tab === "preview" ? "flex" : "hidden"}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex rounded-full border border-line bg-glass p-1 backdrop-blur-[24px]">
              {(["preview", "code"] as const).map((item) => (
                <button key={item} type="button" onClick={() => setView(item)} className={`cursor-pointer rounded-full px-4 py-1.5 font-medium capitalize transition ${view === item ? "bg-white/15 text-white" : "text-muted hover:text-cream"}`}>
                  {item}
                </button>
              ))}
            </div>

            {/* Device sizes only make sense on bigger screens */}
            <div className="hidden gap-1 rounded-full border border-line bg-glass p-1 backdrop-blur-[24px] sm:flex">
              {devices.map((item) => (
                <button key={item.key} type="button" onClick={() => setDevice(item)} aria-label={item.label} className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition ${device.key === item.key ? "bg-white/15 text-white" : "text-muted hover:text-cream"}`}>
                  <item.Icon size={16} />
                </button>
              ))}
            </div>

            <button type="button" onClick={() => toast.success("Publish will be connected soon")} className="cursor-pointer rounded-full bg-gradient-to-r from-crimson to-peach px-5 py-2 font-bold text-white shadow-glow transition hover:opacity-90">
              Publish
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-line bg-glass backdrop-blur-[24px]">
            <div className="border-b border-line p-3">
              <p className="rounded-full bg-surface px-4 py-1.5 text-center font-mono text-[11px] text-muted">carboncode.app/preview/portfolio</p>
            </div>

            {view === "code" ? (
              <pre className="scrollbar-theme flex-1 overflow-auto bg-surface p-4 font-mono text-xs leading-6 text-peach">{dummyCode}</pre>
            ) : (
              <div className="scrollbar-theme flex-1 overflow-auto bg-white">
                <div className={`mx-auto min-h-full ${device.width} p-6`}>
                  <div className="flex justify-between">
                    <div className="h-3 w-20 rounded bg-black/80" />
                    <div className="h-3 w-40 rounded bg-black/10" />
                  </div>
                  <div className="mt-12 max-w-sm">
                    <div className="h-7 w-11/12 rounded-lg bg-black/80" />
                    <div className="mt-2 h-7 w-3/5 rounded-lg bg-crimson" />
                    <div className="mt-5 h-2.5 w-4/5 rounded bg-black/10" />
                    <div className="mt-2 h-2.5 w-2/3 rounded bg-black/10" />
                    <div className="mt-6 h-9 w-32 rounded-full bg-black/80" />
                  </div>
                  <div className="mt-12 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="h-24 rounded-2xl bg-black/5" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
