import { ORDER_STATUS } from "@/lib/format";
import { cn } from "@/lib/utils";

const styles = {
  "en attente": "bg-amber-100 text-amber-800",
  payee: "bg-sky-100 text-sky-800",
  expediee: "bg-violet-100 text-violet-800",
  livree: "bg-emerald-100 text-emerald-800",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status] || "bg-muted")}>
      {ORDER_STATUS[status] || status}
    </span>
  );
}
