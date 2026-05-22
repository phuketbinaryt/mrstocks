import { requireAdmin } from '@/lib/admin/guard';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Admin — MR/STOCKS' };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin('/admin');
  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />
      <main className="flex-1 px-4 md:px-8 py-6 min-w-0">{children}</main>
    </div>
  );
}
