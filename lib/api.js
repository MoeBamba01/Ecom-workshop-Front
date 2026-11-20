// Toutes les requêtes vers le back passent par ici
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  // Le back renvoie { message: "..." } en cas d'erreur
  if (!res.ok) throw new Error(data.message || "Erreur serveur");

  return data;
}
