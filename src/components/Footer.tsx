import { GiStrongMan } from "react-icons/gi";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      {/* Top border glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                <GiStrongMan className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-xl font-bold font-mono">
                my<span className="text-primary">TrAIner</span>+
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} myTrAIner+ - All rights reserved
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-background/50">
            <div
              className="w-2 h-2 rounded-full bg-primary blink"
              style={{ backgroundColor: "#38f882" }}
            ></div>
            <span className="text-xs font-mono">SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
