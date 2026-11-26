# SportID Web

SportID mengadaptasi alur aplikasi mobile untuk menemukan event olahraga, memeriksa informasi penyelenggara, membaca pembaruan, dan mencoba pendaftaran. Struktur informasi, navigasi, dan komponen mengikuti [Wireframe SportID](https://www.figma.com/design/SRUPMcHEI0CTAEMOQWFs2B/SportID?node-id=2-362) dan [UI Foundation](https://www.figma.com/design/SRUPMcHEI0CTAEMOQWFs2B/SportID?node-id=2-363).

## Menjalankan proyek

Gunakan Node.js 20.9 atau versi yang lebih baru dan npm.

```sh
npm ci
npm run dev
```

Buka `http://localhost:3000` pada mesin yang menjalankan proyek. Mode pengembangan menggunakan Next.js App Router.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

Jalankan `npm run start` setelah build selesai untuk membuka versi produksi secara lokal. Proyek demo berjalan tanpa variabel lingkungan.

## GitHub Pages

Demo menggunakan GitHub Pages dengan sumber root branch `main`. Hasil ekspor statis disimpan di root repositori agar GitHub Pages dapat menyajikan halaman dan aset Next.js secara langsung. [Buka demo SportID](https://jhonmarpaung21.github.io/CobaCoba/)

```sh
SPORTID_PAGES_BASE_PATH=/CobaCoba npm run build
```

Perintah ini menghasilkan build statis di `out/`. Saat memperbarui demo, sertakan hasil ekspor terbaru beserta `.nojekyll` dalam perubahan branch `main`.

## Struktur kode

| Direktori | Isi |
| --- | --- |
| `src/app` | Rute App Router, layout, metadata, dan halaman 404 |
| `src/components/layout` | Header, navigasi, dan pemeriksaan sesi saat masuk |
| `src/components/events` | Kartu event, pencarian dan filter, serta pengumuman |
| `src/components/forms` | Autentikasi demo, pemilih event, formulir, riwayat, dan bukti |
| `src/components/ui` | Elemen visual yang dipakai ulang, termasuk placeholder gambar |
| `src/data` | Data contoh event dan pengumuman |
| `src/lib` | Validasi dan penyimpanan demo |
| `src/styles` | CSS variables, gaya global, dan aturan responsif |
| `src/types` | Model data TypeScript |

Proyek memakai Next.js, React, TypeScript, Tailwind CSS, dan Lucide React. Prinsip KISS dan DRY diterapkan dengan satu sumber data event, satu set token, dan komponen bersama untuk UI yang berulang. Logika formulir, filter, dan penyimpanan demo ditempatkan pada modul yang menggunakannya.

## Adaptasi desain

| Frame Figma | Representasi web |
| --- | --- |
| SCR-01 | `/` untuk memeriksa sesi dan mengarahkan pengguna ke Masuk atau Beranda |
| SCR-02, SCR-02-P, SCR-02-H | `/masuk` dengan konteks masuk umum, pendaftaran event, atau Pendaftaran Saya |
| SCR-03, SCR-03-P, SCR-03-H | `/daftar-akun` dengan tujuan pengguna yang dipertahankan |
| SCR-04, SCR-04-S | `/lupa-kata-sandi` dengan form email, konfirmasi simulasi, dan permintaan ulang |
| SCR-05 | `/beranda` dengan akses pencarian, event mendatang, pembaruan, dan Pendaftaran Saya |
| SCR-06, SCR-06-F, SCR-06-E | `/cari-event` dengan daftar awal, hasil, dan keadaan kosong |
| SCR-07, SCR-07-R | Panel filter di `/cari-event`, termasuk terapkan dan reset |
| SCR-08 | `/event/[slug]` dengan informasi, jadwal, syarat, pengumuman, dan CTA pendaftaran |
| SCR-09, SCR-09-E | `/pembaruan` dengan daftar dan pengumuman yang dapat dibuka |
| SCR-10, SCR-10-E | `/pendaftaran` dengan riwayat pengiriman atau keadaan kosong |
| SCR-11 | Panel Pilih Event di `/pendaftaran` untuk mencari event yang membuka pendaftaran |
| SCR-12, SCR-12-E, SCR-12-F | `/event/[slug]/daftar` dengan form, validasi, dan pemulihan dari kegagalan pengiriman |
| SCR-13 | `/pendaftaran/bukti?id=…` untuk melihat pengiriman demo dari sesi yang sama |

Empat tujuan utama adalah Beranda, Cari Event, Pembaruan, dan Pendaftaran. Dalam viewport di bawah 768 px, tab utama berada di bawah dan panel filter serta pemilih event dibuka dari bawah. Mulai 768 px, navigasi berpindah ke header dan grid hasil memakai dua kolom. Mulai 1024 px, grid hasil memakai tiga kolom dan CTA detail event memakai kolom pendamping.

Tipografi memakai Plus Jakarta Sans. Palet utama terdiri dari putih `#FFFFFF`, navy `#173B73`, dan oranye `#FF851B`. Label navy pada CTA oranye meningkatkan kontras dari 2,44:1 pada spesimen Figma menjadi 4,52:1. Kartu mengikuti komponen `Card/Event` di UI Foundation, dengan placeholder gambar abu-abu dan data dari wireframe. Spacing dan radius dipusatkan di `src/styles/tokens.css`.

## Data demo dan kebutuhan integrasi

| Bagian | Perilaku demo dan integrasi yang dibutuhkan |
| --- | --- |
| Event, pencarian, dan pembaruan | Pencarian dan filter berjalan pada fixture lokal. Detail Medan Fun Cycling yang belum ditetapkan di wireframe, seperti biaya, lokasi, dan syarat, diisi sebagai contoh. Integrasi produksi memerlukan data event dan pengumuman aktual. |
| Akun dan pemulihan | Masuk dan daftar membuat sesi simulasi di tab saat ini. Permintaan dan kirim ulang tautan pemulihan hanya disimulasikan. Akun, autentikasi, dan pengiriman email sungguhan memerlukan backend. |
| Pendaftaran, riwayat, dan bukti | Form divalidasi di browser. Hasil berhasil mendapat ID demo dan tersimpan di tab. Pendaftaran sungguhan, riwayat lintas perangkat, dan konfirmasi keikutsertaan memerlukan backend. |
| Sumber resmi dan kontak | Tujuan Buka Sumber Resmi, Hubungi Penyelenggara, dan Hubungi Tim SportID masih menunggu URL atau kontak resmi. Aksi ditandai belum tersedia. |

Sesi dan catatan pendaftaran memakai `sessionStorage`, yang bertahan saat halaman dimuat ulang di tab yang sama. Tab independen atau perangkat lain memiliki penyimpanan masing-masing. Penutupan tab umumnya mengakhiri sesi. Gunakan identitas, nomor telepon, dan kata sandi contoh. Kata sandi tidak disimpan. Data demo tidak dikirim ke server dan tidak menghasilkan email, pendaftaran sungguhan, atau pembayaran.

## Pemeriksaan

| Pemeriksaan | Status |
| --- | --- |
| ESLint · `npm run lint` | Lulus |
| TypeScript · `npm run typecheck` | Lulus |
| Build produksi · `npm run build` | Lulus |
| Alur utama · Chromium | Lulus untuk akses tamu, pencarian, filter dan reset, detail, akun dan pemulihan demo, validasi form, kirim ulang, bukti, riwayat, dan pembaruan |
| Layout · Chromium | 8 rute lulus pada 320, 375, 767, 768, 1023, 1024, dan 1440 px. Navigasi berpindah pada breakpoint 768 px dan halaman yang diperiksa bebas overflow horizontal. |
| Aksesibilitas · Chromium | Navigasi keyboard dan fokus panel diuji. Pemindaian axe-core WCAG A/AA pada 6 rute tidak melaporkan pelanggaran. |

Pratinjau terkelola gagal membuka relay. Uji browser dilakukan terhadap build produksi secara lokal. Firefox gagal menyiapkan profil uji dan WebKit memerlukan pustaka sistem tambahan, sehingga hasil browser di atas mencakup Chromium.
