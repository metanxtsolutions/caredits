"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, CalendarClock, Users, Tag, CalendarX, Images, Newspaper, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarClock },
  { href: "/admin/photographers", label: "Photographers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarX },
  { href: "/admin/portfolio", label: "Portfolio", icon: Images },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="lg:sticky lg:top-28 lg:self-start">
      <p className="font-label mb-4 text-xs font-semibold uppercase tracked text-accent">Admin</p>
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0 lg:shrink">
              <a
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold transition-colors",
                  active ? "bg-ink text-white" : "text-ink/70 hover:bg-grey-light",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </a>
            </li>
          );
        })}
        <li className="shrink-0 lg:shrink lg:mt-4 lg:border-t lg:border-border lg:pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-grey transition-colors hover:text-accent"
          >
            <LogOut className="size-4 shrink-0" />
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
}
