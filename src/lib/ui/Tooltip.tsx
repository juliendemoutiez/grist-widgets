import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { ReactElement } from 'react';
import './tooltip.scss';

export { Provider as TooltipProvider } from '@radix-ui/react-tooltip';

/**
 * Wraps a trigger with a Radix tooltip. Unlike a CSS `::after` tooltip this
 * one also appears on keyboard focus and is announced by screen readers.
 * Requires a `<TooltipProvider>` above it in the tree.
 */
export function Tooltip({ label, children, side = 'top' }: {
  label: string;
  children: ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content className="ui-tooltip" side={side} sideOffset={6}>
          {label}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
