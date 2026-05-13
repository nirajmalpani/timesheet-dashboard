"use client";

import { signOut, useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

export function UserMenu() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "Guest";

  return (
    <Dropdown
      trigger={
        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-gray-900">
          {name}
          <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden />
        </span>
      }
    >
      {(close) => (
        <>
          <div className="px-3 py-1.5 text-xs text-gray-500">
            {session?.user?.email}
          </div>
          <DropdownItem
            onClick={() => {
              close();
              signOut({ callbackUrl: "/login" });
            }}
            destructive
          >
            Sign out
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
}
