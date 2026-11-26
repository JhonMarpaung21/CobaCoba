"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { RegistrationAccess } from "@/components/forms/registration-access";
import { getEvent } from "@/data/events";
import { formatDemoSubmissionTime, useDemoRegistrations } from "@/lib/demo-registrations";
import { getRegistrationReceiptId, registrationReceiptHref } from "@/lib/registration-receipt";

function ReceiptUnavailable() {
  return (
    <div className="panel empty-state stack">
      <h2>Bukti pendaftaran belum tersedia</h2>
      <p>Buka Pendaftaran Saya untuk melihat bukti yang tersedia di sesi demo ini.</p>
      <Link className="text-link" href="/pendaftaran">Lihat Pendaftaran Saya</Link>
    </div>
  );
}

function ReceiptContent({ id, email }: { id: string; email: string }) {
  const registrations = useDemoRegistrations(email);
  const registration = registrations.find((item) => item.id === id);

  if (!registration) return <ReceiptUnavailable />;

  const event = getEvent(registration.eventSlug);

  return (
    <div className="registration-flow stack">
      <article className="panel registration-receipt stack">
        <div className="registration-receipt-status stack">
          <CircleCheck aria-hidden="true" size={32} />
          <h2>Pendaftaran Terkirim</h2>
          <p>Simulasi. Data tersimpan di tab browser ini.</p>
        </div>

        <dl className="registration-details stack">
          <div>
            <dt>Nomor Pendaftaran</dt>
            <dd className="registration-id">{registration.id}</dd>
          </div>
          <div>
            <dt>Event</dt>
            <dd>{event?.title ?? "Event SportID"}</dd>
            <dd>{registration.category}</dd>
          </div>
          <div>
            <dt>Peserta</dt>
            <dd>{registration.name}</dd>
            <dd>{registration.email}</dd>
            <dd>{registration.phone}</dd>
          </div>
          <div>
            <dt>Waktu Pengiriman</dt>
            <dd>{formatDemoSubmissionTime(registration.submittedAt)}</dd>
          </div>
        </dl>

        <p className="notice">
          Status Terkirim menunjukkan pengiriman formulir dalam demo. Keikutsertaan dan pembayaran belum dikonfirmasi.
        </p>
        <div className="registration-actions cluster">
          <Link className="button button--primary" href="/pendaftaran">Lihat Pendaftaran Saya</Link>
          {event && (
            <Link className="button button--secondary" href={`/event/${event.slug}`}>
              Kembali ke Detail Event
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}

export function RegistrationReceipt() {
  const id = getRegistrationReceiptId(useSearchParams());

  return (
    <RegistrationAccess next={id ? registrationReceiptHref(id) : "/pendaftaran"}>
      {(session) => id ? <ReceiptContent id={id} email={session.email} /> : <ReceiptUnavailable />}
    </RegistrationAccess>
  );
}
