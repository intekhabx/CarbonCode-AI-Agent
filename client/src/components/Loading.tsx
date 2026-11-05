

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#100d0d]">
      <div className="flex flex-col items-center gap-7">

        {/* Animated Code Logo */}
        <div className="relative flex h-24 w-24 items-center justify-center animate-[float_2.5s_ease-in-out_infinite]">
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#ca2851] via-[#ff6766] to-[#ffb173] opacity-50 blur-2xl animate-pulse" />

          <svg className="relative h-full w-full overflow-visible drop-shadow-[0_0_12px_#ff676680] animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="codeGradient" x1="10" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ca2851" />
                <stop offset=".45" stopColor="#ff6766" />
                <stop offset="1" stopColor="#ffb173" />
              </linearGradient>
            </defs>

            <path d="M38 27L17 50L38 73" stroke="url(#codeGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M60 19L43 81" stroke="#ffe3b3" strokeWidth="8" strokeLinecap="round" />
            <path d="M62 27L83 50L62 73" stroke="url(#codeGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Loading Text */}
        {/* <div className="flex items-center text-[13px] font-medium tracking-[1.5px] text-[#ffe3b3]">
          Building something great
          <div className="ml-2 flex gap-1">
            <span className="h-1 w-1 animate-bounce rounded-full bg-[#ca2851]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-[#ff6766] [animation-delay:200ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-[#ffb173] [animation-delay:400ms]" />
          </div>
        </div> */}

        {/* Animated Progress Bar */}
        <div className="h-[2px] w-36 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/5 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#ca2851] via-[#ff6766] to-[#ffe3b3]" />
        </div>

      </div>

      {/* Tailwind arbitrary animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes loading {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(360%); }
        }
      `}</style>
    </div>
  );
}
