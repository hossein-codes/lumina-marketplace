export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface-page)]">
      <nav className="bg-[var(--surface-card)] border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="container-page flex items-center justify-between">
          <h2 className="text-xl font-black text-brand-500">پنل فروشنده</h2>
          <span className="text-xs text-[var(--text-muted)]">فروشنده / ادمین</span>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
