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

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(user.isAdmin ? "/admin" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm title="Connexion" description="Retrouve ton panier et tes commandes." onSubmit={handleSubmit}>
      <ErrorMessage>{error}</ErrorMessage>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="h-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" type="password" className="h-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" size="lg" className="h-10 w-full" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Pas encore de compte ? <Link href="/register" className="font-medium text-foreground underline underline-offset-4">Inscription</Link>
      </p>
    </AuthForm>
  );
}
