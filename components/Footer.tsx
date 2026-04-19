import React from "react";
import Link from "next/link";

const Footer = () => {
  const exploreLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "Careers", href: "/careers" },
    { name: "Book Demo", href: "/book-demo" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com" },
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "GitHub", href: "https://github.com" },
  ];

  return (
    <footer className="relative overflow-hidden bg-background px-4 pb-10 pt-10 text-text-main sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-white/8 bg-white/[0.025] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-text-muted">
              Expense Tracker
            </p>
            <p className="max-w-xl text-3xl font-sans leading-tight tracking-tight text-text-main">
              A premium dark personal finance dashboard with live Firebase sync,
              focused analytics, and clean transaction workflows.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="/"
                className="inline-flex rounded-full bg-linear-to-r from-[#4f5dff] to-cyan-400 px-6 py-3 text-xs font-semibold text-white ring-1 ring-white/15 transition-all duration-300 shadow-[0_6px_28px_rgba(79,93,255,0.35)] hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(79,93,255,0.45)] active:translate-y-0"
              >
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="md:col-span-1">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-text-muted">
              Product Notes
            </p>
            <p className="text-sm leading-7 text-text-secondary">
              Built with Next.js, Tailwind CSS, Recharts, and Firebase
              Firestore. Designed to feel calm, structured, and genuinely
              product-grade.
              <br />
              Anonymous auth keeps setup friction low while still persisting
              each user&apos;s data.
            </p>
          </div>

          <div className="md:col-span-1 flex flex-col gap-8 text-sm font-medium">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                Explore
              </span>
              {exploreLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
                Social
              </span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-5 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>SpendSense Expense Tracker</span>
          <span>
            Live data sync, analytics, and a premium dark dashboard shell.
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden pt-6 text-center leading-none">
        <h1 className="pointer-events-none select-none pt-4 font-sans text-[16vw] font-bold tracking-tighter text-text-main/5">
          SPENDSENSE
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
