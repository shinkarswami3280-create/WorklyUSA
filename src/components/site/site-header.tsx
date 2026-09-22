import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

import { ToolSearch } from "./tool-search";
import { categories } from "@/lib/tools";

const navLinks = [
  { to: "/all-tools", label: "All Tools" },
  ...categories.map((category) => ({ to: `/category/${category.slug}`, label: category.label })),
  { to: "/guides", label: "Guides" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 shadow-card backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-display text-sm text-primary-foreground">
            W
          </span>
          Workly <span className="text-primary">USA</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
            aria-expanded={searchOpen}
            className="flex size-10 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted"
          >
            {searchOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Search className="size-5" aria-hidden="true" />
            )}
            <span className="sr-only">{searchOpen ? "Close search" : "Search calculators"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
            aria-expanded={menuOpen}
            className="flex size-10 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted lg:hidden"
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-card">
          <div className="container-page py-4">
            <ToolSearch
              size="sm"
              label="Search calculators"
              showSuggestions={false}
              autoFocus
              onNavigate={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav aria-label="Mobile" className="container-page grid gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
