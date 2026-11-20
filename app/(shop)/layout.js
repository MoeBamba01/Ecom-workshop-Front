import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function ShopLayout({ children }) {
  return (
    <>
      {/* Suspense obligatoire avec Next 16 : le header lit l'URL (usePathname) */}
      <Suspense fallback={<div className="h-16 border-b" />}>
        <SiteHeader />
      </Suspense>
      <main className="mx-auto max-w-7xl px-4 sm:px-6">{children}</main>
      <SiteFooter />
    </>
  );
}
