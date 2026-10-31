"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Search,
  CalendarDays,
  Star,
  CircleUserRound
} from "lucide-react";
export function BottomNav() {
  const pathname = usePathname();
  const tabs = [
    { href: "/main", label: "메인", Icon: House },
    { href: "/home", label: "탐색", Icon: Search },
    { href: "/plan", label: "마이로컬", Icon: CalendarDays },
    { href: "/mission", label: "미션", Icon: Star },
    { href: "/my", label: "MY", Icon: CircleUserRound }
  ];
  return (
    <nav
      aria-label="메인 메뉴"
      className="sticky bottom-0 z-30 flex shrink-0 border-t border-[#dce7df] bg-white pt-3 pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      {tabs.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname.startsWith(href) ? "page" : undefined}
          className={`flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] ${pathname.startsWith(href) ? "font-bold text-[#478264]" : "text-[#89958c]"}`}
        >
          <Icon size={20} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
