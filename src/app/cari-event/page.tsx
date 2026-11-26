import type { Metadata } from "next";
import { Suspense } from "react";
import { EventSearch } from "@/components/events/event-search";
import { events } from "@/data/events";

export const metadata: Metadata = { title: "Cari Event Olahraga" };

export default function SearchPage() {
  return (
    <main id="main-content" className="container page-shell">
      <div className="page-heading">
        <h1>Cari Event Olahraga</h1>
      </div>
      <Suspense fallback={<p role="status">Memuat daftar event…</p>}>
        <EventSearch events={events} />
      </Suspense>
    </main>
  );
}
