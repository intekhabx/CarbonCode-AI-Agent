import { useEffect, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Blocks, ChevronDown, ChevronRight, Code2Icon, LogOut, MessagesCircle, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Pencil, Settings, SquarePen, Trash2, UserRound } from "lucide-react";
import { VscPinned, VscUnpin } from "react-icons/vsc";
import { useUserProfile, useSignout } from "../hooks/useAuth";
import type { IconType } from "react-icons/lib";
import { useDeleteChat, useGetAllChats, useTogglePinnedChat } from "../hooks/useChat";
import type { Chat } from "../../../types/chat-types";
import Popup from "./Popup";
import { useAppStore } from "../store/appStore";


type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}


// Size of the 3 dot menu card, used to open it upwards when there is no space below
const MENU_WIDTH = 160;
const MENU_HEIGHT = 124;

const menuButtonClass = "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-cream transition hover:bg-white/10";


const SidebarSection = ({ title, Icon, children }: { title: string; Icon: IconType; children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mt-4">
      <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="flex w-full cursor-pointer items-center gap-2 px-3 py-1 text-xs font-semibold text-white/90 transition hover:text-cream">
        <Icon size={14} />
        {title}
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {isExpanded && children}
    </div>
  );
};



export default function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {

  const isPopupOpen = useAppStore((state) => state.isPopupOpen);
  const setIsPopupOpen = useAppStore((state) => state.setIsPopupOpen);

  const navigate = useNavigate();

  const { user } = useUserProfile();
  const signoutMutation = useSignout();

  const {data: allChatsData} = useGetAllChats(Boolean(user));
  const togglePinnedChatMutation = useTogglePinnedChat();
  const deleteChatMutation = useDeleteChat();

  const chats = allChatsData?.filter((data) => data.type === "chat" && !data.pinned);
  const apps = allChatsData?.filter((data) => data.type === "app" && !data.pinned);
  const pinnedChats = allChatsData?.filter((data) => data.pinned);

  const renderChats = (list: Chat[]) => {
    return list.map((data) => {
      return (
        <div key={data.id} className="relative">
          <NavLink to={data.type === "chat" ? `/chat/${data.id}` : `/builder/${data.id}`} className={({ isActive }) => `block truncate rounded-xl py-2 pl-3 pr-10 transition ${isActive ? "bg-white/10 text-cream" : "text-muted hover:bg-white/5 hover:text-cream"}`}>
            {data.title}
          </NavLink>
          <button type="button" onClick={(e) => openChatMenuCard(e, data.id)} aria-label="More options" className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-cream">
            <MoreHorizontal size={16} />
          </button>
        </div>
      )
    })
  }

  // user profile
  const [showProfile, setShowProfile] = useState(false);
  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  }

  // chat menu 3 dot
  const [chatMenuCard, setChatMenuCard] = useState<{id: string, top: number, left: number} | null>(null);

  const openChatMenuCard = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();

    setShowProfile(false);

    if (chatMenuCard?.id === id) {
      setChatMenuCard(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const top =
      rect.bottom + MENU_HEIGHT > window.innerHeight
        ? rect.top - MENU_HEIGHT - 4
        : rect.bottom + 4;

    setChatMenuCard({id, top, left: rect.right - MENU_WIDTH });
  };



  const togglePinnedChat = (chatId: string) => {
    setChatMenuCard(null);
    togglePinnedChatMutation.mutate(chatId);
  }
  // const deleteItem = (id: string) => setItems(items.filter((item) => item.id !== id));

  // const renameItem = (id: string, title: string) => {
  //   if (title.trim()) setItems(items.map((item) => (item.id === id ? { ...item, title: title.trim() } : item)));
  //   setRenamingId(null);
  // }


  useEffect(()=> {
    const handleClickOutsideOnScreen = () => {
      setChatMenuCard(null);
      setShowProfile(false);
    }

    document.addEventListener("click", handleClickOutsideOnScreen);

    return () => {
      removeEventListener("click", handleClickOutsideOnScreen)
    }
  }, []);


  const linkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex cursor-pointer items-center gap-3 rounded-xl py-2 transition ${isSidebarOpen ? "px-3" : "justify-center"} ${isActive ? "bg-white/10 text-cream" : "text-muted hover:bg-white/5 hover:text-cream"}`;
  }



  return (
    <>
      {/* Dark backdrop on mobile, tap to close */}
      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 z-30 bg-black/50 md:hidden" />}

      {/* Keeps the page content from going under the sidebar (nothing is reserved on mobile, the sidebar floats over the page) */}
      <div className={`w-0 shrink-0 transition-all duration-300 ${isSidebarOpen ? "md:w-64" : "md:w-16"}`}>

        {/* Mobile: slides in as a drawer. Desktop: full sidebar or a small icon rail */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 transition-all duration-300 ${isSidebarOpen ? "md:w-64" : "-translate-x-full md:w-16 md:translate-x-0"}`}>

          <aside className="flex h-full flex-col overflow-visible border-r border-white/15 bg-white/[0.06] shadow-glass backdrop-blur-2xl">

            <div className={`flex h-16 shrink-0 items-center ${isSidebarOpen ? "justify-between px-4" : "justify-center"}`}>
              <Link to="/" className="flex cursor-pointer items-center gap-1">
                <img src="/favicon.svg" alt="CarbonCode logo" className="h-8 w-8" />
                {isSidebarOpen && (
                  <span className="text-lg font-semibold text-white">
                    Carbon<span className="text-coral">Code</span>
                  </span>
                )}
              </Link>
              {isSidebarOpen && (
                <button type="button" onClick={toggleSidebar} aria-label="Close sidebar" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-cream">
                  <PanelLeftClose size={18} />
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-1 px-2">
              <NavLink to="/" end title="New chat" className={linkClass}>
                <SquarePen size={18} className="shrink-0" />
                {isSidebarOpen && "New chat"}
              </NavLink>
              <NavLink to="/builder" title="Builder" className={linkClass}>
                <Blocks size={18} className="shrink-0" />
                {isSidebarOpen && "Builder"}
              </NavLink>
            </nav>

            <div className="flex-1 overflow-y-auto px-2 scrollbar-theme">
              {isSidebarOpen && (
                <>
                  <SidebarSection title="Pinned" Icon={VscPinned}>
                    {renderChats(pinnedChats ? pinnedChats : [])}
                  </SidebarSection>

                  <SidebarSection title="Chats" Icon={MessagesCircle}>
                    {renderChats(chats ? chats : [])}
                  </SidebarSection>

                  <SidebarSection title="Apps" Icon={Code2Icon}>
                    {renderChats(apps ? apps : [])}
                  </SidebarSection>
                </>
              )}
            </div>

            {user && (
              <div className={`relative z-50 shrink-0 border-t border-white/15 ${isSidebarOpen ? "p-3" : "p-2"}`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProfile();
                    setChatMenuCard(null);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl p-1 text-left transition hover:bg-white/10 ${isSidebarOpen ? "" : "justify-center"}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-crimson text-xs font-bold uppercase text-cream">{user.name?.[0]}</div>
                  {isSidebarOpen && (
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{user.name}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                  )}
                </button>

                {showProfile && (
                  <div className={`fixed z-50 mb-2 overflow-hidden rounded-2xl border border-white/15 bg-surface p-3 shadow-glass ${
                    isSidebarOpen
                      ? "bottom-17 left-2 w-60"
                      : "-bottom-1 left-17 w-56"
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

            {/* 3 dot menu of a chat or an app, fixed so the scroll area does not clip it */}
            {chatMenuCard && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  top: chatMenuCard.top,
                  left: chatMenuCard.left,
                }}
                className="fixed z-50 w-40 rounded-2xl border border-white/15 bg-surface p-1.5 shadow-glass"
              >
                <button type="button" onClick={()=> togglePinnedChat(chatMenuCard.id)} className={menuButtonClass}>
                  {allChatsData?.find((chat) => chat.id === chatMenuCard.id)?.pinned ? 
                    <span className="flex justify-center items-center gap-3"><VscUnpin size={16} />Unpin</span>
                    : 
                    <span className="flex justify-center items-center gap-3"><VscPinned size={16} />Pin</span>
                  }
                </button>

                <button type="button" className={menuButtonClass}>
                  <Pencil size={16} />
                  Rename
                </button>

                <button
                  onClick={() => setIsPopupOpen(true)}
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}

          </aside>

          {/* Icon rail on desktop: the open icon sits on the sidebar border (outside the aside so it is not clipped) */}
          {!isSidebarOpen && (
            <button type="button" onClick={toggleSidebar} aria-label="Open sidebar" className="absolute -right-4 top-4 hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-background text-muted shadow-glass transition hover:text-cream md:flex">
              <PanelLeftOpen size={18} />
            </button>
          )}


          {/* Popup button  */}
          {
            isPopupOpen && chatMenuCard &&
            <Popup 
              isOpen={isPopupOpen}
              title="Do you want to delete this chat"
              description="Are you sure you want to delete this conversation? This action cannot be undone."
              confirmText="Delete"
              onCancel={() => setIsPopupOpen(false)}
              isLoading={deleteChatMutation.isPending}
              onConfirm={() => {
                deleteChatMutation.mutate(chatMenuCard.id, {
                  onSuccess: () => {
                    navigate("/");
                    // toggleSidebar();
                  }
                })
              }}
              variant="danger"
            />
          }
        </div>
      </div>
    </>
  );
}
