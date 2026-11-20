"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/admin/PageHeader";
import ErrorMessage from "@/components/ErrorMessage";
import { ORDER_STATUS, formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const FILTERS = ["toutes", ...Object.keys(ORDER_STATUS)];

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("toutes");

  useEffect(() => {
    apiFetch("/orders", { token: user.token })
      .then(setOrders)
      .catch((err) => setError(err.message));
  }, [user.token]);

  async function changeStatus(order, status) {
    try {
      const updated = await apiFetch(`/orders/${order._id}/status`, {
        method: "PUT",
        body: { status },
        token: user.token,
      });
      // On remplace la commande modifiée sans tout recharger (on garde user déjà "populé")
      setOrders(orders.map((o) => (o._id === order._id ? { ...o, status: updated.status } : o)));
      toast.success(`Statut : ${ORDER_STATUS[status]}`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const visible = (orders || []).filter((o) => filter === "toutes" || o.status === filter);

  return (
    <>
      <PageHeader title="Commandes" description={orders ? `${orders.length} commandes au total` : " "} />

      <div className="rounded-2xl bg-background p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                filter === f ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              {f === "toutes" ? "Toutes" : ORDER_STATUS[f]}
            </button>
          ))}
        </div>

        <ErrorMessage>{error}</ErrorMessage>

        {!orders ? (
          <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : visible.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Aucune commande dans cette catégorie.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((o) => (
                <TableRow key={o._id}>
                  <TableCell>
                    <p className="font-medium">{o.user?.name || "Compte supprimé"}</p>
                    <p className="text-xs text-muted-foreground">{o.user?.email}</p>
                  </TableCell>
                  <TableCell>{formatDate(o.createdAt)}</TableCell>
                  <TableCell className="max-w-56 truncate text-muted-foreground" title={o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}>
                    {o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatPrice(o.totalPrice)}</TableCell>
                  <TableCell>
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o, e.target.value)}
                      className="h-8 rounded-lg border bg-background px-2 text-sm"
                      aria-label="Changer le statut"
                    >
                      {Object.entries(ORDER_STATUS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
