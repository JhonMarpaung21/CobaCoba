import type { Metadata } from 'next';
import { Suspense } from 'react';
import { EventUpdateList, LinkedEventUpdates } from '@/components/events/event-updates';
import { events } from '@/data/events';

export const metadata: Metadata = { title: 'Pembaruan Event' };

export default function UpdatesPage() {
  const items = events.map(({ slug, title, announcement }) => ({ slug, title, announcement }));

  return (
    <main id="main-content" className="container page-shell stack">
      <header className="page-heading">
        <h1>Pembaruan Event</h1>
      </header>
      <section className="stack" aria-labelledby="pengumuman-heading">
        <div>
          <h2 id="pengumuman-heading">Pengumuman resmi event</h2>
          <p className="muted">Baca perubahan langsung pada halaman ini.</p>
        </div>
        <Suspense fallback={<EventUpdateList items={items} />}>
          <LinkedEventUpdates items={items} />
        </Suspense>
      </section>
    </main>
  );
}
