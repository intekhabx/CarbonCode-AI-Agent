import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LucideFolderGit, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";


type AuthPageProps = {
  mode: "signin" | "signup";
}



const Brand = () => (
  <span className="font-semibold">
    Carbon<span className="text-[#ff6766]">Code</span>
  </span>
);


export default function AuthPage({mode}: AuthPageProps) {

  const signupUserWithEmailAndPassword = useAuthStore((state) => state.signupUserWithEmailAndPassword);
  const signinUserWithEmailAndPassword = useAuthStore((state) => state.signinUserWithEmailAndPassword);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isSignin: boolean = mode === "signin";
  const navigate = useNavigate();

  const mutation = isSignin ? 
  useMutation({
    mutationFn: () => signinUserWithEmailAndPassword({email, password}),
    onSuccess: () => navigate("/"),
  })
  : 
  useMutation({ 
    mutationFn: () => signupUserWithEmailAndPassword({name, email, password}),
    onSuccess: () => {
      navigate("/signin");
      setPassword("");
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };


  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-4 text-sm">
      {/* V-shaped glow behind the card */}
      {/* <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center blur-3xl">
        <div className="h-[100vh] w-[min(90vw,70rem)] bg-gradient-to-b from-[#ca2851]/30 to-transparent [clip-path:polygon(0_0,100%_0,50%_100%)]" />
      </div> */}

      <div className={`relative w-full max-w-md rounded-[40px] border border-[rgba(255,177,115,0.12)] bg-[rgba(26,29,39,0.65)] px-6 backdrop-blur-[24px] sm:px-10 ${isSignin ? "py-10" : "py-6"}`}>
        <div className="mb-7 flex flex-col items-center text-center">
          <img src="/favicon.svg" alt="CarbonCode logo" className="mb-3 h-16 w-16" />
          <h1 className="text-[26px] leading-8 font-extrabold text-white">{isSignin ? "Welcome Back" : "Create your account"}</h1>
          <p className="mt-1.5 text-[#a9a6b3]">{isSignin ? <>Sign in to access your <Brand /> workspace</> : <>Start building with <Brand /></>}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isSignin && (
            <div>
              <label htmlFor="name" className="mb-1.5 block px-3 font-semibold text-[#e6e1da]">Full Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" required className="w-full rounded-full border border-[rgba(255,177,115,0.12)] bg-[#15171e] px-5 py-3 text-[#ffe3b3] placeholder:text-[#ffe3b3]/30 outline-none transition focus:border-[#ff6766] focus:ring-2 focus:ring-[#ff6766]/30" />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block px-3 font-semibold text-[#e6e1da]">{isSignin ? "Email Address" : "Work Email"}</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required className="w-full rounded-full border border-[rgba(255,177,115,0.12)] bg-[#15171e] px-5 py-3 text-[#ffe3b3] placeholder:text-[#ffe3b3]/30 outline-none transition focus:border-[#ff6766] focus:ring-2 focus:ring-[#ff6766]/30" />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between px-3">
              <label htmlFor="password" className="font-semibold text-[#e6e1da]">Password</label>
              {isSignin && <button type="button" className="cursor-pointer text-[#ff6766] transition hover:underline">Forgot password?</button>}
            </div>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required className="w-full rounded-full border border-[rgba(255,177,115,0.12)] bg-[#15171e] py-3 pl-5 pr-12 text-[#ffe3b3] placeholder:text-[#ffe3b3]/30 outline-none transition focus:border-[#ff6766] focus:ring-2 focus:ring-[#ff6766]/30" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-[#ffb173] transition hover:text-[#ff6766] focus-visible:outline-2 focus-visible:outline-[#ff6766]">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* {mutation.isError && <p role="alert" className="px-3 text-[#ff6766]">{mutation.error.message}</p>}
          {mutation.isSuccess && <p role="status" className="px-3 text-[#ffb173]">{mutation.data.message}</p>} */}

          <button type="submit" disabled={mutation.isPending} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ca2851] to-[#ffb173] px-6 py-3 font-bold text-white shadow-[0_8px_24px_rgba(202,40,81,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {mutation.isPending && <Loader2 size={16} className="animate-spin" />}
            {isSignin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {isSignin && (
          <>
            <div className="my-7 flex items-center gap-3 font-mono text-[11px] uppercase text-[#ffe3b3]/40">
              <div className="h-px flex-1 bg-[rgba(255,177,115,0.12)]" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-[rgba(255,177,115,0.12)]" />
            </div>

            <div className="flex gap-3">
              <button type="button" className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[rgba(255,177,115,0.12)] bg-[#15171e] py-2 font-normal text-[#ffe3b3] transition hover:border-[#ffb173]"><LucideFolderGit size={16} />GitHub</button>
              <button type="button" className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[rgba(255,177,115,0.12)] bg-[#15171e] py-2 font-normal text-[#ffe3b3] transition hover:border-[#ffb173]"><span className="text-base font-bold leading-none text-[#ff6766]">G</span>Google</button>
            </div>
          </>
        )}

        <p className="mt-8 text-center text-[#a9a6b3]">
          {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link to={isSignin ? "/signup" : "/signin"} className="cursor-pointer font-bold text-[#ffb173] transition hover:underline" >{isSignin ? " Create Account" : " Sign In"}</Link>
        </p>
      </div>
    </div>
  );
}