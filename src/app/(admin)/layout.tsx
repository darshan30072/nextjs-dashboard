import { ReactNode } from 'react';
import ClientAdminLayout from '@/components/layout/ClientAdminLayout'; 

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <ClientAdminLayout>{children}</ClientAdminLayout>;
}
