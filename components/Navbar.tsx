"use client";

import React, { useState, useEffect } from "react";
import { Bell, LayoutDashboard, Menu, WalletCards, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../public/EvocLab_Logo.png";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "Careers", href: "/careers" },
    { name: "Book Demo", href: "/book-demo" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center transition-all duration-500 ${
        isScrolled
          ? "bg-[#06050a]/88 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
          : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-7xl flex items-center justify-between gap-5">
        <Link href="/" className="flex items-center">
          <div className="relative h-[28px] w-8">
            <Image
              src={logoImg}
              alt="Expense tracker"
              fill
              className="object-contain object-left filter brightness-125"
              priority
            />
          </div>
          <div className="ml-[5px] flex items-baseline gap-1">
            <span className="inline-block text-lg font-bold tracking-tight text-white uppercase">
              Spend
            </span>
            <span
              className="text-xl italic tracking-tight text-white font-instrument-serif"
              style={{ fontFamily: '\"Playfair Display\", serif' }}
            >
              Sense
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/6 text-white">
              <Bell size={14} />
            </div>
            <div className="text-sm">
              <div className="font-medium text-white">Anonymous sync</div>
              <div className="text-xs text-text-secondary">
                Firebase connected
              </div>
            </div>
          </div>

          <Link
            href="/book-demo"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-linear-to-r from-primary via-[#5f74ff] to-cyan-400 px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_24px_rgba(79,93,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_36px_rgba(79,93,255,0.5)] sm:flex"
          >
            <WalletCards size={15} />
            Open finance app
          </Link>

          <button
            className="md:hidden p-2 -mr-2 text-zinc-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-20 left-4 right-4 bg-[#0f0e14]/95 backdrop-blur-xl border border-white/12 rounded-2xl p-6 md:hidden z-40 shadow-[0_24px_64px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-zinc-300 hover:text-white transition-colors text-center"
              >
                Dashboard home
              </Link>
              <Link
                href="/blogs"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-zinc-300 hover:text-white transition-colors text-center"
              >
                Blog
              </Link>
              <Link
                href="/book-demo"
                onClick={() => setIsMenuOpen(false)}
                className="group mt-2 flex items-center justify-center gap-3 rounded-full bg-linear-to-r from-primary via-[#5f74ff] to-cyan-400 py-4 font-semibold text-white transition-all"
              >
                <LayoutDashboard size={16} />
                <span>Open finance app</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
