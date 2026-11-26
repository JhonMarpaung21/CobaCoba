import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/auth-form";

export const metadata: Metadata = { title: "Lupa Kata Sandi" };

export default function PasswordRecoveryPage() {
  return <AuthForm mode="recovery" />;
}
