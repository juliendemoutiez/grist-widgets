import './button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'brand' | 'neutral';
  size?: 'small' | 'medium';
}

export function Button({
  color = 'brand',
  size = 'medium',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-button ui-button--${color} ui-button--${size} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
