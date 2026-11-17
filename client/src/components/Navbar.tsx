import { Link } from "react-router-dom";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useUserProfile } from "../hooks/useAuth";
import { useAppStore } from "../store/appStore";



export default function Navbar() {

  const {user} = useUserProfile();
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);


  return (
    <header className="sticky top-0 z-20 w-full" >
      <nav className={`flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3 ${!user && "backdrop-blur-3xl"}`}>
        <div className="flex items-center gap-1">
          {/* Mobile only: opens the sidebar drawer */}
          {user && (
            <button type="button" onClick={toggleSidebar} aria-label="Open menu" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-cream transition hover:bg-white/10 md:hidden backdrop:blur-2xl bg-surface/80">
              <HiOutlineMenuAlt2 size={20} />
            </button>
          )}

          {/* UnAuthorized user can saw logo in the Navbar */}
          <Link to="/" className={`flex cursor-pointer items-center gap-1 ${user ? "hidden" : ""}`}>
            <img src="/favicon.svg" alt="CarbonCode logo" className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="text-base font-semibold text-white sm:text-lg">
              Carbon<span className="text-coral">Code</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {
            !user ? 
              <div className="flex items-center justify-center gap-2">
                <Link to={"/signin"} className="cursor-pointer rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:border-peach hover:text-peach sm:px-4">
                  Sign in
                </Link>
                <Link to={"/signup"} className="cursor-pointer rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:border-peach sm:px-4 bg-gradient-to-r from-crimson to-peach">
                  Get Started Free
                </Link>
              </div>
              :
            <span className="max-w-34 truncate text-muted sm:max-w-none bg-surface/80 rounded-full py-1 px-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{user?.name}</span>
          }
        </div>
      </nav>
    </header>
  );
}
