import {
  Ban,
  CalendarDays,
  CircleCheck,
  Clock3,
  Flag,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatEventDate } from "@/data/events";
import type { EventStatus, SportEvent } from "@/types/sport";

const statusLabels = {
  open: { label: "Pendaftaran dibuka", icon: CircleCheck },
  upcoming: { label: "Segera hadir", icon: Clock3 },
  full: { label: "Penuh", icon: Ban },
  completed: { label: "Selesai", icon: Flag },
} satisfies Record<EventStatus, { label: string; icon: typeof CircleCheck }>;

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, icon: Icon } = statusLabels[status];

  return (
    <span className={`status-badge status-badge--${status}`}>
      <Icon size={15} aria-hidden="true" />
      {label}
    </span>
  );
}

export function EventCard({ event }: { event: SportEvent }) {
  return (
    <article className="event-card">
      <ImagePlaceholder className="event-card__image" />
      <div className="event-card__badges cluster">
        <span className="category-chip">{event.sport}</span>
        <EventStatusBadge status={event.status} />
      </div>
      <h3 className="event-card__title">{event.title}</h3>
      <ul className="event-card__facts">
        <li>
          <CalendarDays size={17} aria-hidden="true" />
          <time dateTime={event.date}>{formatEventDate(event.date)}</time>
        </li>
        <li>
          <MapPin size={17} aria-hidden="true" />
          {event.venue}, {event.city}
        </li>
      </ul>
      <Link
        href={`/event/${event.slug}`}
        className="button button--secondary event-card__link"
        aria-label={`Lihat Detail ${event.title}`}
      >
        Lihat Detail
      </Link>
    </article>
  );
}
