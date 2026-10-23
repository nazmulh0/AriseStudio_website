"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
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
  const [expertiseOpen, setExpertiseOpen] = useState(false);
  const expertiseTrigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const navClass = (href: string) =>
    `inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold transition-colors ${pathname === href ? "bg-surface-muted text-accent" : "text-muted hover:bg-surface-muted hover:text-ink"}`;

  return (
    <header
      className="reflective-header fixed inset-x-0 top-0 z-50"
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobileOpen) {
          setMobileOpen(false);
          mobileTrigger.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
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
                className="relative"
                onMouseEnter={() => setExpertiseOpen(true)}
                onMouseLeave={(event) => {
                  if (!event.currentTarget.contains(document.activeElement))
                    setExpertiseOpen(false);
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    setExpertiseOpen(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setExpertiseOpen(false);
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
                  onClick={() => setExpertiseOpen((open) => !open)}
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
                    className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-2"
                    id="expertise-links"
                  >
                    <div className="rounded-2xl border border-line bg-surface p-2 shadow-lg">
                      <Link
                        href="/services"
                        onClick={() => setExpertiseOpen(false)}
                        className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm font-bold text-accent hover:bg-surface-muted"
                      >
                        All services{" "}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() => setExpertiseOpen(false)}
                          className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-surface-muted hover:text-ink"
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
            className="hidden sm:inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-[13px] font-semibold text-on-accent hover:bg-accent-strong"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-ink hover:bg-surface-muted xl:hidden"
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
          className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-line bg-surface px-5 py-4 xl:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMobileOpen(false);
              mobileTrigger.current?.focus();
            }
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-xl px-3 py-3 text-sm font-semibold ${pathname === link.href ? "bg-surface-muted text-accent" : "text-muted hover:bg-surface-muted"}`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/schedule"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-on-accent"
          >
            Book a discovery call
          </Link>
        </nav>
      )}
    </header>
  );
}
