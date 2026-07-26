import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // In real app, check auth token and role from cookie/header
  // For demo, we allow access but guard should be implemented
  return (
    <div className="min-h-screen bg-[var(--surface-page)]">
      <nav className="bg-[var(--surface-card)] border-b border-[var(--border-subtle)] px-6 py-4">
        <div className="container-page flex items-center justify-between">
          <h2 className="text-xl font-black text-brand-500">پنل مدیریت</h2>
          <span className="text-xs text-[var(--text-muted)]">فقط ادمین</span>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
