"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/settings/account", label: "Account" },
  { href: "/settings/security", label: "Privacy & Security" },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800">
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-6 text-xl font-medium tracking-tight text-gray-900">
          Settings
        </h1>
        <nav className="mb-6 flex gap-1 rounded-2xl border border-gray-100 bg-white p-1 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 rounded-xl px-3 py-2 text-center text-xs font-medium transition-colors ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}

