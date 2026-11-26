import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { RegistrationForm } from "@/components/forms/registration-form";
import { events, getEvent } from "@/data/events";

export const metadata: Metadata = { title: "Formulir Pendaftaran" };

export function generateStaticParams() {
  return events.map(({ slug }) => ({ slug }));
}

export default async function RegistrationFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <main className="container page-shell stack" id="main-content">
      <div className="page-heading">
        <Link className="text-link cluster" href={`/event/${event.slug}`}>
          <ChevronLeft aria-hidden="true" size={18} /> Kembali
        </Link>
        <h1>Formulir Pendaftaran</h1>
      </div>
      {event.status === "open" ? (
        <RegistrationForm event={event} />
      ) : (
        <div className="panel stack">
          <p>Pendaftaran untuk {event.title} sedang ditutup.</p>
          <Link className="text-link" href={`/event/${event.slug}`}>Baca Detail Event</Link>
        </div>
      )}
    </main>
  );
}
