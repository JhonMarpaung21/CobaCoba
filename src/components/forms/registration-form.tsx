"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { RegistrationAccess } from "@/components/forms/registration-access";
import { formatEventDate, formatEventFee } from "@/data/events";
import { createDemoRegistration } from "@/lib/demo-registrations";
import { registrationReceiptHref } from "@/lib/registration-receipt";
import type { DemoSession } from "@/lib/demo-session";
import { isValidEmail } from "@/lib/validation";
import type { SportEvent } from "@/types/sport";

type FormField = "name" | "email" | "phone" | "category" | "consent";
type FormErrors = Partial<Record<FormField, string>>;

function RegistrationFields({
  event,
  session,
}: {
  event: SportEvent;
  session: DemoSession;
}) {
  const router = useRouter();
  const submitting = useRef(false);
  const [receiptHref, setReceiptHref] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState(false);
  const categories = event.ticketCategories.length ? event.ticketCategories : [event.category];
  const participantFields = [
    {
      name: "name",
      label: "Nama lengkap",
      type: "text",
      autoComplete: "name",
      defaultValue: session.name,
      placeholder: "Contoh: Raka Pratama",
      maxLength: 100,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      autoComplete: "email",
      defaultValue: session.email,
      placeholder: "raka@contoh.id",
      maxLength: 254,
    },
    {
      name: "phone",
      label: "Nomor HP",
      type: "tel",
      autoComplete: "tel",
      placeholder: "0812 0000 0000",
      maxLength: 24,
    },
  ] as const;

  function submitRegistration(submission: FormEvent<HTMLFormElement>) {
    submission.preventDefault();
    if (submitting.current) return;

    const form = submission.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const category = String(data.get("category") ?? "");
    const nextErrors: FormErrors = {};

    if (!name) nextErrors.name = "Masukkan nama lengkap.";
    if (!isValidEmail(email)) {
      nextErrors.email = "Format email belum valid. Periksa kembali.";
    }
    if (!/^\+?\d{8,15}$/.test(phone.replace(/[\s().-]/g, ""))) {
      nextErrors.phone = "Masukkan nomor HP yang valid.";
    }
    if (!categories.includes(category)) nextErrors.category = "Pilih kategori event.";
    if (data.get("consent") !== "on") {
      nextErrors.consent = "Konfirmasikan bahwa Anda telah membaca persyaratan.";
    }

    setErrors(nextErrors);
    const firstInvalidField = Object.keys(nextErrors)[0];
    if (firstInvalidField) {
      form.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)?.focus();
      return;
    }

    submitting.current = true;
    let nextHref: string;
    try {
      const registration = createDemoRegistration({
        accountEmail: session.email,
        eventSlug: event.slug,
        name,
        email,
        phone,
        category,
      });
      nextHref = registrationReceiptHref(registration.id);
    } catch {
      submitting.current = false;
      setSubmitError(true);
      return;
    }

    setSubmitError(false);
    setReceiptHref(nextHref);
    router.push(nextHref);
  }

  return (
    <div className="registration-flow stack">
      <section className="panel registration-summary stack" aria-label="Event terpilih">
        <p className="muted">Event terpilih</p>
        <h2>{event.title}</h2>
        <p>{event.category} · {formatEventDate(event.date)} · {formatEventFee(event.fee)}</p>
      </section>

      <form className="panel stack" onSubmit={submitRegistration} noValidate>
        <div className="stack">
          <h2>Data Peserta</h2>
          <p className="notice">Simulasi pendaftaran. Gunakan data contoh untuk mencoba formulir ini.</p>
        </div>

        <div className="form-grid">
          {participantFields.map(({ label, ...input }) => {
            const id = `registration-${input.name}`;
            const error = errors[input.name];

            return (
              <div className="field" key={input.name}>
                <label htmlFor={id}>{label}</label>
                <input
                  {...input}
                  id={id}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                />
                {error && <p id={`${id}-error`} className="field-error">{error}</p>}
              </div>
            );
          })}

          <div className="field">
            <label htmlFor="registration-category">Kategori</label>
            <select
              id="registration-category"
              name="category"
              defaultValue=""
              required
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? "registration-category-error" : undefined}
            >
              <option value="" disabled>Pilih kategori</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
            {errors.category && <p id="registration-category-error" className="field-error">{errors.category}</p>}
          </div>
        </div>

        <section className="registration-terms stack" aria-labelledby="registration-terms-heading">
          <h3 id="registration-terms-heading">Ringkasan ketentuan</h3>
          <p>{event.requirements} Baca syarat, jam kegiatan, dan persiapan sebelum mengirim.</p>
          <Link className="text-link" href={`/event/${event.slug}`}>Baca Detail Event</Link>
        </section>

        <div className="field">
          <label className="check-field" htmlFor="registration-consent">
            <input
              id="registration-consent"
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "registration-consent-error" : undefined}
            />
            Saya telah membaca persyaratan.
          </label>
          {errors.consent && (
            <p id="registration-consent-error" className="field-error">{errors.consent}</p>
          )}
        </div>

        {submitError && (
          <p className="notice notice--error" role="alert">
            Simulasi pendaftaran belum tersimpan di browser. Isian Anda masih tersedia. Coba kirim ulang.
          </p>
        )}

        <div className="registration-actions">
          {receiptHref ? (
            <Link className="button button--primary" href={receiptHref}>Buka Bukti Pendaftaran</Link>
          ) : (
            <button className="button button--primary" type="submit">
              {submitError ? "Kirim Ulang Pendaftaran" : "Kirim Pendaftaran"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export function RegistrationForm({ event }: { event: SportEvent }) {
  return (
    <RegistrationAccess next={`/event/${event.slug}/daftar`}>
      {(session) => <RegistrationFields key={session.email} event={event} session={session} />}
    </RegistrationAccess>
  );
}
