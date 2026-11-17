import { MessageCircleDashed } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { VscChatSparkle } from "react-icons/vsc";
import { HiOutlineMenuAlt2 } from "react-icons/hi";



type ChatAndBuilderHeaderProps = {
  title: string | undefined;
}

export default function ChatAndBuilderHeader({title}: ChatAndBuilderHeaderProps) {

  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-20 w-full" >
      <div className={`flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3 backdrop-blur-3xl`}>
        <div className="flex items-center gap-1">
          {/* Mobile only: opens the sidebar drawer */}
          <button type="button" onClick={toggleSidebar} aria-label="Open menu" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-cream transition hover:bg-white/10 md:hidden backdrop:blur-2xl bg-surface/80">
            <HiOutlineMenuAlt2 size={20} />
          </button>

          {/* Large Only: shows in large or medium screen*/}
          <div className="hidden md:flex justify-center items-center gap-2 text-cream">
            <VscChatSparkle size={16} strokeWidth={1} className="mt-1" />
            <h2 className="font-semibold tracking-wide">
              {title || "New Chat"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="text-cream cursor-pointer">
            <MessageCircleDashed size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
