// 19.9 → "19,90 €"
export function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

// Statuts du modèle Order (back) → texte affiché
export const ORDER_STATUS = {
  "en attente": "En attente",
  payee: "Payée",
  expediee: "Expédiée",
  livree: "Livrée",
};
