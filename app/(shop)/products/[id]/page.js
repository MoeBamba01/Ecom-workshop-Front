"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/ErrorMessage";
import { formatPrice } from "@/lib/format";

export default function ProductPage({ params }) {
  const { id } = use(params); // l'id dans l'URL /products/123
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    apiFetch(`/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err.message));
  }, [id]);

  function handleAdd() {
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} ajouté au panier`);
  }

  if (error) return <div className="py-12"><ErrorMessage>{error}</ErrorMessage></div>;
  if (!product) return <ProductSkeleton />;

  const soldOut = product.stock === 0;

  return (
    <div className="py-10">
      <Link href="/shop" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Boutique
      </Link>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center gap-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="font-heading text-4xl font-bold tracking-tight lg:text-5xl">{product.name}</h1>
            <p className="text-3xl font-semibold">{formatPrice(product.price)}</p>
          </div>

          <p className="max-w-prose text-lg text-muted-foreground">{product.description}</p>

          <p className="text-sm">
            {soldOut ? (
              <span className="text-destructive">Rupture de stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-700">Plus que {product.stock} en stock</span>
            ) : (
              <span className="text-emerald-700">En stock</span>
            )}
          </p>

          {!soldOut && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-lg border">
                <Button variant="ghost" size="icon-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Moins">
                  <Minus />
                </Button>
                <span className="w-10 text-center font-medium" aria-live="polite">{quantity}</span>
                <Button variant="ghost" size="icon-lg" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} aria-label="Plus">
                  <Plus />
                </Button>
              </div>
              <Button size="lg" className="h-9 px-6" onClick={handleAdd}>
                <ShoppingBag />
                Ajouter au panier
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-2xl bg-muted p-4 text-sm">
            <Truck className="size-5 shrink-0" />
            Livraison en 48 h, retours gratuits pendant 30 jours.
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid gap-10 py-20 md:grid-cols-2 lg:gap-16">
      <Skeleton className="aspect-square w-full rounded-3xl" />
      <div className="space-y-4 pt-10">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
