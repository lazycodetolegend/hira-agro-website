import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { HiOutlineSearch, HiOutlineShoppingBag, HiOutlineArrowRight } from 'react-icons/hi';
import { getImageUrl } from '../utils/getImageUrl';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SkeletonProductCard } from '../components/ui/SkeletonLoader';

const varieties = ['All', 'Basmati', 'Sona Masuri', 'Sella', 'Kolam', 'IR64'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVariety, setActiveVariety] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [activeVariety]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeVariety !== 'All') params.variety = activeVariety;
      if (searchQuery) params.search = searchQuery;
      params.available = 'true';
      const res = await api.get('/products', { params });
      setProducts(res.data.products || []);
    } catch (err) {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="animate-fade-in bg-cream min-h-screen">
      {/* 1. Header Section — proportional pt-10 pb-6 padding */}
      <section className="pt-10 pb-6 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SectionHeading
            label="OUR CATALOGUE"
            title="Premium Rice Collection"
            subtitle="Milled, polished, and optically graded at our processing plant in Dahanu, Palghar."
          />
        </div>
      </section>

      {/* 2. Filter Bar — sticky top-20 directly under h-20 navbar */}
      <section className="bg-cream/95 backdrop-blur-md sticky top-20 z-40 border-y border-stone/15 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {varieties.map((variety) => (
                <button
                  key={variety}
                  onClick={() => setActiveVariety(variety)}
                  className={`text-sm font-medium whitespace-nowrap transition-all duration-200 pb-1 cursor-pointer ${
                    activeVariety === variety
                      ? 'text-ink border-b-2 border-forest font-semibold'
                      : 'text-stone hover:text-ink'
                  }`}
                >
                  {variety}
                </button>
              ))}
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <HiOutlineSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-stone w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rice variety..."
                className="w-full pl-7 pr-4 py-1.5 bg-transparent border-b border-stone/30 text-sm text-ink focus:outline-none focus:border-forest transition-colors placeholder:text-stone/60"
              />
            </form>
          </div>
        </div>
      </section>

      {/* 3. Product Grid — pt-8 pb-16 md:pb-24 */}
      <section className="pt-8 pb-16 md:pb-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <Card hoverEffect={false} className="text-center py-16 px-6 max-w-md mx-auto bg-white/60">
              <HiOutlineShoppingBag className="w-12 h-12 text-stone/40 mx-auto mb-4" />
              <h3 className="font-heading text-2xl text-ink mb-2">No Products Found</h3>
              <p className="text-stone text-sm mb-6 leading-relaxed">
                We couldn&apos;t find any rice matching your selected criteria.
              </p>
              <Button
                variant="secondary"
                onClick={() => { setActiveVariety('All'); setSearchQuery(''); }}
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {products.map((product) => (
                <Card key={product._id} hoverEffect={true} className="flex flex-col h-full bg-white/80 overflow-hidden group">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone/5">
                    <img
                      src={getImageUrl(product.photoUrl)}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-cream/90 backdrop-blur-xs text-ink text-xs font-semibold rounded-full border border-stone/10">
                        {product.variety}
                      </span>
                    </div>
                  </div>

                  {/* Info section with flex-1 to push CTA to bottom */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-heading text-xl text-ink group-hover:text-forest transition-colors font-bold">
                          {product.name}
                        </h3>
                        <div className="text-right flex-shrink-0">
                          <span className="font-heading text-xl text-forest font-bold">₹{product.ratePerKg}</span>
                          <span className="block text-[11px] text-stone">per {product.unit || 'kg'}</span>
                        </div>
                      </div>
                      <p className="text-stone text-xs leading-relaxed line-clamp-2">
                        {product.description || 'Premium quality rice, carefully milled and optically sorted at our facility in Dahanu.'}
                      </p>
                    </div>

                    {/* Footer link */}
                    <div className="pt-4 border-t border-stone/15 flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone group-hover:text-ink transition-colors inline-flex items-center gap-1.5">
                        View Details
                        <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <Button variant="primary" to={`/products/${product._id}`} className="py-2 px-4 text-xs">
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
