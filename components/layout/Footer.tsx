import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border py-8 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Image
            src="/images/logo.png"
            alt="JobPilot"
            width={106}
            height={36}
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-text-secondary hover:text-accent transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/privacy-policy"
            className="text-xs font-medium text-text-secondary hover:text-accent transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs font-medium text-text-secondary hover:text-accent transition-colors"
          >
            Terms & Condition
          </Link>
        </div>
      </div>
    </footer>
  );
}
