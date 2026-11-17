import PromptBox from "../components/PromptBox";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useAuth";
import { useAppStore } from "../store/appStore";
import HowItWork from "../components/HowItWork";
import RecentWork from "../components/RecentWork";
import {v4 as uuidv4} from "uuid";
import Navbar from "../components/Navbar";


const quickTags = ["Portfolio Website", "E-commerce Store", "Landing Page", "Blog", "Resume Website"];

export default function HomePage() {

  const {user} = useUserProfile();
  

  const mode = useAppStore((state) => state.mode);
  const setMode = useAppStore((state) => state.setMode);

  const prompt = useAppStore((state) => state.prompt);
  const setPrompt = useAppStore((state) => state.setPrompt);

  const navigate = useNavigate();


  const handleGenerate = () => {
    if (!prompt.trim()) return;

    //step:1 if your is not loggedin the redirect to signin page
    if(!user) {
      toast.error("Please Signin first");
      navigate("/signin");
      return;
    }

    // step:2 check the user mode and based on call agent
    if(mode === "chat"){
      return navigate(`/chat/${uuidv4()}`);
    }
    else{
      return navigate("/builder");
    }
    // console.log("Generate app:", prompt);
  };


  return (
    <div>
      {/* Navbar of Home Page for auth and unauth user */}
      <Navbar />
      
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-8 text-center">
        <div className="flex items-center gap-2 rounded-full border border-line bg-glass p-2 pr-4 backdrop-blur-[24px]">
          <span className="rounded-full bg-crimson px-2.5 py-0.5 font-mono text-[11px] font-medium text-cream">NEW</span>
          <span className="text-cream text-xs sm:text-[13px]">Bring Your Ideas to Life - Start for Free</span>
        </div>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
          {mode === "chat" ? "How can I help you" : "Let’s build your app"} <br />
          <span className="bg-gradient-to-r from-crimson via-coral to-peach bg-clip-text text-transparent">{mode === "chat" ? "today?" : "together"}</span>
        </h1>

        {mode === "chat" ? 
          <p className="mt-5 max-w-xl text-sm text-muted sm:text-base">
            Ask anything, explore ideas, and get instant answers, solve problems, and turn your thoughts into something amazing.
          </p>
            :
          <p className="mt-5 max-w-xl text-sm text-muted sm:text-base">Describe your idea and watch AI design, structure and launch your website instantly. No coding required.</p>
        }

        {/* mode */}
        <div className="mt-5 inline-flex items-center rounded-full border border-white/10 bg-glass p-1 backdrop-blur-[24px]">
          <button
            onClick={() => setMode("chat")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              mode === "chat"
                ? "bg-crimson/30 text-cream shadow-lg border border-crimson/50"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            Ask AI
          </button>

          <button
            onClick={() => setMode("builder")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
              mode === "builder"
                ? "bg-crimson/30 text-cream shadow-lg border border-crimson/50"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            Build an app
          </button>
        </div>

        {/* Prompt Box */}
        <div className="mt-5 w-full max-w-2xl sm:mt-5">
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
        {/* How it work && Recet works */}
        {user ? 
          <RecentWork />
            :
          <HowItWork />
        }
    </div>
  );
}
