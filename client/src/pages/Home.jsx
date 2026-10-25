import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight } from 'react-icons/hi';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';

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
              Our premium rice milling products include Sortex Milled White Rice, authentic Indrayani, Raw Paddy (Dhan), Usna Bhat, Broken Rice (Kanki), and Paddy Husk Biomass. Contact us to confirm wholesale availability and quotes.
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

      {/* ─── WHY HIRA AGRO ─── */}
      <section className="py-20 md:py-28 bg-cream border-t border-stone/15">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            <span className="block text-xs tracking-[0.2em] uppercase text-gold font-bold">
              02 — OUR LEGACY
            </span>
            <h2 className="font-heading text-3xl md:text-5xl leading-[1.1] text-ink font-bold">
              Why Hira Agro Industry?
            </h2>
            <p className="text-stone text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Located at Jamshet, Ashagad, Tal. Dahanu, Dist. Palghar — Hira Agro Industry combines grain expertise with modern milling technology to process, polish, and distribute grain-perfect rice with absolute reliability.
            </p>
          </motion.div>
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
                Looking for wholesale rice or biomass fuel?
              </h2>
              <p className="text-cream/70 text-sm md:text-base leading-relaxed">
                Inquire about bulk Steam Rice, authentic Indrayani, Raw Paddy (Dhan), Usna Bhat, Broken Rice (Kanki), and Paddy Husk. Contact our team to confirm current stock and truckload delivery.
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
