import TerminalOverlay from "@/components/TerminalOverlay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* CORNER DECARATION */}
            <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2" />

            {/* Left SIDE CONTENT */}
            <div className="lg:col-span-5 relative">
              {/* CORNER PIECES */}
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
              </div>

              {/* IMAGE CONTANINER */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                  <Image
                    width={500}
                    height={500}
                    src="/ai_assistant.png"
                    alt="AI Fitness Coach"
                    className="size-full object-cover object-center"
                  />

                  {/* SCAN LINE */}
                  {/* <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" /> */}
                  <div className="scan-line" />

                  {/* DECORATIONS ON TOP THE IMAGE */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full" />

                    {/* Targeting lines */}
                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>

                {/* TERMINAL OVERLAY */}
                <TerminalOverlay />
              </div>
            </div>

            {/* Right SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-8 relative flex flex-col items-end text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <div>
                  <span className="text-foreground">Build Your</span>
                </div>
                <div>
                  <span className="text-primary">Best Self</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">Through Personalized</span>
                </div>
                <div className="pt-2">
                  <span className="text-primary"> AI-Powered</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground"> Fitness Solutions</span>
                </div>
              </h1>

              {/* SEPERATOR LINE */}
              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

              <p className="text-xl text-muted-foreground w-2/3 text-center mx-auto">
                Get personalized workout and nutrition plans tailored to your
                goals. Whether building muscle, losing weight, or improving
                health, myTrAIner+ creates a plan just for you.
              </p>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mx-auto">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                  <Link
                    href={"/generate-program"}
                    className="flex items-center font-mono"
                  >
                    Chat with myTrAIner+
                  </Link>
                </Button>
              </div>
              {/* STATS */}
              <div className="flex items-center gap-10 py-6 font-mono mx-auto">
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">∞</div>
                  <div className="text-xs uppercase tracking-wider">
                    EXERCISES
                  </div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-yellow-500 to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">3min</div>
                  <div className="text-xs uppercase tracking-wider">
                    GENERATION
                  </div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-yellow-500 to-transparent"></div>
                <div className="flex flex-col">
                  <div className="text-2xl text-primary">100%</div>
                  <div className="text-xs uppercase tracking-wider">
                    PERSONALIZED
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
