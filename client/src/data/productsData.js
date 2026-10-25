import { getProductImage } from '../utils/getImageUrl';

export const coreProducts = [
  {
    id: 'rice',
    slug: 'rice',
    name: 'Milled White Rice (Steam / Raw)',
    variety: 'Rice',
    tag: 'DAILY STAPLE & WHOLESALE',
    photoUrl: '/images/Milled White Rice.webp',
    ratePerKg: 40,
    priceRange: '₹36 – ₹45 / kg',
    wholesaleUnit: '25 kg & 50 kg PP Bags',
    description: 'High-grade Sortex-cleaned milled white rice processed with advanced multi-stage destoning, polishing, and optical grading technology. Clean, uniform grains that cook fluffy and separate without sticking. Retains rich natural grain aroma, essential nutrients, and clean taste. Ideal for daily household consumption, hotel & catering bulk supplies, and regional wholesale distribution.',
    specs: [
      { label: 'Grain Type', value: 'Medium / Slender Grain' },
      { label: 'Purity & Grade', value: '100% Sortex Cleaned' },
      { label: 'Moisture Content', value: '< 13% Max' },
      { label: 'Broken Ratio', value: '< 4-5% Max' },
      { label: 'Processing', value: 'Raw / Steam Milled' },
    ],
    highlights: ['100% Sortex Cleaned', 'Fluffy Non-Sticky Cooking', 'Destoned & Polished', 'Bulk 25kg/50kg Bags'],
    applications: [
      'Daily household dining',
      'Hotel & restaurant commercial kitchen',
      'Catering & bulk event catering',
      'Wholesale dealer & grocery distribution'
    ],
    inStock: true,
    category: 'Rice'
  },
  {
    id: 'indrayani',
    slug: 'indrayani',
    name: 'Indrayani Rice (Maval Fragrant)',
    variety: 'Indrayani',
    tag: 'MAHARASHTRA SPECIALTY',
    photoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ratePerKg: 58,
    priceRange: '₹52 – ₹65 / kg',
    wholesaleUnit: '25 kg & 30 kg PP Bags',
    description: 'Famous indigenous aromatic rice variety cultivated primarily in the Maval and Western Ghats region of Maharashtra. Revered for its sweet, captivating aroma, medium slender grain, and characteristic soft, sticky texture when cooked. It absorbs gravies and curries exceptionally well and is the undisputed favorite across Maharashtra for daily meals, Varan Bhaat, festive feasts, and comforting dal khichdi.',
    specs: [
      { label: 'Grain Character', value: 'Medium Slender, Aromatic' },
      { label: 'Texture', value: 'Soft, Tender & Naturally Sticky' },
      { label: 'Aroma', value: 'Distinct Sweet Natural Fragrance' },
      { label: 'Moisture Content', value: '< 13%' },
      { label: 'Origin', value: 'Maval / Western Ghats, Maharashtra' },
    ],
    highlights: ['Captivating Sweet Aroma', 'Naturally Soft & Sticky', 'Authentic Maval Origin', 'Perfect for Varan Bhaat'],
    applications: [
      'Authentic Maharashtrian cuisine',
      'Traditional Varan Bhaat & Masale Bhaat',
      'Dal Khichdi & comfort bowls',
      'Family dining & festive celebrations'
    ],
    inStock: true,
    category: 'Indrayani'
  },
  {
    id: 'paddy',
    slug: 'paddy',
    name: 'Raw Paddy Grain (Dhan / Farm Fresh)',
    variety: 'Paddy',
    tag: 'RAW HARVEST & SEED GRADE',
    photoUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
    ratePerKg: 24,
    priceRange: '₹22 – ₹28 / kg (₹2,200 – ₹2,800 / Quintal)',
    wholesaleUnit: '50 kg Gunny Bags / Loose Truckloads / Quintal',
    description: 'Harvest-fresh unhulled paddy grain (Dhan) sourced directly from farmer partnerships across Palghar and fertile regional belts. Pre-cleaned to remove field straw, stones, and light chaff. Ideal for commercial rice milling, government procurement, seed aggregation, and long-term grain storage.',
    specs: [
      { label: 'Grain Form', value: 'Raw unhusked paddy (Dhan)' },
      { label: 'Moisture Content', value: '< 14% (Safely Dried)' },
      { label: 'Foreign Matter', value: '< 1.5% Pre-Cleaned' },
      { label: 'Admixture', value: '< 2% Max' },
      { label: 'Origin', value: 'Palghar / Maharashtra Farm Belts' },
    ],
    highlights: ['Farm Direct Procurement', 'Properly Dried < 14% Moisture', 'Pre-Cleaned & De-Stoned', 'Bulk Truckload Dispatch'],
    applications: [
      'Commercial rice milling and hulling operations',
      'Institutional and APMC grain procurement',
      'Seed selection and agricultural storage reserves',
      'Bulk grain trading and wholesale aggregators'
    ],
    inStock: true,
    category: 'Paddy'
  },
  {
    id: 'bhat',
    slug: 'bhat',
    name: 'Usna Bhat Rice (Parboiled / Traditional Table Rice)',
    variety: 'Bhat',
    tag: 'TRADITIONAL KONKAN TABLE RICE',
    photoUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    ratePerKg: 36,
    priceRange: '₹34 – ₹42 / kg',
    wholesaleUnit: '25 kg & 50 kg PP Bags',
    description: 'Traditional parboiled table rice (locally known as Usna Tandul / Ukada Bhat) widely cherished across coastal Maharashtra, Konkan, and Palghar. Hydrothermally parboiled before gentle milling to drive grain nutrients and bran goodness into the core. Cooks firm, non-sticky, and fluffy, making it the most nourishing daily staple for steamed bhat and curries.',
    specs: [
      { label: 'Grain Type', value: 'Medium Bold Parboiled (Usna)' },
      { label: 'Processing', value: 'Hydrothermally Soaked, Steamed & Milled' },
      { label: 'Nutritional Value', value: 'High Thiamine & Fiber Content' },
      { label: 'Cooking Quality', value: 'Firm, Fluffy & Non-Sticky' },
      { label: 'Moisture', value: '< 13% Max' },
    ],
    highlights: ['Traditional Parboiled (Usna)', 'Nutrient-Dense Bran Infused', 'Firm Non-Sticky Fluffy Grains', 'Easy to Digest Daily Staple'],
    applications: [
      'Daily family lunch and dinner (Varan Bhat, plain steamed bhat)',
      'Traditional coastal Maharashtra and Konkan dining',
      'Wholesale grain stores, mess, and catering contracts',
      'Nutrient-conscious staple dining'
    ],
    inStock: true,
    category: 'Bhat'
  },
  {
    id: 'broken-rice',
    slug: 'broken-rice',
    name: 'Broken Rice (Kanki / Khanda)',
    variety: 'Broken Rice',
    tag: 'FOOD GRADE & ANIMAL FEED',
    photoUrl: '/images/Broken-Rice.jpg',
    ratePerKg: 25,
    priceRange: '₹22 – ₹28 / kg',
    wholesaleUnit: '25 kg & 50 kg PP Bags',
    description: 'Premium Sortex-cleaned broken rice grains (popularly known as Kanki, Khanda, or rice grits) separated during the milling, polishing, and sizing stages. Completely de-stoned, dust-free, and hygienically packed. Excellent for commercial food applications including idli, dosa, and modak rice batter, rice flour (chawal ka atta), and traditional porridge/khichdi. Also a staple raw material for cattle feed formulation, poultry feed, starch production, glucose extraction, and brewery processing.',
    specs: [
      { label: 'Grain Fraction', value: '1/2 to 3/4 Tukda / Kanki' },
      { label: 'Purity', value: '99.5% Sortex Cleaned (Stone-free)' },
      { label: 'Moisture', value: '< 12.5%' },
      { label: 'Foreign Matter', value: 'Nil / Negligible' },
      { label: 'Grade Quality', value: 'Food Grade & Cattle/Poultry Feed Grade' },
    ],
    highlights: ['Stone-Free & Dust-Free', 'High Starch Content', 'Ideal for Idli/Dosa Batter', 'Economical Wholesale Rate'],
    applications: [
      'Idli, dosa, and modak batter manufacturing',
      'Rice flour (chawal ka atta) production',
      'Poultry & dairy cattle feed formulations',
      'Breweries, distilleries, and starch factories'
    ],
    inStock: true,
    category: 'Broken Rice'
  },
  {
    id: 'husk',
    slug: 'husk',
    name: 'Rice Husk (Paddy Hull Biomass)',
    variety: 'Husk',
    tag: 'ECO BIOMASS FUEL & BEDDING',
    photoUrl: '/images/Pure Rice Husk.jpg',
    ratePerKg: 6,
    priceRange: '₹5 – ₹8 / kg (₹5,000 – ₹7,500 / Tonne)',
    wholesaleUnit: 'Loose Bulk / 30-40 kg Bags / Metric Ton',
    description: 'Clean, dry, and uniformly separated rice husk (paddy hull) extracted during the primary milling and de-husking process. Known for its high calorific value (GCV ~3,000 to 3,500 kcal/kg) and low moisture content (<10%). Highly demanded as a sustainable, cost-effective biomass fuel for industrial steam boilers, briquette and pellet manufacturing, brick kilns, and cement plants. Also extensively used as absorbent poultry litter bedding, cattle farm bedding, and organic agricultural mulching.',
    specs: [
      { label: 'Calorific Value (GCV)', value: '~3,200 – 3,500 kcal/kg' },
      { label: 'Moisture Content', value: '< 9-10% Dry' },
      { label: 'Ash / Silica Content', value: '15 – 18% (Silica-rich)' },
      { label: 'Form Factor', value: 'Clean, dry loose hull / Bagged' },
      { label: 'Supply Quantity', value: 'Truckloads (10–25 Tonnes) or Bags' },
    ],
    highlights: ['High Calorific Value (GCV 3400)', 'Low Moisture < 10%', 'Clean & Dry Separation', 'Bulk Truckload Dispatch'],
    applications: [
      'Industrial boilers & steam generation plants',
      'Biomass briquette & pellet manufacturing',
      'Brick kilns and cement industries',
      'Poultry farm litter & cattle shed bedding',
      'Composting, soil conditioning & nursery mulch'
    ],
    inStock: true,
    category: 'Husk'
  },
  {
    id: 'kolam-rice',
    slug: 'kolam-rice',
    name: 'Kolam Rice (Wada Kolam / Lachkari)',
    variety: 'Kolam',
    tag: 'FINE TABLE RICE',
    photoUrl: '/images/rice-default.jpg',
    ratePerKg: 48,
    priceRange: '₹44 – ₹54 / kg',
    wholesaleUnit: '25 kg & 50 kg PP Bags',
    description: 'Renowned everyday table rice famous across western India for its tiny, slender grains, soft texture, and mild pleasant aroma. Cooks smoothly without getting sticky and digests easily. Perfect for daily family meals, steamed rice, and curries.',
    specs: [
      { label: 'Grain Length', value: 'Short to Medium Slender' },
      { label: 'Color', value: 'Pearlescent White' },
      { label: 'Moisture', value: '< 13%' },
      { label: 'Cooking Texture', value: 'Soft & Separate Grains' },
    ],
    highlights: ['Light & Easy to Digest', 'Uniform Slender Grain', 'Daily Dining Staple', 'Sortex Cleaned'],
    applications: [
      'Daily family lunch & dinner',
      'Steamed plain rice & curries',
      'Pulao & lemon rice',
      'Wholesale kirana & supermarket resale'
    ],
    inStock: true,
    category: 'Kolam'
  },
  {
    id: 'basmati-rice',
    slug: 'basmati-rice',
    name: 'Basmati Rice (Long Grain Royal)',
    variety: 'Basmati',
    tag: 'PREMIUM AROMATIC GRAIN',
    photoUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80',
    ratePerKg: 85,
    priceRange: '₹75 – ₹95 / kg',
    wholesaleUnit: '25 kg PP Bags',
    description: 'Celebrated royal long-grain aromatic rice known for its majestic grain elongation, delicate sweet scent, and exquisite fluffy finish. Matured and polished for celebratory biryanis, royal pulaos, and gourmet catering.',
    specs: [
      { label: 'Average Grain Length', value: '7.8mm – 8.3mm+ (Aged)' },
      { label: 'Aroma', value: 'Classic Royal Basmati Fragrance' },
      { label: 'Elongation Ratio', value: '2x+ upon cooking' },
      { label: 'Moisture', value: '< 12%' },
    ],
    highlights: ['Extra Long Grain Elongation', 'Signature Basmati Scent', 'Aged for Maximum Fluffiness', 'Catering & Export Grade'],
    applications: [
      'Hyderabadi & Dum Biryani',
      'Shahi Pulao & Jeera Rice',
      'Weddings & luxury banquet catering',
      'Premium retail distribution'
    ],
    inStock: true,
    category: 'Basmati'
  }
];

export const getProductByIdOrSlug = (idOrSlug) => {
  if (!idOrSlug) return null;
  const cleanId = String(idOrSlug).toLowerCase().trim();
  return coreProducts.find(
    (p) =>
      p.id.toLowerCase() === cleanId ||
      p.slug.toLowerCase() === cleanId ||
      p.variety.toLowerCase() === cleanId ||
      p.name.toLowerCase().includes(cleanId)
  );
};

export { getProductImage };
