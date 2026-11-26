'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type EventUpdate = {
  slug: string;
  title: string;
  announcement?: {
    title: string;
    body: string;
    source: string;
    checkedAt: string;
  };
};

type EventUpdateListProps = {
  items: readonly EventUpdate[];
  expandedSlug?: string | null;
};

export function EventUpdateList({ items, expandedSlug }: EventUpdateListProps) {
  return (
    <div className="stack">
      {items.map(({ slug, title, announcement }) => {
        const expanded = expandedSlug === slug;
        const titleId = `update-${slug}-title`;
        const detailId = `update-${slug}-detail`;
        const sourceId = `update-${slug}-source-note`;

        return (
          <article className="panel stack" key={slug} aria-labelledby={titleId}>
            <h3 id={titleId}>{title}</h3>

            {announcement ? (
              <>
                <p>{announcement.title}</p>
                <div>
                  <Link
                    className="text-link"
                    href={expanded ? '/pembaruan' : `/pembaruan?event=${encodeURIComponent(slug)}`}
                    aria-expanded={expanded}
                    aria-controls={detailId}
                    scroll={false}
                  >
                    {expanded ? 'Tutup Pengumuman' : 'Baca Pengumuman'}
                  </Link>
                </div>
                <div id={detailId} hidden={!expanded}>
                  <div className="stack">
                    <p>{announcement.body}</p>
                    <p className="muted">
                      Sumber: {announcement.source}
                      <br />
                      Diperiksa {announcement.checkedAt}
                    </p>
                    <div className="cluster">
                      <button type="button" className="button button--secondary" disabled aria-describedby={sourceId}>
                        Buka Sumber Resmi
                      </button>
                      <Link className="text-link" href={`/event/${slug}`}>
                        Detail Event dan Kontak
                      </Link>
                    </div>
                    <p id={sourceId} className="muted">Tautan sumber resmi belum tersedia.</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="muted">Pengumuman belum tersedia. Informasi event tetap dapat dibaca di Detail Event.</p>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function LinkedEventUpdates({ items }: Pick<EventUpdateListProps, 'items'>) {
  const slug = useSearchParams().get('event');
  return <EventUpdateList items={items} expandedSlug={slug} />;
}
