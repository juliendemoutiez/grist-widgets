import './avatar.scss';

type AvatarSize = 'xsmall' | 'small' | 'medium';

interface AvatarProps {
  /** Displayed name; its initials are rendered inside the circle. */
  fullName: string;
  size?: AvatarSize;
}

/** Deterministic palette pick, so a given name always keeps the same colour. */
const PALETTE = ['brand', 'blue', 'green', 'red', 'warning', 'info'] as const;

function initials(fullName: string): string {
  const parts = fullName.trim().split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[parts.length - 1][0];
}

function colorFor(fullName: string): string {
  let hash = 0;
  for (let i = 0; i < fullName.length; i++) hash = (hash * 31 + fullName.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({ fullName, size = 'small' }: AvatarProps) {
  return (
    <span
      className={`ui-avatar ui-avatar--${size} ui-avatar--${colorFor(fullName)}`}
      title={fullName}
      aria-hidden="true"
    >
      <span className="ui-avatar__initials">{initials(fullName)}</span>
    </span>
  );
}
