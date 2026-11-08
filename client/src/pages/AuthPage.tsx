import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Link } from "react-router-dom";
import { useSignin, useSignup } from "../hooks/useAuth";


type AuthPageProps = {
  mode: "signin" | "signup";
}



const Brand = () => (
  <span className="font-semibold">
    Carbon<span className="text-coral">Code</span>
  </span>
);


export default function AuthPage({mode}: AuthPageProps) {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isSignin: boolean = mode === "signin";

  const signupMutation = useSignup({name, email, password});
  const signinMutation = useSignin({email, password});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    isSignin ?
      signinMutation.mutateAsync().then((data) => console.log(data)) 
      :
      signupMutation.mutateAsync().then((data) => {
        console.log(data);
        setPassword("");
      });
  };


  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-4 text-sm">

      <div className={`relative w-full max-w-md rounded-[32px] border border-line bg-glass px-5 backdrop-blur-[24px] sm:rounded-[40px] sm:px-10 ${isSignin ? "py-8 sm:py-10" : "py-6"}`}>
        <div className="mb-7 flex flex-col items-center text-center">
          <img src="/favicon.svg" alt="CarbonCode logo" className="mb-3 h-14 w-14 sm:h-16 sm:w-16" />
          <h1 className="text-2xl leading-8 font-extrabold text-white sm:text-[26px]">{isSignin ? "Welcome Back" : "Create your account"}</h1>
          <p className="mt-1.5 text-muted">{isSignin ? <>Sign in to access your <Brand /> workspace</> : <>Start building with <Brand /></>}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isSignin && (
            <div>
              <label htmlFor="name" className="mb-1.5 block px-3 font-semibold text-label">Full Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" required className="w-full rounded-full border border-line bg-surface px-5 py-3 text-cream placeholder:text-cream/30 outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30" />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block px-3 font-semibold text-label">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required className="w-full rounded-full border border-line bg-surface px-5 py-3 text-cream placeholder:text-cream/30 outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30" />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between px-3">
              <label htmlFor="password" className="font-semibold text-label">Password</label>
              {isSignin && <button type="button" className="cursor-pointer text-coral transition hover:underline">Forgot password?</button>}
            </div>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required className="w-full rounded-full border border-line bg-surface py-3 pl-5 pr-12 text-cream placeholder:text-cream/30 outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/30" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-peach transition hover:text-coral focus-visible:outline-2 focus-visible:outline-coral">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* {mutation.isError && <p role="alert" className="px-3 text-coral">{mutation.error.message}</p>}
          {mutation.isSuccess && <p role="status" className="px-3 text-peach">{mutation.data.message}</p>} */}

          <button type="submit" disabled={signinMutation.isPending || signupMutation.isPending} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-crimson to-peach px-6 py-3 font-bold text-white shadow-glow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {(signinMutation.isPending || signupMutation.isPending) && <Loader2 size={16} className="animate-spin" />}
            {isSignin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {isSignin && (
          <>
            <div className="my-7 flex items-center gap-3 font-mono text-[11px] uppercase text-cream/40">
              <div className="h-px flex-1 bg-line" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <div className="flex gap-3">
              <button type="button" className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-surface py-2 font-normal text-cream transition hover:border-peach"><SiGithub size={16} />GitHub</button>
              <button type="button" className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-surface py-2 font-normal text-cream transition hover:border-peach"><span className="text-base font-bold leading-none text-coral">G</span>Google</button>
            </div>
          </>
        )}

        <p className="mt-8 text-center text-muted">
          {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link to={isSignin ? "/signup" : "/signin"} className="cursor-pointer font-bold text-peach transition hover:underline" >{isSignin ? " Create Account" : " Sign In"}</Link>
        </p>
      </div>
    </div>
  );
}
