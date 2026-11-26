import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RegistrationReceipt } from "@/components/forms/registration-receipt";

export const metadata: Metadata = { title: "Bukti Pendaftaran" };

export default async function RegistrationReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="container page-shell stack" id="main-content">
      <div className="page-heading">
        <Link className="text-link cluster" href="/pendaftaran">
          <ChevronLeft aria-hidden="true" size={18} /> Kembali
        </Link>
        <h1>Bukti Pendaftaran</h1>
      </div>
      <RegistrationReceipt id={id} />
    </main>
  );
}
