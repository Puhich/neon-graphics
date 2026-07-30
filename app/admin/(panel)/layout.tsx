import AdminShell from "@/components/admin/AdminShell";
import { ContentProvider } from "@/components/admin/ContentProvider";
import content from "@/lib/content";

// Опубликованная версия контента приходит с сервера, черновик живёт в
// браузере поверх неё.
export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider published={content}>
      <AdminShell>{children}</AdminShell>
    </ContentProvider>
  );
}
