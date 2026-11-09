export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-background px-4">

      {/* Soft background glow */}
      <div className="absolute h-72 w-72 rounded-full bg-crimson/20 blur-3xl sm:h-96 sm:w-96" />

      <div className="relative flex flex-col items-center gap-6 sm:gap-7">

        {/* Animated Code Logo inside a spinning ring */}
        <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-crimson border-t-coral" />
          <div className="absolute inset-5 animate-pulse rounded-full bg-gradient-to-br from-crimson via-coral to-peach opacity-40 blur-2xl" />

          <svg className="relative h-12 w-12 animate-pulse overflow-visible drop-shadow-glow sm:h-14 sm:w-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="codeGradient" x1="10" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
                <stop className="[stop-color:var(--color-crimson)]" />
                <stop offset=".45" className="[stop-color:var(--color-coral)]" />
                <stop offset="1" className="[stop-color:var(--color-peach)]" />
              </linearGradient>
            </defs>

            <path d="M38 27L17 50L38 73" stroke="url(#codeGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M60 19L43 81" className="stroke-cream" strokeWidth="8" strokeLinecap="round" />
            <path d="M62 27L83 50L62 73" stroke="url(#codeGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Loading Text */}
        {/* <div className="flex items-center text-[13px] font-medium tracking-[1.5px] text-cream">
          Building something great
          <div className="ml-2 flex gap-1">
            <span className="h-1 w-1 animate-bounce rounded-full bg-crimson" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-coral [animation-delay:200ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-peach [animation-delay:400ms]" />
          </div>
        </div> */}

        {/* Animated Progress Bar */}
        {/* <div className="h-[2px] w-32 overflow-hidden rounded-full bg-white/10 sm:w-40">
          <div className="h-full w-2/5 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-crimson via-coral to-cream" />
        </div> */}

      </div>

      {/* Tailwind arbitrary animations */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(360%); }
        }
      `}</style>
    </div>
  );
}
