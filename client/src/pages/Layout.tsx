import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0d0e12] text-sm">
      <div className="pointer-events-none fixed inset-x-0 top-0 flex justify-center blur-3xl">
        <div className="h-screen w-[min(90vw,70rem)] bg-gradient-to-b from-[#ca2851]/30 to-transparent [clip-path:polygon(0_0,100%_0,50%_100%)]" />
      </div>
      <div className="relative">
        <Outlet />
      </div>
    </div>
  );
}