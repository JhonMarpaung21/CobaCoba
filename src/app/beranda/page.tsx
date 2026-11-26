import type { Metadata } from "next";
import { CalendarCheck, Megaphone } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/events/event-card";
import { HomeAccountLink } from "@/components/layout/home-account-link";
import { events } from "@/data/events";

export const metadata: Metadata = { title: "Beranda" };

export default function HomePage() {
  const featuredEvent = events[0];
  const announcement = featuredEvent.announcement;

  return (
    <main id="main-content" className="container page-shell home-page">
      <h1 className="page-heading">Beranda</h1>
      <section className="home-hero" aria-labelledby="home-discovery-title">
        <h2 id="home-discovery-title">Temukan event yang sesuai</h2>
        <div className="hero__actions">
          <Link className="button button--primary" href="/cari-event">
            Cari Event Olahraga
          </Link>
          <HomeAccountLink />
        </div>
      </section>
      <div className="home-grid">
        <section className="stack" aria-labelledby="upcoming-event-title">
          <h2 id="upcoming-event-title">Event Mendatang</h2>
          <EventCard event={featuredEvent} />
          <Link className="text-link" href="/cari-event">Lihat Semua Event</Link>
        </section>
        <div className="stack home-aside">
          <section className="stack" aria-labelledby="latest-updates-title">
            <h2 id="latest-updates-title">Pembaruan Terbaru</h2>
            {announcement && (
              <article className="panel home-update stack">
                <div className="cluster">
                  <Megaphone size={19} aria-hidden="true" />
                  <h3>{featuredEvent.title}</h3>
                </div>
                <p>{announcement.summary}</p>
                <Link className="text-link" href={`/pembaruan?event=${featuredEvent.slug}`}>
                  Baca Pengumuman
                </Link>
              </article>
            )}
          </section>
          <section className="panel home-account stack" aria-label="Pendaftaran dan bantuan">
            <Link className="home-account__link" href="/pendaftaran">
              <CalendarCheck size={21} aria-hidden="true" />
              Pendaftaran Saya
            </Link>
            <p className="muted">Bantuan dan Kontak · Tim SportID</p>
            <p className="unavailable-note">Kontak belum tersedia.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
