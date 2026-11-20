"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button, buttonVariants } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Boutique" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground",
                pathname === link.href ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/orders"
              className={cn(
                "transition-colors hover:text-foreground",
                pathname === "/orders" ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              Mes commandes
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {user?.isAdmin && (
            <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <LayoutDashboard />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {user ? (
            <>
              <span className="hidden px-2 text-sm text-muted-foreground lg:inline">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout} aria-label="Se déconnecter">
                <LogOut />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </>
          ) : (
            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <User />
              <span className="hidden sm:inline">Connexion</span>
            </Link>
          )}

          <Link href="/cart" className={cn(buttonVariants({ size: "sm" }), "relative ml-1")}>
            <ShoppingBag />
            Panier
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
