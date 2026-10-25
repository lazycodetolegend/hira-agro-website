import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineShoppingBag,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineCheck,
  HiOutlineArrowRight,
  HiOutlineX
} from 'react-icons/hi';
import { GiWheat, GiGrainBundle, GiFactory, GiFlame } from 'react-icons/gi';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../utils/api';
import { coreProducts } from '../data/productsData';

const categories = ['All', 'Rice', 'Indrayani', 'Paddy', 'Bhat', 'Broken Rice', 'Husk', 'Kolam', 'Basmati'];

// Icon helper per variety
const getProductIcon = (variety = '') => {
  const v = variety.toLowerCase();
  if (v.includes('husk')) return GiFlame;
  if (v.includes('broken')) return GiGrainBundle;
  if (v.includes('paddy')) return GiWheat;
  if (v.includes('bhat')) return GiGrainBundle;
  if (v.includes('indrayani')) return GiWheat;
  return GiFactory;
};

const Products = () => {
  const [activeVariety, setActiveVariety] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [productsList, setProductsList] = useState(coreProducts);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Fetch live products from backend API if available, and merge
  useEffect(() => {
    let isMounted = true;
    const fetchApiProducts = async () => {
      try {
        setIsLoadingApi(true);
        const res = await api.get('/products');
        const apiProds = res.data?.products || [];
        if (isMounted && apiProds.length > 0) {
          // Merge API products with our rich default catalog
          const merged = coreProducts.map((core) => {
            const match = apiProds.find(
              (p) =>
                (p.variety && p.variety.toLowerCase() === core.variety.toLowerCase()) ||
                (p.name && p.name.toLowerCase().includes(core.variety.toLowerCase()))
            );
            if (match) {
              return {
                ...core,
                _id: match._id,
                ratePerKg: match.ratePerKg || core.ratePerKg,
                stockQuantity: match.stockQuantity ?? core.stockQuantity,
                isAvailable: match.isAvailable ?? core.inStock,
                photoUrl: match.photoUrl || core.photoUrl,
              };
            }
            return core;
          });

          // Add any other products from DB that are not in coreProducts
          apiProds.forEach((dbP) => {
            const alreadyExists = merged.some(
              (m) =>
                m._id === dbP._id ||
                (m.variety && dbP.variety && m.variety.toLowerCase() === dbP.variety.toLowerCase())
            );
            if (!alreadyExists) {
              merged.push({
                id: dbP._id,
                _id: dbP._id,
                slug: dbP._id,
                name: dbP.name,
                variety: dbP.variety || 'Rice',
                tag: 'WHOLESALE PRODUCT',
                ratePerKg: dbP.ratePerKg || 0,
                priceRange: `₹${dbP.ratePerKg || 0} / kg`,
                wholesaleUnit: dbP.unit || 'kg',
                description: dbP.description || 'Quality grain product processed at Hira Agro Industry.',
                specs: [{ label: 'Unit', value: dbP.unit || 'kg' }],
                highlights: ['Mill Direct Supply', 'Standard Quality Checked'],
                applications: ['Wholesale and retail consumption'],
                inStock: dbP.isAvailable !== false,
                category: dbP.variety || 'Rice',
                photoUrl: dbP.photoUrl,
              });
            }
          });

          setProductsList(merged);
        }
      } catch (err) {
        // Fallback gracefully to coreProducts
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    };

    fetchApiProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedProducts = useMemo(() => {
    return productsList.filter((product) => {
      const productVariety = product.variety || product.category || '';
      const matchesVariety =
        activeVariety === 'All' ||
        productVariety.toLowerCase() === activeVariety.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesVariety;

      const searchableText = [
        product.name,
        product.variety,
        product.tag,
        product.description,
        product.wholesaleUnit,
        ...(product.highlights || []),
        ...(product.applications || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesVariety && searchableText.includes(query);
    });
  }, [productsList, activeVariety, searchQuery]);

  return (
    <div className="animate-fade-in bg-cream min-h-screen">
      {/* ─── HEADER SECTION ─── */}
      <section className="pt-10 pb-8 bg-cream border-b border-stone/15">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeading
            label="MILL CATALOGUE & CURRENT PRICING"
            title="Premium Rice Mill Products"
            subtitle="Explore our core rice milling products including Steam Rice, authentic Indrayani, Raw Paddy, Usna Bhat, Broken Rice (Kanki), and Paddy Husk Biomass. Direct mill-gate rates with wholesale supply across Maharashtra & Gujarat."
          />

          {/* Quick Mill Assurance Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-3 md:gap-6 text-xs text-stone font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest/5 text-forest border border-forest/15">
              <HiOutlineSparkles className="w-3.5 h-3.5 text-gold" />
              100% Sortex Optical Cleaned
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest/5 text-forest border border-forest/15">
              <HiOutlineCheck className="w-3.5 h-3.5 text-forest" />
              Direct Mill-Gate Wholesale Rates
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest/5 text-forest border border-forest/15">
              <HiOutlinePhone className="w-3.5 h-3.5 text-gold" />
              Bulk Truckload & 25kg/50kg Bag Supply
            </span>
          </div>
        </div>
      </section>

      {/* ─── FILTER & SEARCH BAR (Sticky) ─── */}
      <section className="bg-cream/95 backdrop-blur-md sticky top-20 z-40 border-b border-stone/15 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category / Variety Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((variety) => {
                const isActive = activeVariety === variety;
                return (
                  <button
                    key={variety}
                    onClick={() => setActiveVariety(variety)}
                    className={`text-xs md:text-sm font-medium whitespace-nowrap px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-forest text-cream font-semibold shadow-xs'
                        : 'bg-stone/10 text-stone hover:text-ink hover:bg-stone/20'
                    }`}
                  >
                    {variety}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 flex-shrink-0">
              <HiOutlineSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone w-4 h-4"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rice, husk, kanki, price..."
                aria-label="Search products"
                className="w-full pl-9 pr-8 py-2 bg-white/70 border border-stone/25 rounded-full text-xs md:text-sm text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/30 transition-all placeholder:text-stone/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone hover:text-ink p-1"
                  aria-label="Clear search"
                >
                  <HiOutlineX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results Count & Quick Info */}
          <div className="mt-3 flex items-center justify-between text-xs text-stone">
            <span>
              Showing <strong className="text-ink font-semibold">{displayedProducts.length}</strong>{' '}
              {displayedProducts.length === 1 ? 'product' : 'products'}
              {activeVariety !== 'All' && ` in ${activeVariety}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            <span className="hidden sm:inline text-[11px] text-stone/80">
              * Wholesale prices quoted per kg ex-mill (Dahanu)
            </span>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT CARDS GRID ─── */}
      <section className="pt-8 pb-16 md:pb-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {displayedProducts.length === 0 ? (
            <Card hoverEffect={false} className="text-center py-16 px-6 max-w-md mx-auto bg-white/80">
              <HiOutlineShoppingBag className="w-12 h-12 text-stone/40 mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-heading text-2xl text-ink mb-2">No Products Found</h3>
              <p className="text-stone text-sm mb-6 leading-relaxed">
                We couldn&apos;t find any item matching &ldquo;{searchQuery}&rdquo;. Try another term like &ldquo;rice&rdquo;, &ldquo;husk&rdquo;, &ldquo;kanki&rdquo;, or &ldquo;indrayani&rdquo;.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setActiveVariety('All');
                  setSearchQuery('');
                }}
              >
                Reset Search Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10">
              {displayedProducts.map((product) => {
                const Icon = getProductIcon(product.variety);
                const detailSlug = product.slug || product._id || product.id;

                return (
                  <Card
                    key={product.id || product._id}
                    hoverEffect={true}
                    className="flex flex-col h-full bg-white/90 rounded-2xl overflow-hidden border border-stone/20 shadow-xs hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Top Banner / Graphic Header */}
                    <div className="relative p-6 bg-gradient-to-br from-forest/10 via-forest/5 to-cream border-b border-stone/15 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center text-forest group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-bold block">
                            {product.variety}
                          </span>
                          <span className="text-xs text-stone font-medium">
                            {product.tag || 'Mill Direct'}
                          </span>
                        </div>
                      </div>

                      {/* Stock / Wholesale Badge */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          IN STOCK
                        </span>
                        <span className="text-[10px] text-stone tracking-wide">
                          {product.wholesaleUnit}
                        </span>
                      </div>
                    </div>

                    {/* Card Main Content */}
                    <div className="p-6 md:p-7 flex flex-col flex-1 justify-between gap-6">
                      <div>
                        {/* Title */}
                        <Link to={`/products/${detailSlug}`}>
                          <h3 className="font-heading text-2xl md:text-3xl text-ink font-bold hover:text-forest transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-stone text-xs md:text-sm leading-relaxed mt-3">
                          {product.description}
                        </p>

                        {/* Highlights Pills */}
                        {product.highlights && product.highlights.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {product.highlights.map((h, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-stone/10 text-ink/80 font-medium"
                              >
                                <HiOutlineCheck className="w-3 h-3 text-forest" />
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price Section & Actions */}
                      <div className="pt-5 border-t border-stone/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        {/* Pricing */}
                        <div>
                          <span className="text-[11px] text-stone block font-medium uppercase tracking-wider">
                            Current Market Wholesale Rate
                          </span>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="font-heading text-3xl font-bold text-forest">
                              ₹{product.ratePerKg}
                            </span>
                            <span className="text-xs text-stone font-medium">/ kg</span>
                            {product.priceRange && (
                              <span className="text-[11px] text-stone/80 ml-2">
                                ({product.priceRange})
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone/70 block mt-0.5">
                            MOQ: Standard 25kg / 50kg bag or Truckload
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            to={`/products/${detailSlug}`}
                            className="px-3.5 py-2 text-xs font-semibold text-forest hover:bg-forest/5 rounded-lg border border-forest/20 transition-colors inline-flex items-center gap-1"
                          >
                            Details
                            <HiOutlineArrowRight className="w-3 h-3" />
                          </Link>
                          <Link
                            to={`/contact?product=${encodeURIComponent(product.name)}`}
                            className="px-4 py-2 text-xs font-semibold bg-forest text-cream hover:bg-forest/90 rounded-lg shadow-xs transition-all inline-flex items-center gap-1.5"
                          >
                            <HiOutlinePhone className="w-3.5 h-3.5 text-gold" />
                            Enquire Rate
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── WHOLESALE & BULK INQUIRY BANNER ─── */}
      <section className="py-14 bg-forest text-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold block mb-2">
                BULK TRUCKLOAD & REGULAR DEALER ORDERS
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream mb-3">
                Need Wholesale Quotes or Custom Packaging?
              </h2>
              <p className="text-cream/80 text-sm leading-relaxed">
                Hira Agro Industry supplies direct from our mill at Jamshet, Ashagad (Dahanu, Palghar). We offer flexible packaging in 25kg, 30kg, 50kg PP bags or loose truckloads with transparent daily market rates.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 flex-shrink-0">
              <a
                href="tel:+917977697797"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold text-forest font-bold text-xs tracking-wider uppercase hover:bg-gold/90 transition-all shadow-md"
              >
                <HiOutlinePhone className="w-4 h-4" />
                Call +91 79776 97797
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-cream/30 text-cream font-medium text-xs tracking-wider uppercase hover:bg-white/10 transition-colors"
              >
                Contact Sales Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
