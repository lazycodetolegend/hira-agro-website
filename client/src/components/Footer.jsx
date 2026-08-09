import { Link } from 'react-router-dom';
import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineArrowUp,
  HiOutlineShieldCheck,
  HiOutlineSparkles
} from 'react-icons/hi';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-dark text-cream border-t border-gold/20">
      {/* ─── TOP BAR: BRAND & QUICK CONTACT ─── */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
                <span className="font-heading text-3xl text-cream font-bold">Hira Agro</span>
                <span className="text-xs tracking-[0.2em] font-semibold uppercase text-gold mt-1.5">Industry</span>
              </Link>
              <p className="text-cream/60 text-sm leading-relaxed">
                Premium rice milling, processing, and bulk supply. Serving wholesalers, commercial distributors, and retailers across India with optical-graded purity since 2017.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:+917977697797"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-cream px-4 py-2.5 rounded-full text-xs font-semibold border border-white/10 transition-colors"
              >
                <HiOutlinePhone className="w-4 h-4 text-gold" />
                +91 79776 97797
              </a>
              <a
                href="mailto:hiraagroindustry51@gmail.com"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-cream px-4 py-2.5 rounded-full text-xs font-semibold border border-white/10 transition-colors"
              >
                <HiOutlineMail className="w-4 h-4 text-gold" />
                Email Sales
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gold hover:bg-accent-light text-forest px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <HiOutlineSparkles className="w-4 h-4" />
                Get Wholesale Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN 4-COLUMN FOOTER GRID ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Col 1: Heritage & Trust (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="block text-xs tracking-[0.2em] uppercase text-gold font-bold">Heritage & Purity</span>
            <p className="text-sm text-cream/70 leading-relaxed">
              Equipped with modern de-stoning, multi-stage polishing, and computerised optical grain sortex technology at our facility in Dahanu, Palghar.
            </p>
            <div className="pt-2 space-y-2 text-xs text-cream/60">
              <div className="flex items-center gap-2">
                <HiOutlineShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>GSTIN: <strong>27BSHPM4686A1ZM</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>100% Optical Graded & Sorted Grains</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Bulk 10kg, 25kg & 50kg Export Bagging</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="block text-xs tracking-[0.2em] uppercase text-gold font-bold">Navigation</span>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'Rice Catalogue', path: '/products' },
                { name: 'Get in Touch', path: '/contact' },
                { name: 'Staff Login', path: '/login' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-cream/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Rice Varieties (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="block text-xs tracking-[0.2em] uppercase text-gold font-bold">Rice Varieties</span>
            <ul className="space-y-2.5 text-sm">
              {[
                'Royal Basmati 1121',
                'Super Sona Masuri',
                'Golden Parboiled Sella',
                'Aromatic Wada Kolam',
                'IR64 Raw & Steamed'
              ].map((variety) => (
                <li key={variety}>
                  <Link
                    to="/products"
                    className="text-cream/60 hover:text-gold transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <span className="text-gold text-xs">›</span> {variety}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Plant Location & Office (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="block text-xs tracking-[0.2em] uppercase text-gold font-bold">Milling Plant</span>
            <div className="space-y-3 text-xs text-cream/70">
              <div className="flex items-start gap-2.5">
                <HiOutlineLocationMarker className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Jamshet, Vasantwadi, Ashagad,<br />
                  Tal. Dahanu, Dist. Palghar — 401602,<br />
                  Maharashtra, India
                </p>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <HiOutlinePhone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+917977697797" className="hover:text-gold block">+91 79776 97797</a>
                  <a href="tel:+919823958410" className="hover:text-gold block">+91 98239 58410</a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <HiOutlineClock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p>Sat – Thu: 9:00 AM – 6:00 PM</p>
                  <p className="text-cream/40">Friday: Closed</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── BOTTOM SUB-FOOTER WITH BACK TO TOP ─── */}
      <div className="border-t border-white/10 bg-forest/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/40">
          <p>
            &copy; {new Date().getFullYear()} <strong className="text-cream/70 font-semibold">Hira Agro Industry</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>Dahanu, Palghar · Maharashtra</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-gold hover:text-cream transition-colors font-semibold"
            >
              <span>Back to top</span>
              <HiOutlineArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
