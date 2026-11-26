import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/auth-form";

export const metadata: Metadata = { title: "Daftar Akun" };

export default function SignUpPage() {
  return <AuthForm mode="register" />;
}
