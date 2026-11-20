"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthForm from "@/components/AuthForm";
import ErrorMessage from "@/components/ErrorMessage";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm title="Créer un compte" description="Gratuit, et tu suis tes commandes depuis ton espace." onSubmit={handleSubmit}>
      <ErrorMessage>{error}</ErrorMessage>
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" className="h-10" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="h-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" type="password" className="h-10" placeholder="6 caractères minimum" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" size="lg" className="h-10 w-full" disabled={loading}>
        {loading ? "Création..." : "Créer mon compte"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Déjà inscrit ? <Link href="/login" className="font-medium text-foreground underline underline-offset-4">Connexion</Link>
      </p>
    </AuthForm>
  );
}
