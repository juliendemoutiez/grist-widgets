import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/reset.scss';
import '../../styles/globals.scss';
import { GristProvider, TooltipProvider } from '@lib';
import { NotesWidget } from './NotesWidget';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={300}>
      <GristProvider allowSelectBy>
        <NotesWidget />
      </GristProvider>
    </TooltipProvider>
  </StrictMode>,
);
