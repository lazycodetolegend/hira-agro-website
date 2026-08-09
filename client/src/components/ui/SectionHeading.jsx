import { motion } from 'framer-motion';

const SectionHeading = ({
  label,
  badge,
  title,
  subtitle,
  centered = false,
  theme = 'light',
  className = '',
}) => {
  const displayText = label || badge;
  const align = centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl';

  const labelColor = 'text-gold';
  const titleColor = theme === 'dark' ? 'text-cream' : 'text-ink';
  const subtitleColor = theme === 'dark' ? 'text-cream/60' : 'text-stone';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`${align} ${className}`}
    >
      {displayText && (
        <span className={`block text-xs md:text-sm tracking-[0.2em] uppercase font-medium mb-4 ${labelColor}`}>
          {displayText}
        </span>
      )}
      {title && (
        <h2 className={`font-heading text-3xl md:text-5xl leading-[1.1] mb-4 ${titleColor}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`text-base md:text-lg leading-relaxed ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;

