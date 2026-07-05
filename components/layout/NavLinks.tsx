"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + "/");
    return isActive
      ? "text-sm font-medium text-accent transition-colors"
      : "text-sm font-medium text-text-dark hover:text-accent transition-colors";
  };

  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link href="/dashboard" className={getLinkClass("/dashboard")}>
        Dashboard
      </Link>
      <Link href="/find-jobs" className={getLinkClass("/find-jobs")}>
        Find Jobs
      </Link>
      <Link href="/profile" className={getLinkClass("/profile")}>
        Profile
      </Link>
    </nav>
  );
}
