import { Link } from "react-router-dom";
import { useUserProfile } from "../hooks/useAuth";


type NavbarProps = {
  onSignOut: () => void;
};

export default function Navbar({ onSignOut }: NavbarProps) {

  const {user} = useUserProfile();


  return (
    <header className="fixed top-0 z-50 w-full" >
      <nav className="flex items-center justify-between px-4 py-3 backdrop-blur-3xl sm:px-6 sm:py-4">
        <Link to="/" className="flex cursor-pointer items-center gap-1">
          <img src="/favicon.svg" alt="CarbonCode logo" className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="text-base font-semibold text-white sm:text-lg">
            Carbon<span className="text-coral">Code</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="max-w-24 truncate text-muted sm:max-w-none">{user?.name}</span>
          {
            !user ? 
            <Link to={"/signin"} className="cursor-pointer rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:border-peach hover:text-peach sm:px-4">
              Sign in
            </Link>
              :
            <button type="button" onClick={onSignOut} className="cursor-pointer rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:border-peach hover:text-peach sm:px-4">
              Sign out
            </button>
          }
        </div>
      </nav>
    </header>
  );
}
