"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";

interface HeaderProps {
  cartItemCount?: number;
}

export default function Header({ cartItemCount = 0 }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "Tìm kiếm", href: "/products", isSearchTrigger: true },
    { label: "Sản phẩm", href: "/products" },
    { label: "Ưu đãi", href: "/promotions" },
    { label: "Hỗ trợ", href: "/support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xs border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              ABC
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.isSearchTrigger) {
                    e.preventDefault();
                    setIsSearchOpen((prev) => !prev);
                  }
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Icons (Search, User, Cart) */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Tìm kiếm"
              className="w-10 h-10 rounded-full bg-secondary hover:bg-accent text-secondary-foreground hover:text-accent-foreground flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* User Profile / Account Button */}
            <Link
              href="/profile"
              aria-label="Tài khoản"
              className="w-10 h-10 rounded-full bg-secondary hover:bg-accent text-secondary-foreground hover:text-accent-foreground flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              aria-label="Giỏ hàng"
              className="relative w-10 h-10 rounded-full bg-secondary hover:bg-accent text-secondary-foreground hover:text-accent-foreground flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="md:hidden ml-1 p-2 rounded-lg text-muted-foreground hover:bg-muted focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="py-3 pb-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="relative max-w-xl mx-auto"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                autoFocus
                className="w-full pl-11 pr-4 py-2.5 bg-muted rounded-full text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:bg-background focus:ring-2 focus:ring-ring transition-all"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (item.isSearchTrigger) {
                  setIsSearchOpen(true);
                }
              }}
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
