import {
  Building2,
  CircleHelp,
  ClipboardList,
  Cookie,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  ListOrdered,
  Menu,
  MessageSquareQuote,
  PanelBottom,
  Quote,
  Search,
  Send,
  Settings2,
  Sparkles,
  Star,
  Store,
  Users,
  Wrench
} from "lucide";

import type { IconNode } from "@/lib/icons";

// Иконки разделов админки: одни и те же в сайдбаре и на дашборде.
export const routeIcons: Record<string, IconNode> = {
  "/admin": LayoutDashboard as IconNode,
  "/admin/header": Menu as IconNode,
  "/admin/hero": Sparkles as IconNode,
  "/admin/clients": Users as IconNode,
  "/admin/services": Wrench as IconNode,
  "/admin/portfolio": ImageIcon as IconNode,
  "/admin/why-us": Star as IconNode,
  "/admin/cta": Send as IconNode,
  "/admin/stages": ListOrdered as IconNode,
  "/admin/reviews": MessageSquareQuote as IconNode,
  "/admin/director": Quote as IconNode,
  "/admin/faq": CircleHelp as IconNode,
  "/admin/form": ClipboardList as IconNode,
  "/admin/contacts": Store as IconNode,
  "/admin/footer": PanelBottom as IconNode,
  "/admin/company": Building2 as IconNode,
  "/admin/seo": Search as IconNode,
  "/admin/privacy": FileText as IconNode,
  "/admin/misc": Cookie as IconNode,
  "/admin/settings": Settings2 as IconNode
};

export const fallbackIcon = Sparkles as IconNode;
