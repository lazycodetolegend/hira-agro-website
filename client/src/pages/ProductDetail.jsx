import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  HiOutlineArrowLeft,
  HiOutlinePhone,
  HiOutlineShoppingBag,
  HiOutlineCheck,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSparkles
} from 'react-icons/hi';
import { GiWheat, GiGrainBundle, GiFactory, GiFlame } from 'react-icons/gi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getProductByIdOrSlug, coreProducts } from '../data/productsData';
import { getImageUrl } from '../utils/getImageUrl';

// Icon helper
const getProductIcon = (variety = '') => {
  const v = variety.toLowerCase();
  if (v.includes('husk')) return GiFlame;
  if (v.includes('broken')) return GiGrainBundle;
  if (v.includes('paddy')) return GiWheat;
  if (v.includes('bhat')) return GiGrainBundle;
  if (v.includes('indrayani')) return GiWheat;
  return GiFactory;
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveProduct = async () => {
      setLoading(true);
      // 1. First check our comprehensive coreProducts catalog
      const localProduct = getProductByIdOrSlug(id);

      // 2. Try fetching from backend API (if it's a MongoDB ObjectId or custom product)
      try {
        const res = await api.get(`/products/${id}`);
        const apiProd = res.data?.product;
        if (apiProd && isMounted) {
          // If we also matched localProduct, merge specifications and rich details
          if (localProduct) {
            setProduct({
              ...localProduct,
              _id: apiProd._id,
              name: apiProd.name || localProduct.name,
              variety: apiProd.variety || localProduct.variety,
              ratePerKg: apiProd.ratePerKg || localProduct.ratePerKg,
              description: apiProd.description || localProduct.description,
              photoUrl: apiProd.photoUrl || localProduct.photoUrl,
              stockQuantity: apiProd.stockQuantity ?? localProduct.stockQuantity,
              inStock: apiProd.isAvailable !== false,
            });
          } else {
            setProduct({
              id: apiProd._id,
              _id: apiProd._id,
              slug: apiProd._id,
              name: apiProd.name,
              variety: apiProd.variety || 'Rice',
              tag: 'MILL DIRECT PRODUCT',
              ratePerKg: apiProd.ratePerKg || 0,
              priceRange: `₹${apiProd.ratePerKg || 0} / kg`,
              wholesaleUnit: apiProd.unit || 'kg',
              description: apiProd.description || 'Quality product processed at Hira Agro Industry.',
              specs: [
                { label: 'Unit', value: apiProd.unit || 'kg' },
                { label: 'Available Stock', value: `${apiProd.stockQuantity || 0} kg` }
              ],
              highlights: ['Quality Tested', 'Mill Gate Rates', 'Reliable Supply'],
              applications: ['Commercial and consumer use'],
              inStock: apiProd.isAvailable !== false,
              photoUrl: apiProd.photoUrl,
            });
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        // API lookup failed or ID is a slug — fallback to local catalog
      }

      if (isMounted) {
        setProduct(localProduct || null);
        setLoading(false);
      }
    };

    resolveProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-cream flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-stone/20 border-t-forest rounded-full animate-spin"></div>
        <p className="text-stone text-xs tracking-wide">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center px-6 py-12">
        <Card hoverEffect={false} className="text-center max-w-md p-8 bg-white/80">
          <HiOutlineShoppingBag className="w-14 h-14 text-stone/40 mx-auto mb-4" />
          <h2 className="font-heading text-3xl text-ink mb-3">Product Not Found</h2>
          <p className="text-stone text-sm mb-6">
            The product you requested does not exist or may have been updated.
          </p>
          <Button variant="primary" to="/products">
            Browse All Products
          </Button>
        </Card>
      </div>
    );
  }

  const Icon = getProductIcon(product.variety);
  const relatedProducts = coreProducts.filter(
    (p) => (p.slug || p.id) !== (product.slug || product.id)
  ).slice(0, 3);

  return (
    <div className="bg-cream min-h-screen animate-fade-in pt-8 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone hover:text-forest transition-colors mb-8 group"
        >
          <HiOutlineArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to All Products
        </Link>

        {/* ─── MAIN PRODUCT GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column — Visual / Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-forest/15 via-forest/5 to-cream border border-stone/20 shadow-sm flex items-center justify-center">
              {product.photoUrl ? (
                <img
                  src={getImageUrl(product.photoUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-forest p-8 text-center">
                  <div className="w-24 h-24 rounded-2xl bg-forest/10 flex items-center justify-center mb-4">
                    <Icon className="w-12 h-12 text-forest" />
                  </div>
                  <span className="font-heading text-2xl text-ink font-bold">
                    {product.name}
                  </span>
                  <span className="text-xs text-gold uppercase tracking-[0.2em] font-bold mt-1">
                    {product.variety}
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/95 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {product.inStock ? 'IN STOCK • WHOLESALE' : 'CONFIRM ON ENQUIRY'}
                </span>
              </div>
            </div>

            {/* Quality & Mill Trust Points */}
            <Card hoverEffect={false} className="p-6 bg-white/80 space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-ink flex items-center gap-2">
                <HiOutlineShieldCheck className="w-4 h-4 text-forest" />
                Hira Agro Quality Assurance
              </h4>
              <ul className="text-xs text-stone space-y-2">
                <li className="flex items-start gap-2">
                  <HiOutlineCheck className="w-3.5 h-3.5 text-forest flex-shrink-0 mt-0.5" />
                  <span>Direct mill-gate dispatch from Jamshet, Ashagad (Dahanu, Palghar).</span>
                </li>
                <li className="flex items-start gap-2">
                  <HiOutlineCheck className="w-3.5 h-3.5 text-forest flex-shrink-0 mt-0.5" />
                  <span>High-precision optical Sortex cleaning & de-stoning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <HiOutlineTruck className="w-3.5 h-3.5 text-forest flex-shrink-0 mt-0.5" />
                  <span>Available in 25kg / 50kg PP bags, custom branding, or full truckloads.</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Right Column — Information & Pricing */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold">
                  {product.variety}
                </span>
                <span className="text-xs text-stone/50">•</span>
                <span className="text-xs text-stone uppercase tracking-wide font-medium">
                  {product.tag || 'Mill Direct'}
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
                {product.name}
              </h1>
              <p className="text-stone text-sm md:text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-forest/5 border border-forest/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-stone font-semibold block">
                  Current Wholesale Mill Rate
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-heading text-4xl sm:text-5xl font-bold text-forest">
                    ₹{product.ratePerKg}
                  </span>
                  <span className="text-sm font-medium text-stone">/ kg</span>
                  {product.priceRange && (
                    <span className="text-xs text-stone/80 ml-2">
                      ({product.priceRange})
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone/80 block mt-1">
                  Packaging: <strong className="text-ink font-semibold">{product.wholesaleUnit || '25kg / 50kg bags'}</strong>
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="px-6 py-3 rounded-full bg-forest text-cream font-semibold text-xs tracking-wider uppercase hover:bg-forest/90 transition-all text-center shadow-xs"
                >
                  Request Official Quote
                </Link>
                <a
                  href="tel:+917977697797"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-forest/30 text-xs font-bold text-forest hover:bg-forest/5 transition-colors"
                >
                  <HiOutlinePhone className="w-4 h-4 text-gold" />
                  Call +91 79776 97797
                </a>
              </div>
            </div>

            {/* Technical Specifications */}
            {product.specs && product.specs.length > 0 && (
              <Card hoverEffect={false} className="p-6 bg-white/80 space-y-4">
                <h3 className="font-heading text-xl text-ink font-bold border-b border-stone/15 pb-2 flex items-center gap-2">
                  <HiOutlineSparkles className="w-5 h-5 text-gold" />
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-stone/10">
                      <span className="text-stone font-medium">{spec.label}</span>
                      <span className="font-semibold text-ink text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Applications & Uses */}
            {product.applications && product.applications.length > 0 && (
              <Card hoverEffect={false} className="p-6 bg-white/80 space-y-3">
                <h3 className="font-heading text-lg text-ink font-bold border-b border-stone/15 pb-2">
                  Recommended Applications & Uses
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone">
                  {product.applications.map((app, i) => (
                    <div key={i} className="flex items-center gap-2 bg-stone/5 p-2 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest flex-shrink-0"></span>
                      <span className="text-ink/80">{app}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* ─── OTHER PRODUCTS STRIP ─── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone/20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-ink">
                Other Rice Mill Products
              </h3>
              <Link
                to="/products"
                className="text-xs font-semibold uppercase tracking-wider text-forest hover:text-forest/80"
              >
                View Full Catalogue &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/products/${rel.slug || rel.id}`}
                  className="p-5 rounded-xl bg-white/80 border border-stone/20 hover:border-forest/40 transition-all hover:shadow-xs group"
                >
                  <span className="text-[10px] uppercase tracking-wider text-gold font-bold block mb-1">
                    {rel.variety}
                  </span>
                  <h4 className="font-heading text-xl font-bold text-ink group-hover:text-forest transition-colors">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-stone mt-2 line-clamp-2">
                    {rel.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone/10 flex items-center justify-between">
                    <span className="font-heading text-xl font-bold text-forest">
                      ₹{rel.ratePerKg} <span className="text-xs font-normal text-stone">/ kg</span>
                    </span>
                    <span className="text-xs text-forest font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Details &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
