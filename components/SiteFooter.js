import Link from "next/link";
import Logo from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo light />
          <p className="max-w-xs text-sm">
            Boutique de démonstration construite pendant le workshop MERN : Node, Express, MongoDB et Next.js.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium text-white">Boutique</p>
          <Link href="/shop" className="block hover:text-white">Tous les produits</Link>
          <Link href="/cart" className="block hover:text-white">Panier</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium text-white">Compte</p>
          <Link href="/login" className="block hover:text-white">Connexion</Link>
          <Link href="/orders" className="block hover:text-white">Mes commandes</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © 2026 MiniShop, projet pédagogique
      </div>
    </footer>
  );
}
