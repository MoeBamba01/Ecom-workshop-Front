"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Euro, ShoppingCart, Package, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/admin/PageHeader";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import ErrorMessage from "@/components/ErrorMessage";
import { formatDate, formatPrice } from "@/lib/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Deux appels en parallèle : commandes (route admin) + produits (route publique)
    Promise.all([apiFetch("/orders", { token: user.token }), apiFetch("/products")])
      .then(([o, p]) => {
        setOrders(o);
        setProducts(p);
      })
      .catch((err) => setError(err.message));
  }, [user.token]);

  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!orders || !products) return <DashboardSkeleton />;

  const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const lowStock = products.filter((p) => p.stock <= 5);
  const days = lastSevenDays(orders);
  const maxDay = Math.max(...days.map((d) => d.total), 1);

  return (
    <>
      <PageHeader title={`Bonjour ${user.name}`} description="Voici l'activité de la boutique." />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat icon={Euro} label="Chiffre d'affaires" value={formatPrice(revenue)} />
        <Stat icon={ShoppingCart} label="Commandes" value={orders.length} />
        <Stat icon={Package} label="Produits" value={products.length} />
        <Stat icon={AlertTriangle} label="Stock faible (≤ 5)" value={lowStock.length} warn={lowStock.length > 0} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Graphique en barres CSS : ventes des 7 derniers jours */}
        <section className="rounded-2xl bg-background p-6">
          <h2 className="font-heading text-lg font-semibold">Ventes des 7 derniers jours</h2>
          <p className="text-sm text-muted-foreground">{formatPrice(days.reduce((s, d) => s + d.total, 0))} au total</p>
          <div className="mt-6 flex h-48 items-end gap-3">
            {days.map((day) => (
              <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs text-muted-foreground">{day.total > 0 ? Math.round(day.total) + " €" : ""}</span>
                <div
                  className="w-full rounded-t-md bg-primary"
                  style={{ height: `${Math.max((day.total / maxDay) * 100, 2)}%`, opacity: day.total ? 1 : 0.15 }}
                  title={formatPrice(day.total)}
                />
                <span className="text-xs text-muted-foreground">{day.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-background p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Stock faible</h2>
            <Link href="/admin/products" className="text-sm underline-offset-4 hover:underline">Gérer</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Tous les produits ont plus de 5 unités en stock.</p>
          ) : (
            <ul className="mt-4 divide-y">
              {lowStock.map((p) => (
                <li key={p._id} className="flex items-center gap-3 py-2.5">
                  <img src={p.image} alt="" className="size-10 rounded-lg object-cover" />
                  <span className="flex-1 text-sm font-medium">{p.name}</span>
                  <span className={p.stock === 0 ? "text-sm text-destructive" : "text-sm text-amber-700"}>
                    {p.stock === 0 ? "Rupture" : `${p.stock} restants`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Dernières commandes</h2>
          <Link href="/admin/orders" className="text-sm underline-offset-4 hover:underline">Tout voir</Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune commande pour l&apos;instant.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((o) => (
                <TableRow key={o._id}>
                  <TableCell className="font-medium">{o.user?.name || "Compte supprimé"}</TableCell>
                  <TableCell>{formatDate(o.createdAt)}</TableCell>
                  <TableCell><OrderStatusBadge status={o.status} /></TableCell>
                  <TableCell className="text-right">{formatPrice(o.totalPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </>
  );
}

function Stat({ icon: Icon, label, value, warn }) {
  return (
    <div className="rounded-2xl bg-background p-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        {label}
        <Icon className={warn ? "size-4 text-amber-600" : "size-4"} />
      </div>
      <p className="mt-3 font-heading text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

// Regroupe le total des commandes par jour sur les 7 derniers jours
function lastSevenDays(orders) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = date.toDateString();
    const total = orders
      .filter((o) => new Date(o.createdAt).toDateString() === key)
      .reduce((sum, o) => sum + o.totalPrice, 0);
    return { key, total, label: date.toLocaleDateString("fr-FR", { weekday: "short" }) };
  });
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}
