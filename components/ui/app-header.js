"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Overview" },
  { href: "/news", label: "News" },
  { href: "/dashboard", label: "Dashboard" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f5efe4]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-[#0f3d3e] text-sm font-semibold uppercase tracking-[0.3em] text-white">
            ET
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#0f3d3e]">
              Election Tracker
            </p>
            <p className="font-serif text-lg text-slate-900">Live India pulse</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium text-slate-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full border px-4 py-2 transition ${
                pathname === link.href
                  ? "border-[#0f3d3e] bg-[#0f3d3e] text-white"
                  : "border-black/10 hover:border-[#0f3d3e] hover:bg-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
