import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { UserMenu } from "@/components/layout/UserMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center">
            <Logo />
          </Link>
          <nav className="hidden sm:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Timesheets
            </Link>
          </nav>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
