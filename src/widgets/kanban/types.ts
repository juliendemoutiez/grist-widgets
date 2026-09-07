export interface KanbanBadge {
  key: string;
  /** Icon name from the shared registry (src/lib/ui/icon-registry.ts). */
  icon: string;
}

export interface KanbanColumns {
  status: string;
  title: string;
  subtitle?: string;
  badges?: KanbanBadge[];
  dueDate?: string;
  assignee?: string;
}

export interface KanbanConfig {
  statuses: string[];
  columns: KanbanColumns;
}
