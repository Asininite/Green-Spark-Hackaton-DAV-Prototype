"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { ProfileBar } from "@/components/profile-bar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav = pathname?.startsWith("/auth");

  return (
    <>
      {!hideNav && (
        <>
          <Navigation />
          <div className="absolute top-4 right-4 z-50">
            <ProfileBar />
          </div>
        </>
      )}
      <main className={!hideNav ? "pb-16 md:pb-0 md:ml-64" : ""}>
        {children}
      </main>
    </>
  );
}
