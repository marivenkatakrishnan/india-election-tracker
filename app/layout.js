import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { AppHeader } from "@/components/ui/app-header";

export const metadata = {
  title: "Election Tracker",
  description: "A live election tracker built with Next.js, Tailwind CSS, and free public APIs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[#f5efe4] text-slate-900 antialiased">
        <div className="relative isolate min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(207,106,50,0.18),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(15,61,62,0.28),_transparent_38%)]" />
          <AppHeader />
          <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
