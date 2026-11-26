"use client";

import { CalendarCheck, House, Megaphone, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const destinations = [
  { href: "/beranda", label: "Beranda", icon: House },
  { href: "/cari-event", label: "Cari Event", icon: Search },
  { href: "/pembaruan", label: "Pembaruan", icon: Megaphone },
  { href: "/pendaftaran", label: "Pendaftaran", icon: CalendarCheck },
];

export function SiteHeader() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const standalone = pathname === "/" || pathname === "/masuk" ||
    pathname === "/daftar-akun" || pathname === "/lupa-kata-sandi";
  const inRegistrationForm = pathname.endsWith("/daftar") || pathname.endsWith("/bukti");
  const activeDestination = inRegistrationForm
    ? "/pendaftaran"
    : pathname.startsWith("/event/") ? "/cari-event" : pathname;

  return (
    <header className={`site-header${standalone ? " site-header--standalone" : ""}`}>
      <div className="container site-header__inner">
        <Link href={standalone ? "/" : "/beranda"} className="wordmark">
          SportID
        </Link>
        {!standalone && (
          <nav
            className={`main-nav${inRegistrationForm ? " main-nav--detail" : ""}`}
            aria-label="Navigasi utama"
          >
            {destinations.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={activeDestination === href ? "page" : undefined}
              >
                <Icon size={21} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
