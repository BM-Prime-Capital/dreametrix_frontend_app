// components/ui/icons.tsx
import { LucideProps } from "lucide-react";
import dynamic from "next/dynamic";

export const Icons = {
  // Navigation
  home: dynamic(() => import("lucide-react").then((mod) => mod.Home)),
  chevronLeft: dynamic(() => import("lucide-react").then((mod) => mod.ChevronLeft)),
  chevronRight: dynamic(() => import("lucide-react").then((mod) => mod.ChevronRight)),
  arrowLeft: dynamic(() => import("lucide-react").then((mod) => mod.ArrowLeft)),
  
  // Polls related
  table: dynamic(() => import("lucide-react").then((mod) => mod.Table)),
  global: dynamic(() => import("lucide-react").then((mod) => mod.Globe)),
  users: dynamic(() => import("lucide-react").then((mod) => mod.Users)),
  barChart: dynamic(() => import("lucide-react").then((mod) => mod.BarChart)),
  filter: dynamic(() => import("lucide-react").then((mod) => mod.Filter)),
  plus: dynamic(() => import("lucide-react").then((mod) => mod.Plus)),
  poll: dynamic(() => import("lucide-react").then((mod) => mod.ListChecks)),
  survey: dynamic(() => import("lucide-react").then((mod) => mod.ClipboardList)),
  
  // Actions
  download: dynamic(() => import("lucide-react").then((mod) => mod.Download)),
  upload: dynamic(() => import("lucide-react").then((mod) => mod.Upload)),
  edit: dynamic(() => import("lucide-react").then((mod) => mod.Edit)),
  trash: dynamic(() => import("lucide-react").then((mod) => mod.Trash2)),
  settings: dynamic(() => import("lucide-react").then((mod) => mod.Settings)),
  refresh: dynamic(() => import("lucide-react").then((mod) => mod.RefreshCw)),
  externalLink: dynamic(() => import("lucide-react").then((mod) => mod.ExternalLink)),
  
  // Status
  check: dynamic(() => import("lucide-react").then((mod) => mod.Check)),
  x: dynamic(() => import("lucide-react").then((mod) => mod.X)),
  alert: dynamic(() => import("lucide-react").then((mod) => mod.AlertCircle)),
  info: dynamic(() => import("lucide-react").then((mod) => mod.Info)),
  spinner: dynamic(() => import("lucide-react").then((mod) => mod.Loader2)),
  
  // Files - Utilisation des icônes disponibles dans lucide-react
  fileText: dynamic(() => import("lucide-react").then((mod) => mod.FileText)),
  fileSpreadsheet: dynamic(() => import("lucide-react").then((mod) => mod.FileSpreadsheet)),
  // Remplacement de FilePdf par FileText avec une variation de style
  filePdf: dynamic(() => import("lucide-react").then((mod) => mod.FileText)), // Alternative
  
  // Data visualization
  pieChart: dynamic(() => import("lucide-react").then((mod) => mod.PieChart)),
  lineChart: dynamic(() => import("lucide-react").then((mod) => mod.LineChart)),
  barChart2: dynamic(() => import("lucide-react").then((mod) => mod.BarChart2)),
  
  // Date & Time
  calendar: dynamic(() => import("lucide-react").then((mod) => mod.Calendar)),
  clock: dynamic(() => import("lucide-react").then((mod) => mod.Clock)),
  
  // Communication
  mail: dynamic(() => import("lucide-react").then((mod) => mod.Mail)),
  message: dynamic(() => import("lucide-react").then((mod) => mod.MessageSquare)),
  send: dynamic(() => import("lucide-react").then((mod) => mod.Send)),
  
  // Custom icons (combinations or special cases)
  export: dynamic(() => import("lucide-react").then((mod) => mod.DownloadCloud)),
  import: dynamic(() => import("lucide-react").then((mod) => mod.UploadCloud)),
  analytics: dynamic(() => import("lucide-react").then((mod) => mod.LineChart)), // Alternative
  
  // Loading spinner
  loader: dynamic(() => import("lucide-react").then((mod) => mod.Loader2)),
} satisfies Record<string, React.ComponentType<LucideProps>>;

export type IconName = keyof typeof Icons;