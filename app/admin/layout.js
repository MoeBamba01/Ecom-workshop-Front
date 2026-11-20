"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Protège tout /admin : il faut être connecté ET admin.
// (Le back vérifie aussi avec protect + admin : le front ne fait que cacher l'interface.)
export default function AdminLayout({ children }) {
  const { user, ready } = useAuth();

  if (!ready) return null;

  if (!user?.isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Espace réservé aux admins</h1>
          <p className="mt-2 text-muted-foreground">Connecte-toi avec un compte administrateur pour continuer.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login" className={buttonVariants({ size: "lg" })}>Connexion</Link>
            <Link href="/" className={buttonVariants({ size: "lg", variant: "outline" })}>Retour à la boutique</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted md:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
