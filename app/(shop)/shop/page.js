"use client";

import { use, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import { cn } from "@/lib/utils";

export default function ShopPage({ searchParams }) {
  const params = use(searchParams); // ?category=Tech depuis la page d'accueil
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(params.category || "Tout");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    apiFetch("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Tout", ...new Set(products.map((p) => p.category))];

  // Filtres faits côté front : simple et suffisant pour une petite boutique
  const visible = products
    .filter((p) => category === "Tout" || p.category === category)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0; // "recent" : ordre renvoyé par le back
    });

  return (
    <div className="py-12">
      <h1 className="font-heading text-5xl font-bold tracking-tight">Boutique</h1>
      <p className="mt-2 text-muted-foreground">{visible.length} produits</p>

      <div className="mt-8 flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                category === cat ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative w-full lg:w-64">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
              aria-label="Rechercher un produit"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-8 rounded-lg border bg-background px-2 text-sm"
            aria-label="Trier"
          >
            <option value="recent">Plus récents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading ? (
          <ProductGridSkeleton />
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Aucun produit ne correspond. Essaie une autre catégorie.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
