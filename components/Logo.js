import Link from "next/link";

export default function Logo({ href = "/", light = false }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight">
      <span className="grid size-7 place-items-center rounded-full bg-accent text-sm text-accent-foreground">m</span>
      <span className={light ? "text-white" : "text-foreground"}>MiniShop</span>
    </Link>
  );
}
