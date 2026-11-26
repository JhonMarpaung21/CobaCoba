"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getDemoSession, getServerDemoSession, subscribeDemoSession } from "@/lib/demo-session";

export function HomeAccountLink() {
  const session = useSyncExternalStore(subscribeDemoSession, getDemoSession, getServerDemoSession);

  if (session) return null;

  return (
    <Link className="hero__account-link" href="/masuk">
      Masuk untuk menyimpan pendaftaran
    </Link>
  );
}
