"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/admin/PageHeader";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import ErrorMessage from "@/components/ErrorMessage";
import { formatPrice } from "@/lib/format";

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null); // produit en cours de modification

  function loadProducts() {
    apiFetch("/products").then(setProducts).catch((err) => setError(err.message));
  }

  useEffect(loadProducts, []);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setDialogOpen(true);
  }

  async function handleSave(data) {
    if (editing) {
      await apiFetch(`/products/${editing._id}`, { method: "PUT", body: data, token: user.token });
      toast.success("Produit modifié");
    } else {
      await apiFetch("/products", { method: "POST", body: data, token: user.token });
      toast.success("Produit créé");
    }
    loadProducts();
  }

  async function handleDelete(product) {
    if (!confirm(`Supprimer « ${product.name} » ?`)) return;
    try {
      await apiFetch(`/products/${product._id}`, { method: "DELETE", token: user.token });
      toast.success("Produit supprimé");
      loadProducts();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const visible = (products || []).filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PageHeader title="Produits" description={products ? `${products.length} produits au catalogue` : " "}>
        <Button size="lg" onClick={openCreate}>
          <Plus />
          Nouveau produit
        </Button>
      </PageHeader>

      <div className="rounded-2xl bg-background p-4 sm:p-6">
        <div className="relative mb-4 max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" aria-label="Rechercher un produit" />
        </div>

        <ErrorMessage>{error}</ErrorMessage>

        {!products ? (
          <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="size-10 rounded-lg bg-muted object-cover" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-right">{formatPrice(p.price)}</TableCell>
                  <TableCell className="text-right">
                    <span className={p.stock === 0 ? "text-destructive" : p.stock <= 5 ? "text-amber-700" : ""}>{p.stock}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label={`Modifier ${p.name}`}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p)} aria-label={`Supprimer ${p.name}`}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editing} onSubmit={handleSave} />
    </>
  );
}
