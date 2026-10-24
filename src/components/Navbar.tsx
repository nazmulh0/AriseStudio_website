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
  Building2,
  BriefcaseBusiness,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

const services = [
  { name: "All services", href: "/services", icon: ArrowRight },
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
const company = [
  { name: "About AriseStudio", href: "/about", icon: Building2 },
  { name: "Careers", href: "/careers", icon: BriefcaseBusiness },
];
const links = [
  { name: "Services", href: "/services", children: services },
  { name: "Solutions", href: "/solutions" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Company", href: "/about", children: company },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<{ href: string; mode: "hover" | "press" } | null>(null);
  const header = useRef<HTMLElement>(null);
  const dropdownContainers = useRef<Record<string, HTMLDivElement | null>>({});
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const navClass = (active: boolean) =>
    `inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-semibold transition-colors ${active ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface-muted/80 hover:text-ink"}`;

  useEffect(() => {
    if (!dropdown && !mobileOpen) return;
    const dismiss = (event: Event) => {
      if (!(event.target instanceof Node)) return;
      if (!dropdownContainers.current[dropdown?.href ?? ""]?.contains(event.target)) setDropdown(null);
      if (!header.current?.contains(event.target)) setMobileOpen(false);
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !dropdown) return;
      setDropdown(null);
      const container = dropdownContainers.current[dropdown.href];
      if (container?.contains(document.activeElement)) container.querySelector("button")?.focus();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [dropdown, mobileOpen]);

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
          className="min-w-0"
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
            link.children ? (
              <div
                key={link.href}
                ref={(element) => { dropdownContainers.current[link.href] = element; }}
                className="relative"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setDropdown((current) => current?.href === link.href ? current : { href: link.href, mode: "hover" });
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement))
                    setDropdown((current) => current?.href === link.href ? null : current);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setDropdown(null);
                    event.currentTarget.querySelector("button")?.focus();
                  }
                }}
              >
                <button
                  type="button"
                  aria-expanded={dropdown?.href === link.href}
                  aria-controls={`${link.name.toLowerCase()}-links`}
                  onClick={() => setDropdown((current) => current?.href === link.href && current.mode === "press" ? null : { href: link.href, mode: "press" })}
                  className={navClass(link.children.some((item) => pathname === item.href))}
                >
                  {link.name}{" "}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${dropdown?.href === link.href ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {dropdown?.href === link.href && (
                  <div
                    className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-5"
                    id={`${link.name.toLowerCase()}-links`}
                  >
                    <div className="frosted-popover relative rounded-3xl p-2">
                      {link.children.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={pathname === item.href ? "page" : undefined}
                          onClick={() => setDropdown(null)}
                          className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm text-ink hover:bg-surface-muted/60 ${pathname === item.href ? "bg-accent/10 font-semibold" : ""}`}
                        >
                          <item.icon
                            className="h-4 w-4 text-accent"
                            aria-hidden="true"
                          />
                          {item.name}
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
                className={navClass(pathname === link.href)}
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
            className="nav-call hidden sm:inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-strong"
          >
            Book a meeting{" "}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            ref={mobileTrigger}
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => { setDropdown(null); setMobileOpen((open) => !open); }}
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
            {links.flatMap<{ name: string; href: string }>((link) => link.name === "Company" ? company : [link]).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-3 py-3 text-base font-semibold ${pathname === link.href ? "bg-surface-muted text-accent" : "text-ink hover:bg-surface-muted/60"}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/schedule"
              onClick={() => setMobileOpen(false)}
              className="nav-call mt-3 flex min-h-12 items-center justify-center rounded-full bg-accent px-4 text-base font-semibold text-on-accent hover:bg-accent-strong"
            >
              Book a meeting
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
