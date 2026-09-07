import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/reset.scss';
import '../../styles/globals.scss';
import { GristProvider } from '@lib';
import { KanbanWidget } from '.';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GristProvider allowSelectBy>
      <KanbanWidget />
    </GristProvider>
  </StrictMode>,
);
