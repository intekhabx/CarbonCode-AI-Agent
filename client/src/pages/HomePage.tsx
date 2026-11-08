import { useState } from "react";
import Navbar from "../components/Navbar";
import PromptBox from "../components/PromptBox";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSignout, useUserProfile } from "../hooks/useAuth";


const quickTags = ["Portfolio Website", "E-commerce Store", "Landing Page", "Blog", "Resume Website"];

export default function HomePage() {

  const {user} = useUserProfile();
  const signoutMutation = useSignout();

  const handleSignOut = () => {
    signoutMutation.mutate();
  };
  

  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    if(!user) {
      toast.error("Please Signin first to use");
      navigate("/signin");
      return;
    }

    console.log("Generate app:", prompt); // TODO: connect real API
  };


  return (
    <div className="min-h-dvh text-sm">
      <Navbar onSignOut={handleSignOut} />

      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-24 text-center">
        <div className="flex items-center gap-2 rounded-full border border-line bg-glass p-2 pr-4 backdrop-blur-[24px]">
          <span className="rounded-full bg-crimson px-2.5 py-0.5 font-mono text-[11px] font-medium text-cream">NEW</span>
          <span className="text-cream text-xs sm:text-[13px]">Bring Your Ideas to Life - Start for Free</span>
        </div>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
          Let’s build your app <br />
          <span className="bg-gradient-to-r from-crimson via-coral to-peach bg-clip-text text-transparent">together</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm text-muted sm:text-base">Describe your idea and watch AI design, structure and launch your website instantly. No coding required.</p>

        <div className="mt-8 w-full max-w-2xl sm:mt-10">
          <PromptBox value={prompt} onChange={setPrompt} onSubmit={handleGenerate} />
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {quickTags.map((tag) => (
            <button key={tag} type="button" onClick={() => setPrompt(`Create a ${tag.toLowerCase()}`)} className="cursor-pointer rounded-full border border-line bg-glass px-3 py-1.5 text-cream backdrop-blur-[24px] transition hover:border-peach sm:px-4 sm:py-2">
              {tag}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
