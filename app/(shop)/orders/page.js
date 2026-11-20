"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/ErrorMessage";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { formatDate, formatPrice } from "@/lib/format";

export default function OrdersPage() {
  const { user, ready } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    apiFetch("/orders/mine", { token: user.token })
      .then(setOrders)
      .catch((err) => setError(err.message));
  }, [user]);

  if (ready && !user) {
    return (
      <div className="py-28 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Connecte-toi pour voir tes commandes</h1>
        <Link href="/login" className={`${buttonVariants({ size: "lg" })} mt-6`}>Connexion</Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h1 className="font-heading text-5xl font-bold tracking-tight">Mes commandes</h1>

      <div className="mt-10 space-y-4">
        <ErrorMessage>{error}</ErrorMessage>
        {!orders && !error && [1, 2].map((i) => <Skeleton key={i} className="h-36 rounded-3xl" />)}

        {orders?.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <Package className="mb-4 size-8 text-muted-foreground" />
            <p className="text-muted-foreground">Tu n&apos;as pas encore commandé.</p>
            <Link href="/shop" className={`${buttonVariants()} mt-4`}>Voir la boutique</Link>
          </div>
        )}

        {orders?.map((order) => (
          <article key={order._id} className="rounded-3xl border p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">Commande du {formatDate(order.createdAt)}</p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <ul className="mt-4 space-y-1 text-sm">
              {order.items.map((item) => (
                <li key={item._id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
