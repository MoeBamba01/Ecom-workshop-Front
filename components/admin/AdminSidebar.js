"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Store, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex shrink-0 flex-col bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:w-64">
      <div className="flex items-center justify-between px-5 py-5">
        <Logo href="/admin" light />
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors",
              pathname === href
                ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="hidden space-y-1 border-t border-sidebar-border p-3 md:block">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent">
          <Store className="size-4" />
          Voir la boutique
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent">
          <LogOut className="size-4" />
          Déconnexion
        </button>
        <p className="truncate px-3 pt-2 text-xs text-sidebar-foreground/60">{user?.email}</p>
      </div>
    </aside>
  );
}
