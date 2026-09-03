import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import type { ReactElement, ReactNode } from 'react';
import './menu.scss';

interface MenuProps {
  /** The button that opens the menu. Cloned by Radix, so it must forward refs and props. */
  trigger: ReactElement;
  children: ReactNode;
  /** Controlled open state — keeps the caller's own "menu is open" styling in sync. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
}

/**
 * Dropdown menu built on Radix. Radix owns portalling, collision-aware
 * placement, focus trapping, roving keyboard navigation and outside-click
 * dismissal, so callers only supply a trigger and items.
 */
export function Menu({ trigger, children, open, onOpenChange, align = 'start' }: MenuProps) {
  return (
    <RadixMenu.Root open={open} onOpenChange={onOpenChange}>
      <RadixMenu.Trigger asChild>{trigger}</RadixMenu.Trigger>
      <RadixMenu.Portal>
        <RadixMenu.Content className="ui-menu" align={align} sideOffset={4} collisionPadding={8}>
          {children}
        </RadixMenu.Content>
      </RadixMenu.Portal>
    </RadixMenu.Root>
  );
}

interface MenuItemProps {
  children: ReactNode;
  onSelect: () => void;
  /** Material Icons ligature name shown before the label. */
  icon?: string;
  /** Render in the destructive colour. */
  danger?: boolean;
}

export function MenuItem({ children, onSelect, icon, danger }: MenuItemProps) {
  return (
    <RadixMenu.Item
      className={danger ? 'ui-menu__item ui-menu__item--danger' : 'ui-menu__item'}
      onSelect={onSelect}
    >
      {icon && <span className="material-icons">{icon}</span>}
      {children}
    </RadixMenu.Item>
  );
}
