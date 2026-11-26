export type EventStatus = "open" | "upcoming" | "full" | "completed";

export interface SportEvent {
  slug: string;
  title: string;
  sport: string;
  category: string;
  city: string;
  venue: string;
  date: string;
  fee: number;
  distanceKm?: number;
  status: EventStatus;
  organizer: string;
  requirements: string;
  facilities: string;
  schedule: { time: string; label: string }[];
  racePack?: {
    schedule: string;
    venue: string;
    instructions: string;
    note: string;
  };
  announcement?: {
    title: string;
    summary: string;
    body: string;
    source: string;
    checkedAt: string;
    postedAt: string;
  };
  ticketCategories: string[];
}
