import { create } from "zustand";
import { persist } from "zustand/middleware";


type AppStoreType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  isPopupOpen: boolean;
  setIsPopupOpen: (value: boolean) => void;

  mode: "builder" | "chat";
  setMode: (mode: "builder" | "chat") => void;

  prompt: string;
  setPrompt: (value: string) => void;
}



// persist is used to store the data in localstorage also
export const useAppStore = create<AppStoreType>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      toggleSidebar: () => set((state) => ({isSidebarOpen: !state.isSidebarOpen})),

      isPopupOpen: false,
      setIsPopupOpen: (value)=> set(() => ({isPopupOpen: value})),
  
      mode: "chat",
      setMode: (mode) => set({ mode }),
  
      prompt: "",
      setPrompt: (value) => set({ prompt: value }),
    }),
    {
      name: "app-store",
      partialize: (state) => ({ //inside patialize data is stored in the localstorage
        isSidebarOpen: state.isSidebarOpen,
        mode: state.mode,
      })
    }
  )
);
