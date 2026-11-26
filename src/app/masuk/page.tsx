import type { Metadata } from "next";
import { AuthForm, type AuthPageProps } from "@/components/forms/auth-form";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }: AuthPageProps) {
  const { next } = await searchParams;

  return <AuthForm mode="login" nextPath={next} />;
}
