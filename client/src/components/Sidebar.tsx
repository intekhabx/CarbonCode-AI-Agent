
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Blocks, PanelLeftClose, PanelLeftOpen, SquarePen, UserRound, Settings, LogOut } from "lucide-react";
import { useUserProfile, useSignout } from "../hooks/useAuth";


type Chat = {
  id: string;
  title: string;
};

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

// Dummy chats, replace with real data later
const pinnedChats: Chat[] = [
  { id: "1", title: "Portfolio website for a designer" },
  { id: "2", title: "E-commerce store landing page" },
];

const recentChats: Chat[] = [
  { id: "3", title: "Resume website" },
  { id: "4", title: "Blog with dark mode" },
  { id: "5", title: "Coffee shop landing page" },
];

const ChatList = ({ title, chats }: { title: string; chats: Chat[] }) => (
  <div className="mt-6">
    <p className="mb-1 px-3 text-xs font-semibold text-muted">{title}</p>
    {chats.map((chat) => (
      <NavLink key={chat.id} to={`/chat/${chat.id}`} className={({ isActive }) => `block truncate rounded-xl px-3 py-2 transition ${isActive ? "bg-white/10 text-cream" : "text-muted hover:bg-white/5 hover:text-cream"}`}>
        {chat.title}
      </NavLink>
    ))}
  </div>
);


export default function Sidebar({ isOpen, onToggle }: SidebarProps) {

  const { user } = useUserProfile();
  const signoutMutation = useSignout();
  const [showProfile, setShowProfile] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) => `flex cursor-pointer items-center gap-3 rounded-xl py-2 transition ${isOpen ? "px-3" : "justify-center"} ${isActive ? "bg-white/10 text-cream" : "text-muted hover:bg-white/5 hover:text-cream"}`;


  return (
    <>
      {/* Dark backdrop on mobile, tap to close */}
      {isOpen && <div onClick={onToggle} className="fixed inset-0 z-30 bg-black/50 md:hidden" />}

      {/* Keeps the page content from going under the sidebar (nothing is reserved on mobile, the sidebar floats over the page) */}
      <div className={`w-0 shrink-0 transition-all duration-300 ${isOpen ? "md:w-64" : "md:w-16"}`}>

        {/* Mobile: slides in as a drawer. Desktop: full sidebar or a small icon rail */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 transition-all duration-300 ${isOpen ? "md:w-64" : "-translate-x-full md:w-16 md:translate-x-0"}`}>

          <aside className="flex h-full flex-col overflow-visible border-r border-white/15 bg-white/[0.06] shadow-glass backdrop-blur-2xl">

            <div className={`flex h-16 shrink-0 items-center ${isOpen ? "justify-between px-4" : "justify-center"}`}>
              <Link to="/" className="flex cursor-pointer items-center gap-1">
                <img src="/favicon.svg" alt="CarbonCode logo" className="h-8 w-8" />
                {isOpen && (
                  <span className="text-lg font-semibold text-white">
                    Carbon<span className="text-coral">Code</span>
                  </span>
                )}
              </Link>
              {isOpen && (
                <button type="button" onClick={onToggle} aria-label="Close sidebar" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-cream">
                  <PanelLeftClose size={18} />
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-1 px-2">
              <NavLink to="/" end title="New chat" className={linkClass}>
                <SquarePen size={18} className="shrink-0" />
                {isOpen && "New chat"}
              </NavLink>
              <NavLink to="/builder" title="Builder" className={linkClass}>
                <Blocks size={18} className="shrink-0" />
                {isOpen && "Builder"}
              </NavLink>
            </nav>

            <div className="flex-1 overflow-y-auto px-2 [scrollbar-width:thin]">
              {isOpen && (
                <>
                  <ChatList title="Pinned" chats={pinnedChats} />
                  <ChatList title="Recent" chats={recentChats} />
                </>
              )}
            </div>

            {user && (
              <div className={`relative z-50 shrink-0 border-t border-white/15 ${isOpen ? "p-3" : "p-2"}`}>
                <button
                  type="button"
                  onClick={() => setShowProfile(!showProfile)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl p-1 text-left transition hover:bg-white/10 ${isOpen ? "" : "justify-center"}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-crimson text-xs font-bold uppercase text-cream">{user.name?.[0]}</div>
                  {isOpen && (
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{user.name}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                  )}
                </button>

                {showProfile && (
                  <div className={`fixed z-50 mb-2 overflow-hidden rounded-2xl border border-white/15 bg-surface p-3 shadow-glass ${
                    isOpen
                      ? "bottom-20 left-2 w-60"
                      : "bottom-2 left-20 w-64"
                  }`}>

                    <div className="flex items-center gap-3 border-b border-white/15 px-1 pb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-crimson text-sm font-bold uppercase text-cream">
                        {user.name?.[0]}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                        <p className="truncate text-xs text-muted">{user.email}</p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-1">
                      <NavLink to="/profile"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream transition hover:bg-white/10"
                      >
                        <UserRound size={19} />Profile</NavLink>

                      <NavLink to="/settings"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream transition hover:bg-white/10"
                      >
                        <Settings size={19} />Settings</NavLink>

                      <button
                        type="button"
                        onClick={() => {
                          setShowProfile(false);
                          signoutMutation.mutate();
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                      >
                        <LogOut size={19} />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </aside>

          {/* Icon rail on desktop: the open icon sits on the sidebar border (outside the aside so it is not clipped) */}
          {!isOpen && (
            <button type="button" onClick={onToggle} aria-label="Open sidebar" className="absolute -right-4 top-4 hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-background text-muted shadow-glass transition hover:text-cream md:flex">
              <PanelLeftOpen size={18} />
            </button>
          )}

        </div>
      </div>
    </>
  );
}
