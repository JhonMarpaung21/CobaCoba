"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { getEvent } from "@/data/events";
import { setDemoSession } from "@/lib/demo-session";
import { getRegistrationReceiptId, registrationReceiptPath } from "@/lib/registration-receipt";
import { isValidEmail } from "@/lib/validation";

type AuthMode = "login" | "register" | "recovery";
type FieldName = "name" | "email" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;
type AuthInputs = Record<FieldName, HTMLInputElement | null>;

const content = {
  login: {
    title: "Masuk ke SportID",
    intro: "Temukan event olahraga dan kelola pendaftaran Anda.",
    action: "Masuk",
  },
  register: {
    title: "Daftar Akun",
    intro: "Buat akun untuk menyimpan pendaftaran.",
    action: "Buat Akun",
  },
  recovery: {
    title: "Lupa Kata Sandi",
    intro: "Masukkan email akun untuk menerima tautan pengaturan ulang kata sandi.",
    action: "Kirim Tautan",
  },
} satisfies Record<AuthMode, { title: string; intro: string; action: string }>;

const appPaths = new Set([
  "/beranda",
  "/cari-event",
  "/pembaruan",
  "/pendaftaran",
]);

function getSafeNext(value: string | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return undefined;
  }

  const origin = "https://sportid.invalid";
  let url: URL;
  try {
    url = new URL(value, origin);
  } catch {
    return undefined;
  }
  if (url.origin !== origin) return undefined;

  const pathname = url.pathname.replace(/\/$/, "");
  const isEventPath = /^\/event\/[a-z0-9-]+(?:\/daftar)?$/.test(pathname);
  const isReceiptPath = pathname === registrationReceiptPath && getRegistrationReceiptId(url.searchParams);
  if (!appPaths.has(pathname) && !isEventPath && !isReceiptPath) return undefined;

  return pathname + url.search + url.hash;
}

function withNext(path: string, next: string | undefined) {
  return next ? { pathname: path, query: { next } } : path;
}

function AuthField({
  name,
  label,
  type,
  autoComplete,
  hint,
  error,
  minLength,
}: {
  name: FieldName;
  label: string;
  type: "text" | "email" | "password";
  autoComplete: string;
  hint?: string;
  error?: string;
  minLength?: number;
}) {
  const id = `auth-${name}`;
  const help = hint !== error ? hint : undefined;
  const describedBy = [help && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        autoComplete={autoComplete}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className="input"
        id={id}
        minLength={minLength}
        required
        type={type}
      />
      {help && <small id={`${id}-hint`} className="muted">{help}</small>}
      {error && <small id={`${id}-error`} className="field-error">{error}</small>}
    </div>
  );
}

function getInput(form: HTMLFormElement, name: FieldName) {
  const input = form.elements.namedItem(`auth-${name}`);
  return input instanceof HTMLInputElement ? input : null;
}

function validateFields(inputs: AuthInputs, mode: AuthMode): FieldErrors {
  const errors: FieldErrors = {};

  if (mode === "register" && !inputs.name?.value.trim()) {
    errors.name = "Masukkan nama lengkap.";
  }

  if (!inputs.email?.value.trim()) {
    errors.email = "Masukkan email.";
  } else if (inputs.email.validity.typeMismatch || !isValidEmail(inputs.email.value.trim())) {
    errors.email = "Masukkan alamat email yang valid.";
  }

  const password = inputs.password?.value ?? "";
  if (mode !== "recovery" && !password.trim()) {
    errors.password = "Masukkan kata sandi.";
  } else if (mode === "register" && password.length < 8) {
    errors.password = "Gunakan minimal 8 karakter.";
  }

  return errors;
}

function RecoveryFeedback({ next }: { next?: string }) {
  const [resendCount, setResendCount] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <section className="panel stack" aria-labelledby="auth-title">
      <h1 id="auth-title" ref={heading} tabIndex={-1}>Periksa email Anda</h1>
      <p>Simulasi pengaturan ulang kata sandi selesai. Email tidak dikirim dalam mode demo.</p>
      <button
        className="button button--secondary"
        onClick={() => setResendCount((count) => count + 1)}
        type="button"
      >
        Kirim Ulang Tautan
      </button>
      <p aria-live="polite" className={resendCount ? "notice" : "sr-only"}>
        {resendCount > 0 && `Permintaan ulang ke-${resendCount} disimulasikan. Email tidak dikirim.`}
      </p>
      <Link className="text-link" href={withNext("/masuk", next)}>Kembali ke Masuk</Link>
    </section>
  );
}

function AuthFormContent({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const requestedPaths = useSearchParams().getAll("next");
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [requestedRecovery, setRequestedRecovery] = useState(false);
  const next = getSafeNext(requestedPaths.length === 1 ? requestedPaths[0] : undefined);
  const eventSlug = next?.match(/^\/event\/([a-z0-9-]+)\/daftar(?:[?#]|$)/)?.[1];
  const event = eventSlug ? getEvent(eventSlug) : undefined;
  const page = content[mode];

  function handleSubmit(submission: FormEvent<HTMLFormElement>) {
    submission.preventDefault();
    const form = submission.currentTarget;
    const inputs = {
      name: getInput(form, "name"),
      email: getInput(form, "email"),
      password: getInput(form, "password"),
    };
    const nextErrors = validateFields(inputs, mode);
    const firstError = (Object.keys(nextErrors) as FieldName[])[0];
    setErrors(nextErrors);

    if (firstError) {
      inputs[firstError]?.focus();
      return;
    }

    if (mode === "recovery") {
      setRequestedRecovery(true);
      return;
    }

    setDemoSession({
      name: inputs.name?.value.trim() ?? "",
      email: inputs.email?.value.trim() ?? "",
    });
    form.reset();
    startTransition(() => router.replace(next ?? "/beranda"));
  }

  if (requestedRecovery) return <RecoveryFeedback next={next} />;

  return (
    <section className="panel stack" aria-labelledby="auth-title">
      <header>
        <h1 id="auth-title">{page.title}</h1>
        <p>{page.intro}</p>
      </header>
      {mode === "login" && event && (
        <p className="notice">Masuk untuk melanjutkan pendaftaran {event.title}. Pilihan event tetap tersimpan.</p>
      )}
      <form className="stack" noValidate onSubmit={handleSubmit}>
        {mode === "register" && (
          <AuthField name="name" label="Nama lengkap" type="text" autoComplete="name" error={errors.name} />
        )}
        <AuthField name="email" label="Email" type="email" autoComplete="email" error={errors.email} />
        {mode !== "recovery" && (
          <AuthField
            name="password"
            label="Kata sandi"
            type="password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            minLength={mode === "register" ? 8 : undefined}
            hint={mode === "register" ? "Gunakan minimal 8 karakter." : undefined}
            error={errors.password}
          />
        )}
        {mode === "login" && (
          <Link className="text-link" href={withNext("/lupa-kata-sandi", next)}>Lupa kata sandi?</Link>
        )}
        <p className="muted">Mode demo. Gunakan data contoh.</p>
        <button className="button button--primary" disabled={pending} type="submit">
          {pending ? "Memproses…" : page.action}
        </button>
      </form>
      {mode === "login" && (
        <>
          <Link className="button button--secondary" href={withNext("/daftar-akun", next)}>Daftar Akun</Link>
          <Link className="text-link" href="/beranda">Lanjut sebagai Tamu</Link>
          <div>
            <p>Bantuan akun atau kendala teknis?</p>
            <button className="text-link" disabled type="button">Hubungi Tim SportID</button>
            <p className="muted">Kontak belum tersedia dalam mode demo.</p>
          </div>
        </>
      )}
      {mode === "register" && (
        <p>Sudah punya akun? <Link className="text-link" href={withNext("/masuk", next)}>Masuk</Link></p>
      )}
      {mode === "recovery" && (
        <Link className="text-link" href={withNext("/masuk", next)}>Kembali ke Masuk</Link>
      )}
    </section>
  );
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const fallback = (
    <section className="panel stack" aria-labelledby="auth-title">
      <h1 id="auth-title">{content[mode].title}</h1>
      <p className="muted" role="status">Menyiapkan formulir…</p>
    </section>
  );

  return (
    <main className="container auth-layout" id="main-content">
      <Suspense fallback={fallback}>
        <AuthFormContent mode={mode} />
      </Suspense>
    </main>
  );
}
