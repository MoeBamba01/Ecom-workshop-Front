
// Cadre commun aux pages login et register
export default function AuthForm({ title, description, onSubmit, children }) {
  return (
    <div className="mx-auto w-full max-w-sm py-10">
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </div>
  );
}
