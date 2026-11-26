import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventStatusBadge } from "@/components/events/event-card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { events, formatEventDate, formatEventFee, getEvent } from "@/data/events";

type EventPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  return { title: event?.title ?? "Detail Event" };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const { announcement, racePack } = event;
  const eligibility = [event.requirements, event.facilities].filter(Boolean).join(" ");

  return (
    <main id="main-content" className="container page-shell">
      <div className="page-heading">
        <Link href="/cari-event" className="text-link">
          <ArrowLeft size={18} aria-hidden="true" /> Kembali
        </Link>
        <h1>Detail Event</h1>
      </div>

      <div className="page-grid event-detail-grid">
        <article className="detail-content" aria-labelledby="event-title">
          <ImagePlaceholder className="event-detail-media" label={`Placeholder poster ${event.title}`} />
          <header className="event-detail-header">
            <h2 id="event-title">{event.title}</h2>
            <EventStatusBadge status={event.status} />
          </header>

          <section className="panel detail-section" aria-labelledby="event-information">
            <h3 id="event-information">Informasi Event</h3>
            <dl className="event-facts">
              <div><dt>Penyelenggara</dt><dd>{event.organizer}</dd></div>
              <div><dt>Tanggal</dt><dd><time dateTime={event.date}>{formatEventDate(event.date)}</time></dd></div>
              <div><dt>Lokasi</dt><dd>{event.venue}, {event.city}</dd></div>
              <div><dt>Kategori</dt><dd>{event.category}</dd></div>
              <div><dt>Biaya</dt><dd>{formatEventFee(event.fee)}</dd></div>
            </dl>
          </section>

          <section className="panel detail-section" aria-labelledby="event-requirements">
            <h3 id="event-requirements">Syarat dan Fasilitas</h3>
            <p>{eligibility || "Informasi syarat dan fasilitas belum tersedia."}</p>
          </section>

          {event.schedule.length > 0 && (
            <section className="panel detail-section" aria-labelledby="event-schedule">
              <h3 id="event-schedule">Jam Kegiatan</h3>
              <dl className="event-schedule">
                {event.schedule.map(({ time, label }) => (
                  <div key={`${time}-${label}`}><dt>{time}</dt><dd>{label}</dd></div>
                ))}
              </dl>
            </section>
          )}

          {racePack && (
            <section className="panel detail-section" aria-labelledby="race-pack">
              <h3 id="race-pack">Pengambilan Race Pack</h3>
              <ul className="race-pack-information">
                <li>{racePack.schedule}</li>
                <li>{racePack.venue}</li>
                <li>{racePack.instructions}</li>
              </ul>
              <p className="notice">{racePack.note}</p>
            </section>
          )}

          <section className="panel detail-section" aria-labelledby="event-announcement">
            <h3 id="event-announcement">Pengumuman Event</h3>
            {announcement ? (
              <>
                <p>{announcement.postedAt} • {announcement.body}</p>
                <p className="source-meta">Sumber: {announcement.source}<br />Diperiksa: {announcement.checkedAt}</p>
              </>
            ) : (
              <p>Pengumuman belum tersedia.</p>
            )}
            <div className="source-actions">
              {announcement && (
                <button className="button button--secondary" type="button" disabled aria-describedby="source-unavailable">
                  Buka Sumber Resmi
                </button>
              )}
              <button className="button button--secondary" type="button" disabled aria-describedby="source-unavailable">
                Hubungi Penyelenggara
              </button>
            </div>
            <p id="source-unavailable" className="source-meta">
              {announcement ? "Tautan sumber dan kontak penyelenggara belum tersedia." : "Kontak penyelenggara belum tersedia."}
            </p>
          </section>
        </article>

        <aside className="sticky-panel detail-registration" aria-label="Pendaftaran event">
          {event.status === "open" ? (
            <Link className="button button--primary" href={`/event/${event.slug}/daftar`}>Daftar sebagai Peserta</Link>
          ) : (
            <button className="button button--primary" type="button" disabled>Pendaftaran tidak tersedia</button>
          )}
        </aside>
      </div>
    </main>
  );
}
