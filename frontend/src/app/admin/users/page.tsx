'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/lib/api/services';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/format';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: async () => (await adminService.listUsers({ search, limit: 50 })).data ?? [],
  });

  const mut = useMutation({
    mutationFn: ({ id, isActive, role }: { id: string; isActive?: boolean; role?: string }) =>
      adminService.updateUser(id, { isActive, role }),
    onSuccess: () => {
      toast.success('کاربر به‌روزرسانی شد');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-black">مدیریت کاربران</h1>
        <div className="mr-auto max-w-xs w-full">
          <Input placeholder="جست‌وجو..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-muted)] text-[var(--text-muted)] text-xs">
            <tr>
              <th className="text-right p-3">نام</th>
              <th className="text-right p-3">ایمیل</th>
              <th className="text-right p-3">نقش</th>
              <th className="text-right p-3">وضعیت</th>
              <th className="text-right p-3">عضویت</th>
              <th className="text-right p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-[var(--text-muted)]">در حال بارگذاری...</td>
              </tr>
            ) : (data ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-[var(--text-muted)]">کاربری یافت نشد</td>
              </tr>
            ) : (
              data!.map((u) => (
                <tr key={u.id} className="border-t border-[var(--border-subtle)]">
                  <td className="p-3">{u.firstName} {u.lastName}</td>
                  <td className="p-3 text-xs">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => mut.mutate({ id: u.id, role: e.target.value })}
                      className="h-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] px-2 text-xs"
                    >
                      <option value="CUSTOMER">مشتری</option>
                      <option value="SELLER">فروشنده</option>
                      <option value="ADMIN">مدیر</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {u.isActive ? <Badge variant="success">فعال</Badge> : <Badge variant="danger">غیرفعال</Badge>}
                  </td>
                  <td className="p-3 text-xs">{formatDate(u.createdAt)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => mut.mutate({ id: u.id, isActive: !u.isActive })}
                      className="text-xs text-[var(--color-brand-600)] font-bold"
                    >
                      {u.isActive ? 'غیرفعال کن' : 'فعال کن'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
