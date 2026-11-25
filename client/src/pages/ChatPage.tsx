import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import PromptBox from "../components/PromptBox";
import { useChatAgent, useGetChatById } from "../hooks/useChat";
import { useUserProfile } from "../hooks/useAuth";
import { useAppStore } from "../store/appStore";
import ChatAndBuilderHeader from "../components/ChatAndBuilderHeader";
import AIMessageFormat from "../components/AIMessageFormat";



export default function ChatPage() {

  const {chatId} = useParams()
  if(!chatId){
    throw new Error("chatId dones't exist on params");
  }

  const {user} = useUserProfile();
  const {messages, chat} = useGetChatById(chatId, Boolean(user));

  const prompt = useAppStore((state) => state.prompt);
  const setPrompt = useAppStore((state) => state.setPrompt);

  const mutation = useChatAgent();

  // The last thing the user asked, sent along when they open the builder
  // const lastPrompt = [...messages].reverse().find((message) => message.role === "user")?.content;

  const handleGenerate = () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) return;

    setPrompt("");

    mutation.mutate({prompt: userPrompt, chatId})
  };


  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  };


  return (
    <>
      <ChatAndBuilderHeader title={chat?.title} />
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4">
        <div className="flex flex-1 flex-col gap-5 py-6">
          {messages?.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="max-w-[85%] self-end">
                <div className={`rounded-[20px_20px_4px_20px] border border-coral/30 bg-crimson/25 px-4 py-3 text-white`}>
                  {message.content}
                </div>
                <button type="button" onClick={() => handleCopy(message.content)} className=" float-right mt-1.5 flex cursor-pointer items-center gap-2 rounded-xl hover:bg-muted/10 px-2 py-1.5 text-xs text-muted hover:text-white">
                  <Copy size={16} />
                </button>
              </div>
            ) : (
              <div key={message.id} className="">
                <div className="flex flex-col items-start gap-3 leading-7 text-white">
                  {/* <p>{message.content}</p> */}
                  <AIMessageFormat content={message.content} />
                </div>
                {/* {message.code && (
                  <pre className="scrollbar-theme w-full overflow-x-auto rounded-2xl border border-line bg-surface p-4 font-mono text-xs leading-6 text-peach">{message.code}</pre>
                )} */}
                <button type="button" onClick={() => handleCopy(message.content)} className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl hover:bg-muted/10 px-2 py-1.5 text-xs text-muted hover:text-white">
                  <Copy size={16} />
                </button>
              </div>
            )
          )}

          {/* Hand-off to the builder */}
          {/* <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-line bg-glass p-4 backdrop-blur-[24px]">
            <div>
              <p className="font-semibold text-white">Want this as a small demo app?</p>
              <p className="text-muted">Switch to Builder and I will build it for you.</p>
            </div>
            <button type="button" onClick={() => navigate("/builder", { state: { prompt: lastPrompt } })} className="cursor-pointer whitespace-nowrap rounded-full bg-gradient-to-r from-crimson to-peach px-5 py-2.5 font-bold text-white shadow-glow transition hover:opacity-90">
              Open in Builder
            </button>
          </div> */}
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent py-4">
          <PromptBox onChange={setPrompt} value={prompt} onSubmit={handleGenerate} height={2} />
        </div>

      </div>
    </>
  );
}
