import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/reset.scss';
import '../../styles/globals.scss';
import { GristProvider, TooltipProvider } from '@lib';
import { NestedFormWidget } from '.';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={300}>
      <GristProvider>
        <NestedFormWidget />
      </GristProvider>
    </TooltipProvider>
  </StrictMode>,
);
