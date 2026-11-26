import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: { default: "SportID", template: "%s · SportID" },
  description: "Temukan event olahraga, baca informasi penyelenggaraan, dan kelola pendaftaran di SportID.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#main-content">Langsung ke konten</a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
