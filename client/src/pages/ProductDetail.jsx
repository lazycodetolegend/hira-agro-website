import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import { getImageUrl } from '../utils/getImageUrl';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-stone/20 border-t-forest rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center px-6 py-12">
        <Card hoverEffect={false} className="text-center max-w-md p-8 bg-white/70">
          <h2 className="font-heading text-3xl text-ink mb-3">Product Not Found</h2>
          <p className="text-stone text-sm mb-6">The product you are looking for does not exist or has been removed.</p>
          <Button variant="secondary" to="/products">
            Back to Catalogue
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen animate-fade-in pt-8 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone hover:text-ink transition-colors mb-8"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Back to Catalogue
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Photo & Badges (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone/10 border border-stone/15 shadow-sm">
              <img
                src={getImageUrl(product.photoUrl)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1 bg-cream/90 backdrop-blur-xs text-ink text-xs font-bold rounded-full border border-stone/20">
                  {product.variety}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/70 p-3.5 rounded-2xl border border-stone/15 flex items-center gap-2">
                <HiOutlineCheckCircle className="w-5 h-5 text-forest flex-shrink-0" />
                <span className="font-medium text-ink">100% Optical Graded</span>
              </div>
              <div className="bg-white/70 p-3.5 rounded-2xl border border-stone/15 flex items-center gap-2">
                <HiOutlineCheckCircle className="w-5 h-5 text-forest flex-shrink-0" />
                <span className="font-medium text-ink">Zero Impurities</span>
              </div>
            </div>
          </div>

          {/* Right Column: Info, Specs, and Wholesale Inquiry (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold block mb-2">
                {product.variety} Collection
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-3">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-3xl text-forest font-bold">
                  ₹{product.ratePerKg}
                </span>
                <span className="text-stone text-sm">
                  per {product.unit || 'kg'} (Wholesale Base Rate)
                </span>
              </div>
            </div>

            <p className="text-stone text-sm md:text-base leading-relaxed">
              {product.description || 'Milled and polished at our state-of-the-art rice processing plant in Dahanu, Palghar. Graded to international quality standards ensuring rich natural aroma, long grain elongation, and excellent non-sticky cooking characteristics.'}
            </p>

            {/* Specifications Card */}
            <Card hoverEffect={false} className="p-6 bg-white/80 space-y-4">
              <h3 className="font-heading text-lg text-ink font-bold border-b border-stone/15 pb-2">
                Product Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-stone block">Rice Variety</span>
                  <span className="font-bold text-ink">{product.variety}</span>
                </div>
                <div>
                  <span className="text-stone block">Packaging Sizes</span>
                  <span className="font-bold text-ink">10kg, 25kg, 50kg Bags</span>
                </div>
                <div>
                  <span className="text-stone block">Milling Type</span>
                  <span className="font-bold text-ink">Silky Sortex Polished</span>
                </div>
                <div>
                  <span className="text-stone block">Moisture Content</span>
                  <span className="font-bold text-ink">&lt; 13% Standard</span>
                </div>
                <div>
                  <span className="text-stone block">Dispatched From</span>
                  <span className="font-bold text-ink">Ashagad, Dahanu</span>
                </div>
                <div>
                  <span className="text-stone block">Availability</span>
                  <span className="font-bold text-forest">In Bulk Stock</span>
                </div>
              </div>
            </Card>

            {/* Direct Order / Quote CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="primary" to="/contact" className="py-3.5 px-8 text-sm font-semibold">
                Request Bulk Quote
              </Button>
              <a
                href="tel:+917977697797"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-stone/20 text-xs font-semibold text-ink hover:bg-white transition-colors"
              >
                <HiOutlinePhone className="w-4 h-4 text-forest" />
                Call +91 79776 97797
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
