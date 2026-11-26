"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { RegistrationAccess } from "@/components/forms/registration-access";
import { RegistrationPicker } from "@/components/forms/registration-picker";
import { getEvent } from "@/data/events";
import { formatDemoSubmissionTime, useDemoRegistrations } from "@/lib/demo-registrations";
import { registrationReceiptHref } from "@/lib/registration-receipt";

function HistoryContent({ email }: { email: string }) {
  const registrations = useDemoRegistrations(email);

  return (
    <div className="registration-flow stack">
      {registrations.length === 0 ? (
        <div className="panel empty-state stack">
          <ClipboardList aria-hidden="true" size={36} />
          <h2>Belum ada pendaftaran</h2>
          <p>Pilih event, baca ketentuannya, lalu kirim formulir pendaftaran.</p>
        </div>
      ) : (
        <div className="stack" aria-label="Riwayat pendaftaran">
          {registrations.map((registration) => {
            const event = getEvent(registration.eventSlug);

            return (
              <article className="panel registration-record stack" key={registration.id}>
                <div className="cluster registration-record-heading">
                  <h2>{event?.title ?? "Event SportID"}</h2>
                  <span className="status-badge status-badge--open">Terkirim</span>
                </div>
                <p className="registration-id">{registration.id}</p>
                <p className="muted">Dikirim {formatDemoSubmissionTime(registration.submittedAt)}</p>
                <Link className="text-link" href={registrationReceiptHref(registration.id)}>
                  Buka Bukti Pendaftaran
                </Link>
                <p className="notice">
                  Status Terkirim mencatat pengiriman formulir demo di tab ini. Keikutsertaan belum dikonfirmasi.
                </p>
              </article>
            );
          })}
        </div>
      )}
      <div className="registration-actions"><RegistrationPicker /></div>
      <p className="muted">Bantuan dan Kontak · Tim SportID (kontak belum tersedia)</p>
    </div>
  );
}

export function RegistrationHistory() {
  return (
    <RegistrationAccess next="/pendaftaran">
      {(session) => <HistoryContent email={session.email} />}
    </RegistrationAccess>
  );
}
