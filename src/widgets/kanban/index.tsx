import './index.scss';
import { useGrist } from '@lib';
import { KanbanBoard } from './KanbanBoard/KanbanBoard';
import { KanbanSettings } from './KanbanSettings/KanbanSettings';
import type { KanbanConfig } from './types';

export function KanbanWidget() {
  const { widgetOptions, isConfiguringWidget, setIsConfiguringWidget } = useGrist();
  const config = widgetOptions as KanbanConfig | null;

  if (isConfiguringWidget || !config?.statuses?.length || !config?.columns?.status) {
    return <KanbanSettings onDone={() => setIsConfiguringWidget(false)} />;
  }

  return (
    <div className="kanban-layout">
      <KanbanBoard statuses={config.statuses} columns={config.columns} />
    </div>
  );
}
