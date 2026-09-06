import type { LucideProps } from 'lucide-react';
import { resolveIcon } from './icon-registry';

export type IconProps = LucideProps & { name: string };

/**
 * Icône SVG. La taille suit le `font-size` hérité (`width/height: 1em` dans
 * globals.scss), donc les règles SCSS existantes pilotent le rendu comme avant,
 * et la couleur suit `currentColor`.
 */
export function Icon({ name, className, ...rest }: IconProps) {
  const Cmp = resolveIcon(name);
  return <Cmp className={className ? `icon ${className}` : 'icon'} strokeWidth={1.75} {...rest} />;
}
