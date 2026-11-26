"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDemoSession } from "@/lib/demo-session";

export function SessionEntry() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace(getDemoSession() ? "/beranda" : "/masuk");
    }, 900);
    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}
