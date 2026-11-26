import Link from "next/link";
import { SessionEntry } from "@/components/layout/session-entry";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export default function StartPage() {
  return (
    <main id="main-content" className="container launch-layout">
      <SessionEntry />
      <div className="launch-content">
        <ImagePlaceholder className="launch-content__placeholder" label="Placeholder logo SportID" />
        <h1>SportID</h1>
        <p className="launch-status" role="status">Memeriksa sesi…</p>
        <p className="muted">Platform Olahraga Indonesia</p>
        <Link className="text-link" href="/masuk">Masuk ke SportID</Link>
      </div>
    </main>
  );
}
