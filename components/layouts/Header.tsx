"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X, LogOut } from "lucide-react";

interface HeaderProps {
  cartItemCount?: number;
}

export default function Header({ cartItemCount = 0 }: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: "Tìm kiếm", href: "/products", isSearchTrigger: true },
    { label: "Sản phẩm", href: "/products" },
    { label: "Ưu đãi", href: "/promotions" },
    { label: "Hỗ trợ", href: "/support" },
  ];

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xs border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              ABC
            </Link>
          </div>

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

            {/* User Profile Dropdown Button */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                aria-label="Tài khoản"
                aria-expanded={isProfileMenuOpen}
                className="w-10 h-10 rounded-full bg-secondary hover:bg-accent text-secondary-foreground hover:text-accent-foreground flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <User className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Hồ sơ của tôi</span>
                  </Link>

                  <div className="my-1 border-t border-border" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>

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
          <div className="pt-2 border-t border-border">
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Hồ sơ của tôi
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push("/login");
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
