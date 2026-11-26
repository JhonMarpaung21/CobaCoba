"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useSyncExternalStore } from "react";
import {
  type DemoSession,
  getDemoSession,
  getServerDemoSession,
  subscribeDemoSession,
} from "@/lib/demo-session";

export function RegistrationAccess({
  next,
  children,
}: {
  next: string;
  children: (session: DemoSession) => ReactNode;
}) {
  const router = useRouter();
  const session = useSyncExternalStore<DemoSession | null | undefined>(
    subscribeDemoSession,
    getDemoSession,
    getServerDemoSession,
  );
  const loginHref = `/masuk?${new URLSearchParams({ next })}`;

  useEffect(() => {
    if (session === null) router.replace(loginHref);
  }, [loginHref, router, session]);

  if (session === undefined) {
    return <p className="notice" role="status">Memeriksa sesi…</p>;
  }

  if (session === null) {
    return (
      <p className="notice">
        <Link className="text-link" href={loginHref}>Masuk untuk melanjutkan</Link>
      </p>
    );
  }

  return children(session);
}
