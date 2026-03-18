"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Twitter, Menu, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agent/aurum", label: "Agent" },
  { href: "/thesis", label: "Thesis" },
  { href: "/docs/index.html", label: "Docs" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-aurum-bg/90 backdrop-blur-xl border-b border-aurum-bg-border/50"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/aurum_logo.png"
            alt="AURUM logo"
            width={34}
            height={34}
            className="rounded-sm"
            style={{ mixBlendMode: "screen" }}
          />
          <Image
            src="/logos/aurum_name.png"
            alt="Aurum Agent"
            width={118}
            height={30}
            className="object-contain"
            style={{ mixBlendMode: "screen" }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-xs font-body tracking-[0.1em] uppercase transition-colors rounded-sm",
                pathname === link.href
                  ? "text-aurum-gold"
                  : "text-aurum-text-secondary hover:text-aurum-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-emerald-500/20 bg-emerald-500/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-mono tracking-widest">LIVE</span>
          </div>
          <a
            href="https://x.com/AurumAgent"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-aurum-text-dim hover:text-aurum-text-secondary transition-colors"
            aria-label="AURUM on X"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-aurum-gold/10 border border-aurum-gold/20 text-aurum-gold text-xs font-mono tracking-[0.1em] uppercase rounded-sm hover:bg-aurum-gold/15 hover:border-aurum-gold/40 transition-all"
          >
            <Activity className="w-3 h-3" />
            Terminal
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-aurum-text-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-aurum-bg-card border-b border-aurum-bg-border">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm tracking-wide transition-colors",
                  pathname === link.href ? "text-aurum-gold" : "text-aurum-text-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-aurum-bg-border">
              <a
                href="https://x.com/AurumAgent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aurum-text-dim hover:text-aurum-text-secondary flex items-center gap-2 text-sm"
              >
                <Twitter className="w-4 h-4" />
                @AurumAgent
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
