import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-sm">
      {/* Red U/V shape: wide at the top, narrowing down, fading into black. Everything outside the shape stays black */}
      <div className="pointer-events-none fixed inset-x-0 top-0 mx-auto h-220 w-[min(90vw,90rem)] bg-gradient-to-b from-crimson/30 to-transparent [mask-image:radial-gradient(ellipse_50%_100%_at_50%_0%,black_30%,transparent_100%)]" />

      <div className="relative">
        <Outlet />
      </div>
    </div>
  );
}


// export default function Layout() {
//   return (
//     <div className="relative min-h-dvh overflow-hidden bg-[#0d0e12] text-sm">
//       {/* Red glow at the top fading into black at the bottom, same U shape */}
//       <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-[#ca2851]/30 to-transparent [mask-image:radial-gradient(ellipse_45%_95%_at_50%_100%,transparent_60%,black_100%)]" />

//       <div className="relative">
//         <Outlet />
//       </div>
//     </div>
//   );
// }
