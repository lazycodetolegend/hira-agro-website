import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import AnimatedCounter from '../components/ui/AnimatedCounter';

const stats = [
  { number: '9+', label: 'Years Running' },
  { number: '5000+', label: 'Tonnes / Year' },
  { number: '100+', label: 'Dealer Network' },
  { number: '12', label: 'Rice Varieties' },
];

const features = [
  {
    title: 'Strict Quality Control',
    desc: 'Multi-stage sorting, de-stoning, and automated optical grading ensure 100% pure grains.',
  },
  {
    title: 'Modern Milling Tech',
    desc: 'State-of-the-art machinery preserves natural aroma, flavor, and rich nutritional value.',
  },
  {
    title: 'Bulk & Export Ready',
    desc: 'Flexible 10kg, 25kg, and 50kg bag packaging tailored for wholesalers and exporters.',
  },
  {
    title: 'Direct Farm Sourcing',
    desc: 'Sourced directly from fertile paddy farms with fair-price farmer partnerships.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
};

const Home = () => {
  return (
    <div className="overflow-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-end pb-20 md:pb-28">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/hero.webp"
            alt="Golden rice fields at sunset"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
          {/* Forest-tinted gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/50 to-forest/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <motion.span
              variants={fadeUp}
              custom={0}
              className="block text-xs md:text-sm tracking-[0.2em] uppercase text-gold font-semibold mb-6"
            >
              Since 2017 · Dahanu, Palghar
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-cream mb-6"
            >
              Grain-perfect rice,{' '}
              <em className="text-gold">milled with</em>{' '}
              uncompromised trust.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-cream/80 text-base md:text-xl leading-relaxed mb-10 max-w-xl"
            >
              Supplying premium Basmati, Sona Masuri, and parboiled Sella rice to wholesalers, retailers, and commercial buyers across India.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Button to="/products" variant="primary">View Catalogue</Button>
              <Button to="/contact" variant="secondary" className="text-cream border-cream/30 hover:border-cream">Get a Quote</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── QUALITY FEATURES ─── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeading
            label="01 — QUALITY STANDARDS"
            title="Crafted for excellence"
            subtitle="Every grain undergoes multi-stage optical grading to deliver unmatched aroma, flavor, and purity."
            className="mb-14 md:mb-16"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4"
          >
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                custom={idx}
                className={`py-6 md:py-0 md:px-8 ${
                  idx > 0 ? 'border-t md:border-t-0 md:border-l border-stone/20' : ''
                }`}
              >
                <span className="block text-xs text-gold font-bold tracking-wider mb-2">
                  0{idx + 1}
                </span>
                <h3 className="font-heading text-xl md:text-2xl text-ink font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-stone leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── WHY HIRA AGRO — asymmetric split ─── */}
      <section className="py-20 md:py-28 bg-cream border-t border-stone/15">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="md:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-md">
                <img
                  src="/images/silos.webp"
                  alt="Hira Agro Industry milling plant and silos"
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent p-6 md:p-8">
                  <p className="text-cream font-semibold text-sm">Processing plant at Jamshet, Ashagad</p>
                  <p className="text-cream/60 text-xs mt-1">Tal. Dahanu, Dist. Palghar — 401602</p>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="md:col-span-7 md:pl-4 space-y-6"
            >
              <span className="block text-xs tracking-[0.2em] uppercase text-gold font-bold">
                02 — OUR LEGACY
              </span>
              <h2 className="font-heading text-3xl md:text-5xl leading-[1.1] text-ink font-bold">
                Why Hira Agro Industry?
              </h2>
              <p className="text-stone text-base leading-relaxed max-w-lg">
                Located at Jamshet, Ashagad, Tal. Dahanu, Dist. Palghar — Hira Agro Industry combines grain expertise with modern milling technology to process, polish, and distribute grain-perfect rice with absolute reliability.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-stone/15">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <AnimatedCounter value={stat.number} className="block mb-1 font-bold text-3xl text-forest" />
                    <span className="text-xs text-stone tracking-wide uppercase font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 md:py-24 bg-forest">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-7xl mx-auto px-6 md:px-12 text-center sm:text-left"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="block text-xs tracking-[0.2em] uppercase text-gold font-bold mb-3">
                03 — GET STARTED
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-cream font-bold mb-4">
                Ready to source premium rice?
              </h2>
              <p className="text-cream/70 text-sm md:text-base leading-relaxed">
                Whether you&apos;re a wholesaler, retailer, or commercial buyer — we have the variety, volume, and quality you need.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 flex-shrink-0">
              <Button to="/products" variant="dark">Browse Catalog</Button>
              <Button to="/contact" variant="secondary" className="text-cream border-cream/30 hover:border-cream">
                Contact Sales Team
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
