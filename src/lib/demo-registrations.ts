"use client";

import { useMemo, useSyncExternalStore } from "react";

const storageKey = "sportid:demo-registrations";
const changeEvent = "sportid:demo-registrations-change";

export type DemoRegistration = {
  id: string;
  accountEmail: string;
  eventSlug: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  submittedAt: string;
};

function getRegistrationSnapshot(): string | null {
  try {
    return window.sessionStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function getServerRegistrationSnapshot(): null {
  return null;
}

function subscribeToRegistrations(onChange: () => void) {
  window.addEventListener(changeEvent, onChange);
  return () => window.removeEventListener(changeEvent, onChange);
}

function isDemoRegistration(value: unknown): value is DemoRegistration {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.accountEmail === "string" &&
    typeof record.eventSlug === "string" &&
    typeof record.name === "string" &&
    typeof record.email === "string" &&
    typeof record.phone === "string" &&
    typeof record.category === "string" &&
    typeof record.submittedAt === "string" &&
    Number.isFinite(Date.parse(record.submittedAt))
  );
}

function readRegistrations(snapshot: string | null): DemoRegistration[] {
  if (!snapshot) return [];

  try {
    const records: unknown = JSON.parse(snapshot);
    return Array.isArray(records) ? records.filter(isDemoRegistration) : [];
  } catch {
    return [];
  }
}

export function useDemoRegistrations(accountEmail: string): DemoRegistration[] {
  const snapshot = useSyncExternalStore(
    subscribeToRegistrations,
    getRegistrationSnapshot,
    getServerRegistrationSnapshot,
  );

  return useMemo(() => {
    const owner = accountEmail.trim().toLowerCase();
    return readRegistrations(snapshot).filter((record) => record.accountEmail === owner);
  }, [accountEmail, snapshot]);
}

export function createDemoRegistration(
  input: Omit<DemoRegistration, "id" | "submittedAt">,
): DemoRegistration {
  const submittedAt = new Date().toISOString();
  const dateLabel = submittedAt.slice(0, 10).replaceAll("-", "");
  const random = Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("").toUpperCase();
  const record = {
    ...input,
    accountEmail: input.accountEmail.trim().toLowerCase(),
    id: `SID-${dateLabel}-${random}`,
    submittedAt,
  };

  const records = readRegistrations(window.sessionStorage.getItem(storageKey));
  window.sessionStorage.setItem(storageKey, JSON.stringify([record, ...records]));
  window.dispatchEvent(new Event(changeEvent));

  return record;
}

const submissionDateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const submissionTimeFormat = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

export function formatDemoSubmissionTime(iso: string): string {
  const time = new Date(iso);
  return `${submissionDateFormat.format(time)}, ${submissionTimeFormat.format(time)} WIB`;
}
