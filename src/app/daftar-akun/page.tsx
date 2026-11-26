import type { Metadata } from "next";
import { AuthForm, type AuthPageProps } from "@/components/forms/auth-form";

export const metadata: Metadata = { title: "Daftar Akun" };

export default async function SignUpPage({ searchParams }: AuthPageProps) {
  const { next } = await searchParams;

  return <AuthForm mode="register" nextPath={next} />;
}
