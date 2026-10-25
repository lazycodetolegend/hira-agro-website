const Company = require('../models/Company');
const Product = require('../models/Product');

const defaultProducts = [
  {
    name: 'Milled White Rice (Steam / Raw)',
    variety: 'Rice',
    ratePerKg: 40,
    unit: 'kg',
    photoUrl: '/images/Milled White Rice.webp',
    description: 'High-grade Sortex-cleaned milled white rice processed with advanced multi-stage destoning, polishing, and optical grading technology. Clean, uniform grains that cook fluffy and separate without sticking. Retains rich natural aroma and essential nutrients. Ideal for daily household consumption, hotels, catering, and wholesale distribution.',
    stockQuantity: 5000,
    lowStockThreshold: 500,
    isAvailable: true,
  },
  {
    name: 'Rice Husk (Paddy Hull Biomass)',
    variety: 'Husk',
    ratePerKg: 6,
    unit: 'kg',
    photoUrl: '/images/Pure Rice Husk.jpg',
    description: 'Clean, dry, and uniformly separated rice husk (paddy hull) extracted during de-husking. Features high calorific value (GCV ~3,000–3,500 kcal/kg) and low moisture content (<10%). Widely utilized as eco-friendly biomass fuel for industrial boilers, brick kilns, briquette manufacturing, cattle bedding, and poultry litter.',
    stockQuantity: 12000,
    lowStockThreshold: 1000,
    isAvailable: true,
  },
  {
    name: 'Broken Rice (Kanki / Khanda)',
    variety: 'Broken Rice',
    ratePerKg: 25,
    unit: 'kg',
    photoUrl: '/images/Broken-Rice.jpg',
    description: 'Premium Sortex-cleaned broken rice grains (Kanki/Tukda) separated during milling and grading. De-stoned, dust-free, and nutrient-dense. Widely used for animal and poultry feed, breweries, starch and glucose processing, rice flour, and idli/dosa batter.',
    stockQuantity: 4000,
    lowStockThreshold: 400,
    isAvailable: true,
  },
  {
    name: 'Indrayani Rice (Maval Fragrant)',
    variety: 'Indrayani',
    ratePerKg: 58,
    unit: 'kg',
    photoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    description: 'Famous indigenous aromatic rice variety cultivated in the Maval and Western Ghats region of Maharashtra. Celebrated for its captivating sweet aroma, medium slender grain, and characteristic soft, sticky texture when cooked. The traditional favorite for daily meals, Varan Bhaat, and dal khichdi.',
    stockQuantity: 6000,
    lowStockThreshold: 500,
    isAvailable: true,
  },
  {
    name: 'Raw Paddy Grain (Dhan / Farm Fresh)',
    variety: 'Paddy',
    ratePerKg: 24,
    unit: 'kg',
    photoUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
    description: 'Harvest-fresh unhulled paddy grain (Dhan) sourced directly from farmer partnerships across Palghar and regional agricultural belts. Pre-cleaned to remove straw, chaff, and field stones. Ideal for commercial rice milling, government procurement, seed aggregation, and storage reserves.',
    stockQuantity: 15000,
    lowStockThreshold: 1000,
    isAvailable: true,
  },
  {
    name: 'Usna Bhat Rice (Parboiled / Traditional Table Rice)',
    variety: 'Bhat',
    ratePerKg: 36,
    unit: 'kg',
    photoUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional parboiled table rice (locally known as Usna Tandul / Ukada Bhat) widely cherished across coastal Maharashtra, Konkan, and Palghar. Hydrothermally parboiled before gentle milling to drive grain nutrients and bran goodness into the core. Cooks firm, non-sticky, and fluffy, making it the most nourishing daily staple for steamed bhat and curries.',
    stockQuantity: 7000,
    lowStockThreshold: 600,
    isAvailable: true,
  },
];

const seedProducts = async () => {
  try {
    const hiraAgro = await Company.findOne({ slug: 'hira-agro' });
    if (!hiraAgro) {
      console.log('⏳ Product seeding skipped — Hira Agro company not found yet');
      return;
    }

    for (const prodData of defaultProducts) {
      const existing = await Product.findOne({
        companyId: hiraAgro._id,
        $or: [
          { variety: prodData.variety },
          { name: prodData.name }
        ]
      });

      if (existing) {
        existing.name = prodData.name;
        existing.variety = prodData.variety;
        existing.ratePerKg = prodData.ratePerKg;
        existing.unit = prodData.unit;
        existing.description = prodData.description;
        existing.photoUrl = prodData.photoUrl;
        existing.isAvailable = prodData.isAvailable;
        if (!existing.stockQuantity || existing.stockQuantity === 0) {
          existing.stockQuantity = prodData.stockQuantity;
        }
        await existing.save();
        console.log(`  🌾 Updated product: ${prodData.name} (₹${prodData.ratePerKg}/kg)`);
      } else {
        await Product.create({
          ...prodData,
          companyId: hiraAgro._id,
        });
        console.log(`  🌾 Created product: ${prodData.name} (₹${prodData.ratePerKg}/kg)`);
      }
    }

    console.log('✅ Core products seeded for Hira Agro Industry');
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
};

module.exports = seedProducts;
