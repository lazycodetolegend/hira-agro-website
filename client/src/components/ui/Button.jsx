import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';

const Button = ({
  children,
  to,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'dark'
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  icon: Icon,
  iconPosition = 'right',
  badge,
  label,
  hoverEffect,
  animate,
  ...props
}) => {
  const IconComponent = Icon || HiOutlineArrowRight;

  if (variant === 'secondary' || variant === 'outline') {
    const inner = (
      <span className={`
        group inline-flex items-center gap-2
        text-sm font-medium
        border-b border-current pb-1
        transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}>
        {children}
        <IconComponent className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    );

    if (to) return <Link to={to} className="inline-block" {...props}>{inner}</Link>;
    return <button type={type} onClick={onClick} disabled={disabled} className="inline-block" {...props}>{inner}</button>;
  }

  // Primary & Dark variants
  const styles = variant === 'dark'
    ? 'bg-cream text-forest hover:bg-white'
    : variant === 'light'
    ? 'bg-white text-forest hover:bg-cream'
    : 'bg-forest text-cream hover:bg-forest/90';

  const inner = (
    <span className={`
      group inline-flex items-center gap-3
      ${styles}
      px-8 py-4 rounded-full
      text-sm tracking-wide font-medium
      transition-all duration-300
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.97]'}
      ${className}
    `}>
      {children}
      <IconComponent className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
    </span>
  );

  if (to) return <Link to={to} className="inline-block" {...props}>{inner}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className="inline-block" {...props}>{inner}</button>;
};

export default Button;

