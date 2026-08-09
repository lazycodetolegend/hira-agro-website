import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverEffect = true,
  animate = false,
  delay = 0,
  onClick,
  ...props
}) => {
  const baseClasses = `
    border border-stone/15 rounded-sm
    ${hoverEffect ? 'hover:border-stone/40 transition-colors duration-300' : ''}
    ${className}
  `;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
