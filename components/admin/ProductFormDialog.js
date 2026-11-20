"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/ErrorMessage";

const empty = { name: "", description: "", price: "", category: "", stock: "", image: "" };

// product = null → création ; product = {...} → modification
export default function ProductFormDialog({ open, onOpenChange, product, onSubmit }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(product ? { ...empty, ...product } : empty);
    setError("");
  }, [product, open]);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        name: form.name,
        description: form.description,
        category: form.category || "Divers",
        price: Number(form.price), // les inputs renvoient du texte
        stock: Number(form.stock),
        ...(form.image ? { image: form.image } : {}),
      });
      onOpenChange(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ErrorMessage>{error}</ErrorMessage>
          <div className="space-y-2">
            <Label htmlFor="p-name">Nom</Label>
            <Input id="p-name" value={form.name} onChange={update("name")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea id="p-desc" rows={3} value={form.description} onChange={update("description")} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="p-price">Prix (€)</Label>
              <Input id="p-price" type="number" step="0.01" min="0" value={form.price} onChange={update("price")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-stock">Stock</Label>
              <Input id="p-stock" type="number" min="0" value={form.stock} onChange={update("stock")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-cat">Catégorie</Label>
              <Input id="p-cat" value={form.category} onChange={update("category")} placeholder="Tech" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-img">URL de l&apos;image</Label>
            <Input id="p-img" type="url" value={form.image} onChange={update("image")} placeholder="https://..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : product ? "Enregistrer" : "Créer le produit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
