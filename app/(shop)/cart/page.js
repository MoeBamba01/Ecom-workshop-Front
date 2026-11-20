"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ErrorMessage";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, total, count } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleOrder() {
    setError("");
    if (!user) return router.push("/login");

    setLoading(true);
    try {
      await apiFetch("/orders", {
        method: "POST",
        token: user.token,
        body: {
          // On envoie seulement l'id et la quantité : le back recalcule le prix
          items: cart.map((item) => ({ product: item._id, quantity: item.quantity })),
          shippingAddress: address,
        },
      });
      clearCart();
      toast.success("Commande passée");
      router.push("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center py-28 text-center">
        <span className="mb-6 grid size-16 place-items-center rounded-full bg-muted">
          <ShoppingBag className="size-7" />
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Ton panier est vide</h1>
        <p className="mt-2 mb-6 text-muted-foreground">Ajoute un produit depuis la boutique pour commencer.</p>
        <Link href="/shop" className={buttonVariants({ size: "lg" })}>Voir la boutique</Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h1 className="font-heading text-5xl font-bold tracking-tight">Panier</h1>
      <p className="mt-2 text-muted-foreground">{count} article{count > 1 ? "s" : ""}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y border-y">
          {cart.map((item) => (
            <li key={item._id} className="flex gap-4 py-5">
              <img src={item.image} alt={item.name} className="size-24 shrink-0 rounded-xl bg-muted object-cover" />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <Link href={`/products/${item._id}`} className="font-medium hover:underline">{item.name}</Link>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border">
                    <Button variant="ghost" size="icon-sm" onClick={() => updateQuantity(item._id, item.quantity - 1)} aria-label="Moins">
                      <Minus />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button variant="ghost" size="icon-sm" onClick={() => updateQuantity(item._id, item.quantity + 1)} aria-label="Plus">
                      <Plus />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFromCart(item._id)}>
                    <Trash2 />
                    Retirer
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit space-y-5 rounded-3xl bg-muted p-6">
          <h2 className="font-heading text-xl font-semibold">Récapitulatif</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Sous-total</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span>Livraison</span><span>Offerte</span></div>
          </div>
          <div className="flex justify-between border-t border-foreground/10 pt-4 text-lg font-semibold">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse de livraison</Label>
            <Input id="address" className="h-10 bg-background" placeholder="12 rue de Dakar, 75011 Paris" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <ErrorMessage>{error}</ErrorMessage>
          <Button size="lg" className="h-11 w-full" onClick={handleOrder} disabled={(user && !address) || loading}>
            {!user ? "Se connecter pour commander" : loading ? "Envoi..." : "Commander"}
          </Button>
        </aside>
      </div>
    </div>
  );
}
