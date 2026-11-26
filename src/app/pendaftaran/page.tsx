import type { Metadata } from "next";
import { RegistrationHistory } from "@/components/forms/registration-history";

export const metadata: Metadata = { title: "Pendaftaran Saya" };

export default function RegistrationsPage() {
  return (
    <main className="container page-shell stack" id="main-content">
      <div className="page-heading">
        <h1>Pendaftaran Saya</h1>
      </div>
      <RegistrationHistory />
    </main>
  );
}
