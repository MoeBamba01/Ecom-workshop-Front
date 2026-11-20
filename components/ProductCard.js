"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const soldOut = product.stock === 0;

  function handleAdd(e) {
    e.preventDefault(); // ne pas suivre le lien de la carte
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  }

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {soldOut ? (
          <span className="absolute top-3 left-3 rounded-full bg-background px-2.5 py-1 text-xs font-medium">
            Rupture
          </span>
        ) : (
          <button
            onClick={handleAdd}
            aria-label={`Ajouter ${product.name} au panier`}
            className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-background shadow-sm transition hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
          >
            <Plus className="size-5" />
          </button>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium leading-snug">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>
        <p className="font-semibold whitespace-nowrap">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
