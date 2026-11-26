import type { SportEvent } from "@/types/sport";

export const events: SportEvent[] = [
  {
    slug: "medan-community-run",
    title: "Medan Community Run",
    sport: "Lari",
    category: "Lari 5K",
    city: "Medan",
    venue: "Taman Kota",
    date: "2026-11-22",
    fee: 0,
    distanceKm: 5,
    status: "open",
    organizer: "Komunitas Lari Medan",
    requirements: "Usia minimal 16 tahun. Peserta mengikuti rute 5K dan ketentuan kegiatan.",
    facilities: "Air minum dan nomor peserta tersedia.",
    schedule: [
      { time: "05.30 WIB", label: "Berkumpul" },
      { time: "05.45 WIB", label: "Pengarahan" },
      { time: "06.00 WIB", label: "Mulai lari" },
    ],
    racePack: {
      schedule: "21 November 2026, 10.00–17.00 WIB",
      venue: "Sekretariat komunitas, Medan",
      instructions: "Bawa identitas dan bukti pendaftaran.",
      note: "Pengambilan oleh perwakilan: belum dikonfirmasi. Hubungi penyelenggara sebelum membuat rencana.",
    },
    announcement: {
      title: "Perubahan jam berkumpul",
      summary: "Jam berkumpul diperbarui menjadi 05.30 WIB.",
      body: "Berkumpul pukul 05.30 WIB, dari sebelumnya 05.45 WIB. Mulai lari tetap 06.00 WIB.",
      source: "pengumuman resmi komunitas",
      checkedAt: "2 November 2026, 09.00 WIB",
      postedAt: "2 November 2026",
    },
    ticketCategories: ["5K"],
  },
  {
    slug: "medan-fun-cycling",
    title: "Medan Fun Cycling",
    sport: "Sepeda",
    category: "Sepeda santai",
    city: "Medan",
    venue: "Lapangan Merdeka",
    date: "2026-11-29",
    fee: 50000,
    status: "upcoming",
    organizer: "Komunitas Sepeda Medan",
    requirements: "Gunakan helm dan pastikan sepeda dalam kondisi layak.",
    facilities: "Air minum tersedia di titik berkumpul.",
    schedule: [],
    ticketCategories: ["Sepeda santai"],
  },
];

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
  timeZone: "UTC",
});
const feeFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function getEvent(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function formatEventDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function formatEventFee(fee: number) {
  return fee === 0 ? "Gratis" : feeFormatter.format(fee);
}
