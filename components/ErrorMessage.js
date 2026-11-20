export default function ErrorMessage({ children }) {
  if (!children) return null;
  return (
    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {children}
    </p>
  );
}
