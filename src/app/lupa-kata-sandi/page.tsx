import type { Metadata } from "next";
import { AuthForm, type AuthPageProps } from "@/components/forms/auth-form";

export const metadata: Metadata = { title: "Lupa Kata Sandi" };

export default async function PasswordRecoveryPage({ searchParams }: AuthPageProps) {
  const { next } = await searchParams;

  return <AuthForm mode="recovery" nextPath={next} />;
}
