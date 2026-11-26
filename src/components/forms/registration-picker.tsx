"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { events, formatEventDate } from "@/data/events";

export function RegistrationPicker() {
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const search = query.trim().toLocaleLowerCase("id-ID");
  const openEvents = events.filter((event) => (
    event.status === "open" &&
    [event.title, event.category, event.city].some((value) =>
      value.toLocaleLowerCase("id-ID").includes(search),
    )
  ));

  function openPicker() {
    setQuery("");
    dialog.current?.showModal();
    searchInput.current?.focus();
  }

  function closePicker() {
    dialog.current?.close();
  }

  return (
    <>
      <button className="button button--primary" type="button" aria-haspopup="dialog" onClick={openPicker}>
        Daftar ke Event
      </button>
      <dialog className="overlay-dialog" aria-labelledby="registration-picker-heading" ref={dialog}>
        <div className="dialog-content stack">
          <div className="dialog-heading cluster">
            <h2 id="registration-picker-heading">Pilih Event</h2>
            <button className="button button--secondary dialog-close" type="button" onClick={closePicker}>
              <X aria-hidden="true" size={18} /> Tutup
            </button>
          </div>
          <p className="muted">Pilih event yang pendaftarannya masih dibuka.</p>
          <div className="field">
            <label htmlFor="registration-event-search">Cari event</label>
            <input
              id="registration-event-search"
              type="search"
              value={query}
              placeholder="Nama atau kata kunci"
              onChange={(event) => setQuery(event.currentTarget.value)}
              ref={searchInput}
            />
          </div>
          {openEvents.length === 0 ? (
            <p className="empty-state" role="status">
              Tidak ada event yang sesuai dan masih membuka pendaftaran.
            </p>
          ) : (
            <div className="stack">
              {openEvents.map((event) => (
                <article className="panel stack" key={event.slug}>
                  <h3>
                    <Link className="text-link" href={`/event/${event.slug}/daftar`} onClick={closePicker}>
                      {event.title}
                    </Link>
                  </h3>
                  <p className="muted">{event.category} · {formatEventDate(event.date)}</p>
                  <Link className="text-link" href={`/event/${event.slug}`} onClick={closePicker}>
                    Lihat Detail Event sebelum memilih
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
