import {
  ProductSize,
  computeEffectivePrice,
  type CustomizationOption,
  type Product,
  type ProductTag,
} from '@twa/shared';

const defaultCustomization: CustomizationOption[] = [
  {
    key: 'monogram',
    label: 'Monogram',
    type: 'text',
    maxLength: 8,
    additionalPrice: 199,
  },
  {
    key: 'threadColor',
    label: 'Thread Color',
    type: 'select',
    choices: [
      { value: 'gold', label: 'Gold' },
      { value: 'silver', label: 'Silver' },
      { value: 'navy', label: 'Navy' },
      { value: 'maroon', label: 'Maroon' },
    ],
  },
  {
    key: 'fit',
    label: 'Fit Preference',
    type: 'select',
    choices: [
      { value: 'slim', label: 'Slim Fit' },
      { value: 'regular', label: 'Regular Fit' },
    ],
  },
  {
    key: 'instructions',
    label: 'Special Instructions',
    type: 'textarea',
    maxLength: 200,
  },
];

interface ProductSeed {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  basePrice: number;
  discountPercent: number;
  tags: ProductTag[];
  imageUrl: string;
  deliveryDays: number;
}

const seeds: ProductSeed[] = [
  { id: 'prod_001', slug: 'linen-summer-kurta-navy', name: 'Linen Summer Kurta — Navy', description: 'Breathable linen kurta with mandarin collar and side slits. Perfect for warm weather and casual gatherings.', shortDescription: 'Premium linen kurta in navy blue', categoryId: 'cat_men', basePrice: 2499, discountPercent: 15, tags: ['new-arrival', 'season-top-pick'], imageUrl: 'https://images.unsplash.com/photo-1594938298604-c8148c4dae35?w=600&h=800&fit=crop', deliveryDays: 5 },
  { id: 'prod_002', slug: 'cotton-pathani-suit-beige', name: 'Cotton Pathani Suit — Beige', description: 'Classic pathani suit in soft cotton with embroidered collar. Includes matching salwar.', shortDescription: 'Elegant beige pathani set', categoryId: 'cat_men', basePrice: 3299, discountPercent: 10, tags: ['best-seller'], imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a41?w=600&h=800&fit=crop', deliveryDays: 4 },
  { id: 'prod_003', slug: 'silk-nehru-jacket-maroon', name: 'Silk Nehru Jacket — Maroon', description: 'Structured silk Nehru jacket with subtle self-pattern. Ideal for weddings and festive occasions.', shortDescription: 'Festive silk Nehru jacket', categoryId: 'cat_men', basePrice: 4599, discountPercent: 20, tags: ['season-top-pick', 'best-seller'], imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop', deliveryDays: 6 },
  { id: 'prod_004', slug: 'printed-casual-shirt-white', name: 'Printed Casual Shirt — White', description: 'Lightweight cotton shirt with subtle block print. Relaxed fit for everyday wear.', shortDescription: 'Block print casual shirt', categoryId: 'cat_men', basePrice: 1299, discountPercent: 0, tags: ['new-arrival'], imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop', deliveryDays: 3 },
  { id: 'prod_005', slug: 'bandhgala-blazer-charcoal', name: 'Bandhgala Blazer — Charcoal', description: 'Tailored bandhgala blazer in premium wool blend. Statement piece for formal events.', shortDescription: 'Charcoal bandhgala blazer', categoryId: 'cat_men', basePrice: 5999, discountPercent: 25, tags: ['season-top-pick'], imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=800&fit=crop', deliveryDays: 7 },
  { id: 'prod_006', slug: 'handloom-dhoti-kurta-cream', name: 'Handloom Dhoti Kurta — Cream', description: 'Traditional handloom dhoti kurta set with gold border detailing. Crafted by Rajasthani artisans.', shortDescription: 'Artisan handloom set', categoryId: 'cat_men', basePrice: 3799, discountPercent: 12, tags: ['best-seller'], imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop', deliveryDays: 8 },
  { id: 'prod_007', slug: 'anarkali-suit-royal-blue', name: 'Anarkali Suit — Royal Blue', description: 'Flowing anarkali suit with gold zari work and matching dupatta. Floor-length elegance.', shortDescription: 'Royal blue anarkali with dupatta', categoryId: 'cat_women', basePrice: 4299, discountPercent: 18, tags: ['new-arrival', 'best-seller'], imageUrl: 'https://images.unsplash.com/photo-1583391735258-47b2739512c2?w=600&h=800&fit=crop', deliveryDays: 5 },
  { id: 'prod_008', slug: 'cotton-saree-indigo-block', name: 'Cotton Saree — Indigo Block Print', description: 'Hand-block printed cotton saree with contrast blouse piece. Lightweight and breathable.', shortDescription: 'Indigo block print saree', categoryId: 'cat_women', basePrice: 2899, discountPercent: 10, tags: ['season-top-pick'], imageUrl: 'https://images.unsplash.com/photo-1610030459662-538a4a0b4a3f?w=600&h=800&fit=crop', deliveryDays: 4 },
  { id: 'prod_009', slug: 'palazzo-set-peach', name: 'Palazzo Set — Peach', description: 'Kurta and palazzo co-ord set in soft peach georgette. Delicate embroidery on neckline.', shortDescription: 'Peach georgette palazzo set', categoryId: 'cat_women', basePrice: 2199, discountPercent: 15, tags: ['new-arrival'], imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop', deliveryDays: 4 },
  { id: 'prod_010', slug: 'banarasi-silk-saree-red', name: 'Banarasi Silk Saree — Red', description: 'Authentic Banarasi silk saree with intricate brocade work. Heirloom quality for special occasions.', shortDescription: 'Red Banarasi silk saree', categoryId: 'cat_women', basePrice: 8999, discountPercent: 22, tags: ['season-top-pick', 'best-seller'], imageUrl: 'https://images.unsplash.com/photo-1610030459662-538a4a0b4a3f?w=600&h=800&fit=crop', deliveryDays: 7 },
  { id: 'prod_011', slug: 'linen-coord-set-olive', name: 'Linen Co-ord Set — Olive', description: 'Contemporary linen co-ord with crop top and wide-leg pants. Minimal and modern.', shortDescription: 'Olive linen co-ord set', categoryId: 'cat_women', basePrice: 3499, discountPercent: 8, tags: ['new-arrival'], imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop', deliveryDays: 5 },
  { id: 'prod_012', slug: 'sharara-set-emerald', name: 'Sharara Set — Emerald Green', description: 'Festive sharara set with mirror work and sequin detailing. Includes dupatta.', shortDescription: 'Emerald sharara with mirror work', categoryId: 'cat_women', basePrice: 5499, discountPercent: 20, tags: ['best-seller', 'season-top-pick'], imageUrl: 'https://images.unsplash.com/photo-1583391735258-47b2739512c2?w=600&h=800&fit=crop', deliveryDays: 6 },
  { id: 'prod_013', slug: 'kids-lehenga-pink', name: 'Kids Lehenga — Pink', description: 'Adorable pink lehenga choli for girls aged 4-12. Soft fabric with minimal embellishment.', shortDescription: 'Pink lehenga for girls', categoryId: 'cat_kids', basePrice: 1999, discountPercent: 10, tags: ['new-arrival'], imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop', deliveryDays: 4 },
  { id: 'prod_014', slug: 'boys-kurta-pajama-blue', name: 'Boys Kurta Pajama — Blue', description: 'Comfortable cotton kurta pajama set for boys. Easy-care fabric for active kids.', shortDescription: 'Blue kurta pajama for boys', categoryId: 'cat_kids', basePrice: 1499, discountPercent: 5, tags: ['best-seller'], imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop', deliveryDays: 3 },
  { id: 'prod_015', slug: 'kids-ethnic-jacket-gold', name: 'Kids Ethnic Jacket — Gold', description: 'Mini Nehru jacket in gold brocade. Perfect for weddings and family functions.', shortDescription: 'Gold brocade kids jacket', categoryId: 'cat_kids', basePrice: 1799, discountPercent: 12, tags: ['season-top-pick'], imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop', deliveryDays: 5 },
  { id: 'prod_016', slug: 'kids-dhoti-set-white', name: 'Kids Dhoti Set — White', description: 'Traditional white dhoti kurta for boys. Premium cotton with gold trim.', shortDescription: 'White dhoti set for boys', categoryId: 'cat_kids', basePrice: 1699, discountPercent: 0, tags: ['new-arrival'], imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop', deliveryDays: 4 },
  { id: 'prod_017', slug: 'leather-crossbody-tan', name: 'Leather Crossbody Bag — Tan', description: 'Genuine leather crossbody bag with adjustable strap. Multiple compartments for essentials.', shortDescription: 'Tan leather crossbody', categoryId: 'cat_accessories', basePrice: 2499, discountPercent: 15, tags: ['best-seller'], imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop', deliveryDays: 3 },
  { id: 'prod_018', slug: 'embroidered-jutti-red', name: 'Embroidered Jutti — Red', description: 'Handcrafted Punjabi jutti with thread embroidery. Cushioned insole for all-day comfort.', shortDescription: 'Red embroidered jutti', categoryId: 'cat_accessories', basePrice: 1299, discountPercent: 8, tags: ['new-arrival'], imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop', deliveryDays: 4 },
  { id: 'prod_019', slug: 'silk-stole-ivory', name: 'Silk Stole — Ivory', description: 'Lightweight silk stole with hand-rolled edges. Versatile accessory for any outfit.', shortDescription: 'Ivory silk stole', categoryId: 'cat_accessories', basePrice: 999, discountPercent: 0, tags: ['season-top-pick'], imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d744a2ee11?w=600&h=800&fit=crop', deliveryDays: 2 },
  { id: 'prod_020', slug: 'brass-clutch-gold', name: 'Brass Clutch — Gold', description: 'Antique-finish brass clutch with chain strap. Statement piece for evening wear.', shortDescription: 'Gold brass evening clutch', categoryId: 'cat_accessories', basePrice: 1899, discountPercent: 10, tags: ['best-seller'], imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf597814247?w=600&h=800&fit=crop', deliveryDays: 3 },
  { id: 'prod_021', slug: 'festive-lehenga-burgundy', name: 'Festive Lehenga — Burgundy', description: 'Heavy lehenga with zardozi embroidery and can-can lining. Complete bridal party look.', shortDescription: 'Burgundy festive lehenga', categoryId: 'cat_festive', basePrice: 12999, discountPercent: 30, tags: ['season-top-pick', 'new-arrival'], imageUrl: 'https://images.unsplash.com/photo-1583391735258-47b2739512c2?w=600&h=800&fit=crop', deliveryDays: 10 },
  { id: 'prod_022', slug: 'sherwani-ivory-gold', name: 'Sherwani — Ivory Gold', description: 'Regal ivory sherwani with gold thread work. Includes stole and matching churidar.', shortDescription: 'Ivory gold wedding sherwani', categoryId: 'cat_festive', basePrice: 15999, discountPercent: 25, tags: ['season-top-pick', 'best-seller'], imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=800&fit=crop', deliveryDays: 12 },
  { id: 'prod_023', slug: 'organic-cotton-kurta-natural', name: 'Organic Cotton Kurta — Natural', description: 'GOTS-certified organic cotton kurta. Dyed with natural indigo. Zero-waste packaging.', shortDescription: 'Sustainable organic kurta', categoryId: 'cat_sustainable', basePrice: 2799, discountPercent: 5, tags: ['new-arrival', 'best-seller'], imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop', deliveryDays: 5 },
  { id: 'prod_024', slug: 'hemp-blend-trousers-charcoal', name: 'Hemp Blend Trousers — Charcoal', description: 'Eco-friendly hemp-cotton blend trousers. Relaxed fit with elastic waistband.', shortDescription: 'Charcoal hemp blend trousers', categoryId: 'cat_sustainable', basePrice: 1999, discountPercent: 0, tags: ['new-arrival'], imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b279ec0?w=600&h=800&fit=crop', deliveryDays: 4 },
];

function buildSizes(prefix: string, stockBase = 10): Product['sizes'] {
  return [ProductSize.S, ProductSize.M, ProductSize.L, ProductSize.XL].map((size, i) => ({
    size,
    sku: `${prefix}-${size}`,
    stock: stockBase - i * 2,
  }));
}

export const products: Product[] = seeds.map((seed) => ({
  id: seed.id,
  slug: seed.slug,
  name: seed.name,
  description: seed.description,
  shortDescription: seed.shortDescription,
  images: [
    {
      id: `${seed.id}_img_1`,
      url: seed.imageUrl,
      alt: seed.name,
      sortOrder: 1,
    },
  ],
  categoryId: seed.categoryId,
  basePrice: seed.basePrice,
  discountPercent: seed.discountPercent,
  effectivePrice: computeEffectivePrice(seed.basePrice, seed.discountPercent),
  sizes: buildSizes(seed.slug.split('-').slice(0, 2).join('-').toUpperCase().slice(0, 6)),
  estimatedDeliveryDays: seed.deliveryDays,
  tags: seed.tags,
  customizationOptions: seed.categoryId === 'cat_accessories' ? [] : defaultCustomization,
  isActive: true,
  createdAt: '2026-01-15T00:00:00Z',
  updatedAt: '2026-08-01T00:00:00Z',
}));
