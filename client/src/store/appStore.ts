import { create } from "zustand";


type AppStoreType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  mode: "builder" | "chat";
  setMode: (mode: "builder" | "chat") => void;

  prompt: string;
  setPrompt: (value: string) => void;
}


export const useAppStore = create<AppStoreType>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({isSidebarOpen: !state.isSidebarOpen})),

  mode: "chat",
  setMode: (mode) => set({ mode }),

  prompt: "",
  setPrompt: (value) => set({ prompt: value }),
}));
