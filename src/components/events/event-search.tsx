"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { EventCard } from "@/components/events/event-card";
import { formatEventDate } from "@/data/events";
import type { SportEvent } from "@/types/sport";

type SearchFilters = {
  sport: string;
  city: string;
  from: string;
  to: string;
  fee: string;
  distance: string;
};

const emptyFilters: SearchFilters = {
  sport: "",
  city: "",
  from: "",
  to: "",
  fee: "",
  distance: "",
};

const filterKeys = ["sport", "city", "from", "to", "fee", "distance"] as const;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const normalize = (value: string) => value.trim().toLocaleLowerCase("id-ID");
const isRunning = (sport: string) => normalize(sport) === "lari";

function parseDate(value: string | null) {
  if (!value || !datePattern.test(value)) return "";
  const parsed = new Date(value);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value ? value : "";
}

function matchesEvent(event: SportEvent, query: string, filters: SearchFilters) {
  const keyword = normalize(query);
  const searchable = normalize([event.title, event.sport, event.category, event.city, event.venue].join(" "));

  return (
    (!keyword || searchable.includes(keyword)) &&
    (!filters.sport || event.sport === filters.sport) &&
    (!filters.city || event.city === filters.city) &&
    (!filters.from || event.date >= filters.from) &&
    (!filters.to || event.date <= filters.to) &&
    (!filters.fee || (filters.fee === "free" ? event.fee === 0 : event.fee > 0)) &&
    (!filters.distance || event.distanceKm === Number(filters.distance))
  );
}

function describeFilters(filters: SearchFilters) {
  const from = filters.from && formatEventDate(filters.from);
  const to = filters.to && formatEventDate(filters.to);
  const dateRange = from && to ? `${from}–${to}` : from ? `Sejak ${from}` : to ? `Sampai ${to}` : "";
  const fee = filters.fee === "free" ? "Gratis" : filters.fee === "paid" ? "Berbayar" : "";
  const distance = filters.distance && `${filters.distance}K`;

  return [filters.sport, filters.city, dateRange, fee, distance].filter(Boolean).join(" • ");
}

export function EventSearch({ events }: { events: SportEvent[] }) {
  const searchParams = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);
  const filterDialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(emptyFilters);
  const [wasReset, setWasReset] = useState(false);

  const sports = [...new Set(events.map((event) => event.sport))];
  const cities = [...new Set(events.map((event) => event.city))];
  const distances = [...new Set(events.flatMap((event) =>
    isRunning(event.sport) && event.distanceKm ? [String(event.distanceKm)] : [],
  ))];
  const runningSport = sports.find(isRunning);
  const query = searchParams.get("q")?.slice(0, 120) ?? "";
  const sport = sports.find((value) => value === searchParams.get("sport")) ?? "";
  const filters = {
    sport,
    city: cities.find((value) => value === searchParams.get("city")) ?? "",
    from: parseDate(searchParams.get("from")),
    to: parseDate(searchParams.get("to")),
    fee: ["free", "paid"].find((value) => value === searchParams.get("fee")) ?? "",
    distance: isRunning(sport) ? distances.find((value) => value === searchParams.get("distance")) ?? "" : "",
  };
  const filterSummary = describeFilters(filters);
  const matchedEvents = events.filter((event) => matchesEvent(event, query, filters));
  const hasSearch = Boolean(query || filterSummary);
  const resultsTitle = matchedEvents.length === 0
    ? "Tidak ada event yang sesuai"
    : hasSearch ? `${matchedEvents.length} event ditemukan` : "Event yang dapat Anda ikuti";

  useEffect(() => {
    if (searchInput.current) searchInput.current.value = query;
  }, [query]);

  function commitSearch(nextQuery: string, nextFilters: SearchFilters) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    for (const key of filterKeys) {
      if (nextFilters[key]) params.set(key, nextFilters[key]);
    }
    url.search = params.toString();

    if (url.href !== window.location.href) window.history.pushState(null, "", url.href);
  }

  function runSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commitSearch(searchInput.current?.value ?? "", filters);
  }

  function openFilters() {
    setDraft(filters);
    setWasReset(false);
    filterDialog.current?.showModal();
  }

  function updateFilter(key: keyof SearchFilters, value: string) {
    setWasReset(false);
    setDraft((previous) => {
      const next = { ...previous, [key]: value };
      if (key === "sport" && !isRunning(value)) next.distance = "";
      return next;
    });
  }

  function resetOrChooseRunning() {
    if (wasReset && runningSport) {
      updateFilter("sport", runningSport);
      return;
    }
    setDraft(emptyFilters);
    setWasReset(true);
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commitSearch(searchInput.current?.value ?? query, draft);
    filterDialog.current?.close();
  }

  function clearSearch() {
    if (searchInput.current) searchInput.current.value = "";
    commitSearch("", emptyFilters);
    searchInput.current?.focus();
  }

  return (
    <>
      <section className="panel search-controls" aria-label="Pencarian event">
        <form className="search-controls__form" onSubmit={runSearch} role="search">
          <label className="field" htmlFor="event-query">
            <span>Nama atau kata kunci</span>
            <input
              ref={searchInput}
              id="event-query"
              name="q"
              type="search"
              placeholder="Cari nama event"
              defaultValue={query}
              maxLength={120}
            />
          </label>
          <div className="search-controls__actions">
            <button className="button button--primary" type="submit">
              <Search size={18} aria-hidden="true" />
              Cari
            </button>
            <button className="button button--secondary" type="button" aria-haspopup="dialog" onClick={openFilters}>
              <SlidersHorizontal size={18} aria-hidden="true" />
              Filter Event
            </button>
          </div>
        </form>
        {filterSummary && <p className="search-filter-summary">Filter aktif: {filterSummary}</p>}
      </section>

      <section className="search-results" aria-labelledby="search-results-title">
        <h2 id="search-results-title" aria-live="polite" aria-atomic="true">{resultsTitle}</h2>
        {matchedEvents.length ? (
          <div className="event-grid">
            {matchedEvents.map((event) => <EventCard key={event.slug} event={event} />)}
          </div>
        ) : (
          <div className="panel empty-state">
            <p>Coba kata kunci lain atau ubah filter.</p>
            <div className="search-controls__actions">
              <button className="button button--secondary" type="button" aria-haspopup="dialog" onClick={openFilters}>
                Ubah Filter
              </button>
              <button className="button button--secondary" type="button" onClick={clearSearch}>
                Hapus pencarian
              </button>
            </div>
          </div>
        )}
      </section>

      <dialog className="filter-dialog" ref={filterDialog} aria-labelledby="filter-event-title">
        <div className="dialog-body">
          <div className="dialog-heading">
            <h2 id="filter-event-title">Filter Event</h2>
            <button className="text-link" type="button" onClick={() => filterDialog.current?.close()}>Tutup</button>
          </div>
          <p role="status">
            {wasReset ? "Filter telah direset. Semua pilihan opsional." : "Persempit hasil sesuai kebutuhan Anda."}
          </p>
          <form onSubmit={applyFilters}>
            <div className="filter-fields">
              <div className="field">
                <label htmlFor="filter-sport">Cabang olahraga</label>
                <select id="filter-sport" value={draft.sport} onChange={(event) => updateFilter("sport", event.target.value)}>
                  <option value="">Semua olahraga</option>
                  {sports.map((sport) => <option key={sport}>{sport}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="filter-city">Lokasi</label>
                <select id="filter-city" value={draft.city} onChange={(event) => updateFilter("city", event.target.value)}>
                  <option value="">Semua lokasi</option>
                  {cities.map((city) => <option key={city}>{city}</option>)}
                </select>
              </div>
              <fieldset className="filter-date-range">
                <legend>Rentang tanggal</legend>
                <label className="field" htmlFor="filter-from">
                  <span>Mulai</span>
                  <input id="filter-from" type="date" value={draft.from} max={draft.to || undefined} onChange={(event) => updateFilter("from", event.target.value)} />
                </label>
                <label className="field" htmlFor="filter-to">
                  <span>Sampai</span>
                  <input id="filter-to" type="date" value={draft.to} min={draft.from || undefined} onChange={(event) => updateFilter("to", event.target.value)} />
                </label>
              </fieldset>
              <div className="field">
                <label htmlFor="filter-fee">Biaya</label>
                <select id="filter-fee" value={draft.fee} onChange={(event) => updateFilter("fee", event.target.value)}>
                  <option value="">Semua biaya</option>
                  <option value="free">Gratis</option>
                  <option value="paid">Berbayar</option>
                </select>
              </div>
              {isRunning(draft.sport) && distances.length > 0 && (
                <div className="field">
                  <label htmlFor="filter-distance">Jarak lari (opsional)</label>
                  <select id="filter-distance" value={draft.distance} onChange={(event) => updateFilter("distance", event.target.value)}>
                    <option value="">Semua jarak</option>
                    {distances.map((distance) => <option key={distance} value={distance}>{distance}K</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="dialog-actions">
              <button className="button button--primary" type="submit">Terapkan Filter</button>
              <button className="button button--secondary" type="button" onClick={resetOrChooseRunning}>
                {wasReset && runningSport ? "Pilih Filter Lari" : "Reset"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
