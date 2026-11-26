export type DemoSession = {
  name: string;
  email: string;
};

const storageKey = "sportid:demo-session";
const listeners = new Set<() => void>();
let cachedSession: DemoSession | null | undefined;

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  if (cachedSession !== undefined) return cachedSession;

  cachedSession = null;
  try {
    const saved = window.sessionStorage.getItem(storageKey);
    const parsed: unknown = saved ? JSON.parse(saved) : null;

    if (
      parsed &&
      typeof parsed === "object" &&
      "name" in parsed &&
      typeof parsed.name === "string" &&
      "email" in parsed &&
      typeof parsed.email === "string"
    ) {
      cachedSession = { name: parsed.name, email: parsed.email };
    }
  } catch {
    // The current tab can still keep a session in memory.
  }

  return cachedSession;
}

export function getServerDemoSession(): undefined {
  return undefined;
}

export function setDemoSession(session: DemoSession | null): void {
  if (typeof window === "undefined") return;

  cachedSession = session ? { name: session.name, email: session.email } : null;
  try {
    if (cachedSession) {
      window.sessionStorage.setItem(storageKey, JSON.stringify(cachedSession));
    } else {
      window.sessionStorage.removeItem(storageKey);
    }
  } catch {
    // Storage may be disabled by the browser.
  }

  listeners.forEach((listener) => listener());
}

export function subscribeDemoSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
