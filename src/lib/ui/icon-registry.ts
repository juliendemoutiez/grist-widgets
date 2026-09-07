import {
  AlignLeft, Archive, ArrowDownAZ, ArrowLeft, ArrowRight, ArrowUpDown, Bold, Briefcase,
  Building2, CalendarCheck, CalendarDays, CalendarRange, Check, ChevronDown, ChevronLeft,
  ChevronRight, Circle, CircleCheck, Clock, Code, Ellipsis, FileText, Flag, FolderOpen,
  GripVertical, IdCard, Inbox, Italic, Link, List, ListChecks, ListFilter, ListOrdered, Mail,
  Menu, MessageSquare, MessagesSquare, Minus, Pencil, Plus, Quote, RefreshCw, Search, Send,
  Settings, Shapes, SquarePen, Strikethrough, Tag, Tags, Trash2, User, Users, X, Zap,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

type IconComponent = ComponentType<LucideProps>;

/**
 * Noms d'icônes → composants Lucide.
 *
 * Les clés reprennent les ligatures Material utilisées jusqu'ici : les noms
 * d'icônes sont aussi de la donnée (options de widget stockées dans Grist,
 * `instances/*.json`), donc les configs existantes continuent de fonctionner.
 * Les noms Lucide en kebab-case sont acceptés en plus, pour les configs neuves.
 */
const ICONS: Record<string, IconComponent> = {
  add:                  Plus,
  arrow_back:           ArrowLeft,
  arrow_forward:        ArrowRight,
  badge:                IdCard,
  bolt:                 Zap,
  calendar_today:       CalendarDays,
  calendar_view_week:   CalendarRange,
  category:             Shapes,
  chat:                 MessageSquare,
  check:                Check,
  check_circle:         CircleCheck,
  checklist:            ListChecks,
  chevron_left:         ChevronLeft,
  chevron_right:        ChevronRight,
  close:                X,
  code:                 Code,
  delete:               Trash2,
  description:          FileText,
  domain:               Building2,
  drag_indicator:       GripVertical,
  edit:                 Pencil,
  edit_note:            SquarePen,
  expand_more:          ChevronDown,
  filter_list:          ListFilter,
  flag:                 Flag,
  folder_open:          FolderOpen,
  format_bold:          Bold,
  format_italic:        Italic,
  format_list_bulleted: List,
  format_list_numbered: ListOrdered,
  format_quote:         Quote,
  format_strikethrough: Strikethrough,
  forum:                MessagesSquare,
  group:                Users,
  horizontal_rule:      Minus,
  inbox:                Inbox,
  inventory_2:          Archive,
  label:                Tag,
  link:                 Link,
  mail:                 Mail,
  menu:                 Menu,
  more_horiz:           Ellipsis,
  person:               User,
  schedule:             Clock,
  search:               Search,
  sell:                 Tags,
  send:                 Send,
  settings:             Settings,
  sort_by_alpha:        ArrowDownAZ,
  subject:              AlignLeft,
  swap_vert:            ArrowUpDown,
  sync:                 RefreshCw,
  today:                CalendarCheck,
  work:                 Briefcase,
};

/** Alias kebab-case (noms Lucide) vers les mêmes composants. */
const ALIASES: Record<string, IconComponent> = Object.fromEntries(
  Object.entries(ICONS).map(([name, C]) => [name.replace(/_/g, '-'), C]),
);

const warned = new Set<string>();

export function resolveIcon(name: string): IconComponent {
  const found = ICONS[name] ?? ALIASES[name];
  if (found) return found;
  if (import.meta.env.DEV && !warned.has(name)) {
    warned.add(name);
    console.warn(`[Icon] nom inconnu : "${name}" — ajoutez-le à ICONS dans src/lib/ui/Icon.tsx`);
  }
  return Circle;
}
