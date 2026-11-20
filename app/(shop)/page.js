"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Une image par catégorie, prise sur le premier produit trouvé
  const categories = [...new Set(products.map((p) => p.category))].map((name) => ({
    name,
    image: products.find((p) => p.category === name).image,
    count: products.filter((p) => p.category === name).length,
  }));

  const [big, small1, small2] = products.filter((p) => p.stock > 0);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-7">
          <h1 className="font-heading text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Des objets simples, bien faits, livrés vite.
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Vêtements, tech et maison : une petite sélection pensée pour durer. Ajoute au panier, on s&apos;occupe du reste.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className={buttonVariants({ size: "lg" })}>
              Voir la boutique
            </Link>
            {!user && (
              <Link href="/register" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Créer un compte
              </Link>
            )}
          </div>
        </div>

        {/* Mosaïque des produits en vedette */}
        <div className="grid h-[360px] grid-cols-2 grid-rows-2 gap-3 sm:h-[520px] sm:gap-4">
          {big ? (
            <>
              <HeroTile product={big} className="row-span-2" />
              <HeroTile product={small1} />
              <HeroTile product={small2} />
            </>
          ) : (
            <div className="col-span-2 row-span-2 animate-pulse rounded-3xl bg-muted" />
          )}
        </div>
      </section>

      {/* ---------- Avantages ---------- */}
      <section className="grid gap-6 border-y py-8 sm:grid-cols-3">
        <Perk icon={Truck} title="Livraison en 48 h" text="Partout en France métropolitaine." />
        <Perk icon={RotateCcw} title="30 jours pour changer d'avis" text="Retour simple depuis ton compte." />
        <Perk icon={ShieldCheck} title="Paiement sécurisé" text="Tes données restent chez nous." />
      </section>

      {/* ---------- Catégories ---------- */}
      {categories.length > 0 && (
        <section className="pt-20">
          <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight">Par catégorie</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                <img src={cat.image} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
                <div className="absolute bottom-0 p-4 text-white">
                  <p className="font-heading text-lg font-semibold">{cat.name}</p>
                  <p className="text-sm text-white/75">{cat.count} produits</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Nouveautés ---------- */}
      <section className="pt-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-heading text-3xl font-bold tracking-tight">Nouveautés</h2>
          <Link href="/shop" className="text-sm font-medium underline-offset-4 hover:underline">
            Tout voir
          </Link>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ---------- Bandeau compte ---------- */}
      {!user && (
        <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-3xl bg-accent px-8 py-10 md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight">Suis tes commandes en un coup d&apos;œil</h2>
            <p className="mt-2 text-accent-foreground/75">Un compte gratuit suffit pour commander et retrouver ton historique.</p>
          </div>
          <Link href="/register" className={buttonVariants({ size: "lg" })}>
            Créer mon compte
          </Link>
        </section>
      )}
    </>
  );
}

function HeroTile({ product, className }) {
  if (!product) return <div className={cn("rounded-3xl bg-muted", className)} />;
  return (
    <Link href={`/products/${product._id}`} className={cn("group relative overflow-hidden rounded-3xl bg-muted", className)}>
      <img src={product.image} alt={product.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <span className="absolute bottom-3 left-3 flex gap-2 rounded-full bg-background/95 px-3 py-1.5 text-sm shadow-sm">
        <span className="font-medium">{product.name}</span>
        <span className="text-muted-foreground">{formatPrice(product.price)}</span>
      </span>
    </Link>
  );
}

function Perk({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
