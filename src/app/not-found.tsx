import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="container page-shell">
      <section className="panel empty-state stack">
        <h1>Halaman tidak ditemukan</h1>
        <p className="muted">Periksa alamat atau kembali ke Beranda SportID.</p>
        <Link href="/beranda" className="button button--primary">Ke Beranda</Link>
      </section>
    </main>
  );
}
