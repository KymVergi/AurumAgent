import Link from "next/link";
import Image from "next/image";
import { Twitter } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Agent Profile", href: "/agent/aurum" },
    { label: "Thesis", href: "/thesis" },
  ],
  Docs: [
    { label: "What is AURUM", href: "/docs/index.html" },
    { label: "Signal Flow", href: "/docs/index.html" },
    { label: "Fee Flywheel", href: "/docs/index.html" },
    { label: "Architecture", href: "/docs/index.html" },
  ],
  Legal: [
    { label: "Disclaimer", href: "/docs/index.html" },
    { label: "Risk Disclosure", href: "/docs/index.html" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-aurum-bg-border/50 bg-aurum-bg">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image
                src="/logos/aurum_logo.png"
                alt="AURUM logo"
                width={32}
                height={32}
                className="rounded-sm"
                style={{ mixBlendMode: "screen" }}
              />
              <Image
                src="/logos/aurum_name.png"
                alt="Aurum Agent"
                width={110}
                height={28}
                className="object-contain"
                style={{ mixBlendMode: "screen" }}
              />
            </Link>

            <p className="text-aurum-text-secondary text-sm leading-relaxed max-w-xs font-body">
              The self-funding macro agent. Charts. News. Odds. Conviction.
            </p>

            <p className="text-aurum-text-dim text-xs font-mono leading-relaxed max-w-xs">
              Not financial advice. AURUM is an experimental autonomous agent.
              All decisions are public and transparent.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com/AurumAgent"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-aurum-bg-border text-aurum-text-dim hover:text-aurum-text-secondary hover:border-aurum-bg-border/80 transition-colors rounded-sm"
                aria-label="X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs font-mono tracking-[0.15em] uppercase text-aurum-text-dim">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-aurum-text-secondary hover:text-aurum-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-aurum-bg-border/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-aurum-text-dim text-xs font-mono">
            © 2026 AURUM. Built with Anthropic, Polymarket, and public market data.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-aurum-text-dim text-xs font-mono">
              Powered by <span className="text-aurum-gold">Claude Sonnet</span>
            </span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-aurum-text-dim text-xs font-mono">System operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
