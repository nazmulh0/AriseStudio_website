"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShoppingCart,
  Database,
  Layers,
  Headphones,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

const links = [
  { name: "About", href: "/about" },
  { name: "Expertise", href: "/services" },
  { name: "Solutions", href: "/solutions" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];
const services = [
  {
    name: "E-commerce automation",
    href: "/services#ecommerce",
    icon: ShoppingCart,
  },
  { name: "Custom ERP & CRM", href: "/services#erp-crm", icon: Database },
  {
    name: "Business automation",
    href: "/services#business-automation",
    icon: Layers,
  },
  {
    name: "Managed IT & cloud",
    href: "/services#it-support",
    icon: Headphones,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expertiseMode, setExpertiseMode] = useState<"hover" | "press" | null>(null);
  const expertiseOpen = expertiseMode !== null;
  const header = useRef<HTMLElement>(null);
  const expertiseContainer = useRef<HTMLDivElement>(null);
  const expertiseTrigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const navClass = (href: string) =>
    `inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors ${pathname === href ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface-muted/80 hover:text-ink"}`;

  useEffect(() => {
    if (!expertiseOpen && !mobileOpen) return;
    const dismiss = (event: Event) => {
      if (!(event.target instanceof Node)) return;
      if (!expertiseContainer.current?.contains(event.target)) setExpertiseMode(null);
      if (!header.current?.contains(event.target)) setMobileOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
    };
  }, [expertiseOpen, mobileOpen]);

  return (
    <header
      ref={header}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5"
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobileOpen) {
          setMobileOpen(false);
          mobileTrigger.current?.focus();
        }
      }}
    >
      <div className="reflective-header mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 rounded-full py-3 pl-5 pr-3 sm:pl-7">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          aria-label="AriseStudio home"
        >
          <BrandLogo priority />
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-1"
        >
          {links.map((link) =>
            link.href === "/services" ? (
              <div
                key={link.href}
                ref={expertiseContainer}
                className="relative"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setExpertiseMode((mode) => mode ?? "hover");
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement))
                    setExpertiseMode(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setExpertiseMode(null);
                    expertiseTrigger.current?.focus();
                  }
                }}
              >
                <button
                  ref={expertiseTrigger}
                  type="button"
                  aria-expanded={expertiseOpen}
                  aria-controls="expertise-links"
                  aria-current={pathname === "/services" ? "page" : undefined}
                  onClick={() => setExpertiseMode((mode) => mode === "press" ? null : "press")}
                  className={navClass(link.href)}
                >
                  Expertise{" "}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${expertiseOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {expertiseOpen && (
                  <div
                    className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-5"
                    id="expertise-links"
                  >
                    <div className="frosted-popover relative rounded-3xl p-2">
                      <Link
                        href="/services"
                        onClick={() => setExpertiseMode(null)}
                        className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm font-bold text-ink hover:bg-surface-muted/60"
                      >
                        All services{" "}
                        <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
                      </Link>
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() => setExpertiseMode(null)}
                          className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm text-ink hover:bg-surface-muted/60"
                        >
                          <service.icon
                            className="h-4 w-4 text-accent"
                            aria-hidden="true"
                          />
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={navClass(link.href)}
              >
                {link.name}
              </Link>
            ),
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/schedule"
            className="nav-call hidden sm:inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-[13px] font-semibold text-on-accent transition-colors hover:bg-accent-strong"
          >
            Book a call{" "}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            ref={mobileTrigger}
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
            className="glass-control inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/70 text-ink transition-colors hover:bg-surface-muted/80 xl:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="frosted-popover relative mx-auto mt-3 max-w-7xl rounded-[28px] p-3 xl:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMobileOpen(false);
              mobileTrigger.current?.focus();
            }
          }}
        >
          <div className="max-h-[calc(100dvh-144px)] overflow-y-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-3 py-3 text-sm font-semibold ${pathname === link.href ? "bg-surface-muted text-accent" : "text-ink hover:bg-surface-muted/60"}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/schedule"
              onClick={() => setMobileOpen(false)}
              className="nav-call mt-3 flex min-h-12 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-on-accent hover:bg-accent-strong"
            >
              Book a discovery call
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
