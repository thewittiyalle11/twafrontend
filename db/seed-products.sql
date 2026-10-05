-- Seeds the 24 products and their primary images from
-- packages/mock-data/src/fixtures/products.ts.
-- Run after db/schema.sql with the intended database selected.

SET @default_customization_options = JSON_ARRAY(
  JSON_OBJECT(
    'key', 'monogram',
    'label', 'Monogram',
    'type', 'text',
    'maxLength', 8,
    'additionalPrice', 199
  ),
  JSON_OBJECT(
    'key', 'threadColor',
    'label', 'Thread Color',
    'type', 'select',
    'choices', JSON_ARRAY(
      JSON_OBJECT('value', 'gold', 'label', 'Gold'),
      JSON_OBJECT('value', 'silver', 'label', 'Silver'),
      JSON_OBJECT('value', 'navy', 'label', 'Navy'),
      JSON_OBJECT('value', 'maroon', 'label', 'Maroon')
    )
  ),
  JSON_OBJECT(
    'key', 'fit',
    'label', 'Fit Preference',
    'type', 'select',
    'choices', JSON_ARRAY(
      JSON_OBJECT('value', 'slim', 'label', 'Slim Fit'),
      JSON_OBJECT('value', 'regular', 'label', 'Regular Fit')
    )
  ),
  JSON_OBJECT(
    'key', 'instructions',
    'label', 'Special Instructions',
    'type', 'textarea',
    'maxLength', 200
  )
);

START TRANSACTION;

INSERT INTO categories (id, slug, name, description, image_url, sort_order) VALUES
  ('cat_men', 'men', 'Men', 'Contemporary menswear for every occasion', 'https://images.unsplash.com/photo-1617137968427-85924c800a41?w=600&h=800&fit=crop', 1),
  ('cat_women', 'women', 'Women', 'Elegant ethnic and western wear', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop', 2),
  ('cat_kids', 'kids', 'Kids', 'Comfortable styles for little ones', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop', 3),
  ('cat_accessories', 'accessories', 'Accessories', 'Bags, belts, and finishing touches', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop', 4),
  ('cat_festive', 'festive', 'Festive', 'Celebration-ready collections', 'https://images.unsplash.com/photo-1583391735258-47b2739512c2?w=600&h=800&fit=crop', 5),
  ('cat_sustainable', 'sustainable', 'Sustainable', 'Eco-conscious fashion choices', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop', 6)
ON DUPLICATE KEY UPDATE
  id = categories.id;

SET @category_men = NULL;
SET @category_women = NULL;
SET @category_kids = NULL;
SET @category_accessories = NULL;
SET @category_festive = NULL;
SET @category_sustainable = NULL;

SELECT id INTO @category_men FROM categories WHERE slug = 'men';
SELECT id INTO @category_women FROM categories WHERE slug = 'women';
SELECT id INTO @category_kids FROM categories WHERE slug = 'kids';
SELECT id INTO @category_accessories FROM categories WHERE slug = 'accessories';
SELECT id INTO @category_festive FROM categories WHERE slug = 'festive';
SELECT id INTO @category_sustainable FROM categories WHERE slug = 'sustainable';

INSERT INTO products (
  id, slug, category_id, name, description, short_description,
  base_price, discount_percent, estimated_delivery_days, is_active,
  tags, customization_options, created_at, updated_at
) VALUES
  ('prod_001', 'linen-summer-kurta-navy', @category_men, 'Linen Summer Kurta — Navy', 'Breathable linen kurta with mandarin collar and side slits. Perfect for warm weather and casual gatherings.', 'Premium linen kurta in navy blue', 2499, 15, 5, TRUE, JSON_ARRAY('new-arrival', 'season-top-pick'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_002', 'cotton-pathani-suit-beige', @category_men, 'Cotton Pathani Suit — Beige', 'Classic pathani suit in soft cotton with embroidered collar. Includes matching salwar.', 'Elegant beige pathani set', 3299, 10, 4, TRUE, JSON_ARRAY('best-seller'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_003', 'silk-nehru-jacket-maroon', @category_men, 'Silk Nehru Jacket — Maroon', 'Structured silk Nehru jacket with subtle self-pattern. Ideal for weddings and festive occasions.', 'Festive silk Nehru jacket', 4599, 20, 6, TRUE, JSON_ARRAY('season-top-pick', 'best-seller'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_004', 'printed-casual-shirt-white', @category_men, 'Printed Casual Shirt — White', 'Lightweight cotton shirt with subtle block print. Relaxed fit for everyday wear.', 'Block print casual shirt', 1299, 0, 3, TRUE, JSON_ARRAY('new-arrival'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_005', 'bandhgala-blazer-charcoal', @category_men, 'Bandhgala Blazer — Charcoal', 'Tailored bandhgala blazer in premium wool blend. Statement piece for formal events.', 'Charcoal bandhgala blazer', 5999, 25, 7, TRUE, JSON_ARRAY('season-top-pick'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_006', 'handloom-dhoti-kurta-cream', @category_men, 'Handloom Dhoti Kurta — Cream', 'Traditional handloom dhoti kurta set with gold border detailing. Crafted by Rajasthani artisans.', 'Artisan handloom set', 3799, 12, 8, TRUE, JSON_ARRAY('best-seller'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_007', 'anarkali-suit-royal-blue', @category_women, 'Anarkali Suit — Royal Blue', 'Flowing anarkali suit with gold zari work and matching dupatta. Floor-length elegance.', 'Royal blue anarkali with dupatta', 4299, 18, 5, TRUE, JSON_ARRAY('new-arrival', 'best-seller'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_008', 'cotton-saree-indigo-block', @category_women, 'Cotton Saree — Indigo Block Print', 'Hand-block printed cotton saree with contrast blouse piece. Lightweight and breathable.', 'Indigo block print saree', 2899, 10, 4, TRUE, JSON_ARRAY('season-top-pick'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_009', 'palazzo-set-peach', @category_women, 'Palazzo Set — Peach', 'Kurta and palazzo co-ord set in soft peach georgette. Delicate embroidery on neckline.', 'Peach georgette palazzo set', 2199, 15, 4, TRUE, JSON_ARRAY('new-arrival'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_010', 'banarasi-silk-saree-red', @category_women, 'Banarasi Silk Saree — Red', 'Authentic Banarasi silk saree with intricate brocade work. Heirloom quality for special occasions.', 'Red Banarasi silk saree', 8999, 22, 7, TRUE, JSON_ARRAY('season-top-pick', 'best-seller'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_011', 'linen-coord-set-olive', @category_women, 'Linen Co-ord Set — Olive', 'Contemporary linen co-ord with crop top and wide-leg pants. Minimal and modern.', 'Olive linen co-ord set', 3499, 8, 5, TRUE, JSON_ARRAY('new-arrival'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_012', 'sharara-set-emerald', @category_women, 'Sharara Set — Emerald Green', 'Festive sharara set with mirror work and sequin detailing. Includes dupatta.', 'Emerald sharara with mirror work', 5499, 20, 6, TRUE, JSON_ARRAY('best-seller', 'season-top-pick'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_013', 'kids-lehenga-pink', @category_kids, 'Kids Lehenga — Pink', 'Adorable pink lehenga choli for girls aged 4-12. Soft fabric with minimal embellishment.', 'Pink lehenga for girls', 1999, 10, 4, TRUE, JSON_ARRAY('new-arrival'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_014', 'boys-kurta-pajama-blue', @category_kids, 'Boys Kurta Pajama — Blue', 'Comfortable cotton kurta pajama set for boys. Easy-care fabric for active kids.', 'Blue kurta pajama for boys', 1499, 5, 3, TRUE, JSON_ARRAY('best-seller'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_015', 'kids-ethnic-jacket-gold', @category_kids, 'Kids Ethnic Jacket — Gold', 'Mini Nehru jacket in gold brocade. Perfect for weddings and family functions.', 'Gold brocade kids jacket', 1799, 12, 5, TRUE, JSON_ARRAY('season-top-pick'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_016', 'kids-dhoti-set-white', @category_kids, 'Kids Dhoti Set — White', 'Traditional white dhoti kurta for boys. Premium cotton with gold trim.', 'White dhoti set for boys', 1699, 0, 4, TRUE, JSON_ARRAY('new-arrival'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_017', 'leather-crossbody-tan', @category_accessories, 'Leather Crossbody Bag — Tan', 'Genuine leather crossbody bag with adjustable strap. Multiple compartments for essentials.', 'Tan leather crossbody', 2499, 15, 3, TRUE, JSON_ARRAY('best-seller'), JSON_ARRAY(), '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_018', 'embroidered-jutti-red', @category_accessories, 'Embroidered Jutti — Red', 'Handcrafted Punjabi jutti with thread embroidery. Cushioned insole for all-day comfort.', 'Red embroidered jutti', 1299, 8, 4, TRUE, JSON_ARRAY('new-arrival'), JSON_ARRAY(), '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_019', 'silk-stole-ivory', @category_accessories, 'Silk Stole — Ivory', 'Lightweight silk stole with hand-rolled edges. Versatile accessory for any outfit.', 'Ivory silk stole', 999, 0, 2, TRUE, JSON_ARRAY('season-top-pick'), JSON_ARRAY(), '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_020', 'brass-clutch-gold', @category_accessories, 'Brass Clutch — Gold', 'Antique-finish brass clutch with chain strap. Statement piece for evening wear.', 'Gold brass evening clutch', 1899, 10, 3, TRUE, JSON_ARRAY('best-seller'), JSON_ARRAY(), '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_021', 'festive-lehenga-burgundy', @category_festive, 'Festive Lehenga — Burgundy', 'Heavy lehenga with zardozi embroidery and can-can lining. Complete bridal party look.', 'Burgundy festive lehenga', 12999, 30, 10, TRUE, JSON_ARRAY('season-top-pick', 'new-arrival'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_022', 'sherwani-ivory-gold', @category_festive, 'Sherwani — Ivory Gold', 'Regal ivory sherwani with gold thread work. Includes stole and matching churidar.', 'Ivory gold wedding sherwani', 15999, 25, 12, TRUE, JSON_ARRAY('season-top-pick', 'best-seller'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_023', 'organic-cotton-kurta-natural', @category_sustainable, 'Organic Cotton Kurta — Natural', 'GOTS-certified organic cotton kurta. Dyed with natural indigo. Zero-waste packaging.', 'Sustainable organic kurta', 2799, 5, 5, TRUE, JSON_ARRAY('new-arrival', 'best-seller'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00'),
  ('prod_024', 'hemp-blend-trousers-charcoal', @category_sustainable, 'Hemp Blend Trousers — Charcoal', 'Eco-friendly hemp-cotton blend trousers. Relaxed fit with elastic waistband.', 'Charcoal hemp blend trousers', 1999, 0, 4, TRUE, JSON_ARRAY('new-arrival'), @default_customization_options, '2026-01-15 00:00:00', '2026-08-01 00:00:00')
ON DUPLICATE KEY UPDATE
  slug = VALUES(slug),
  category_id = VALUES(category_id),
  name = VALUES(name),
  description = VALUES(description),
  short_description = VALUES(short_description),
  base_price = VALUES(base_price),
  discount_percent = VALUES(discount_percent),
  estimated_delivery_days = VALUES(estimated_delivery_days),
  is_active = VALUES(is_active),
  tags = VALUES(tags),
  customization_options = VALUES(customization_options),
  updated_at = VALUES(updated_at);

INSERT INTO product_images (id, product_id, url, alt, sort_order) VALUES
  ('prod_001_img_1', 'prod_001', 'https://images.unsplash.com/photo-1594938298604-c8148c4dae35?w=600&h=800&fit=crop', 'Linen Summer Kurta — Navy', 1),
  ('prod_002_img_1', 'prod_002', 'https://images.unsplash.com/photo-1617137968427-85924c800a41?w=600&h=800&fit=crop', 'Cotton Pathani Suit — Beige', 1),
  ('prod_003_img_1', 'prod_003', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop', 'Silk Nehru Jacket — Maroon', 1),
  ('prod_004_img_1', 'prod_004', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop', 'Printed Casual Shirt — White', 1),
  ('prod_005_img_1', 'prod_005', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=800&fit=crop', 'Bandhgala Blazer — Charcoal', 1),
  ('prod_006_img_1', 'prod_006', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop', 'Handloom Dhoti Kurta — Cream', 1),
  ('prod_007_img_1', 'prod_007', 'https://images.unsplash.com/photo-1583391735258-47b2739512c2?w=600&h=800&fit=crop', 'Anarkali Suit — Royal Blue', 1),
  ('prod_008_img_1', 'prod_008', 'https://images.unsplash.com/photo-1610030459662-538a4a0b4a3f?w=600&h=800&fit=crop', 'Cotton Saree — Indigo Block Print', 1),
  ('prod_009_img_1', 'prod_009', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop', 'Palazzo Set — Peach', 1),
  ('prod_010_img_1', 'prod_010', 'https://images.unsplash.com/photo-1610030459662-538a4a0b4a3f?w=600&h=800&fit=crop', 'Banarasi Silk Saree — Red', 1),
  ('prod_011_img_1', 'prod_011', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop', 'Linen Co-ord Set — Olive', 1),
  ('prod_012_img_1', 'prod_012', 'https://images.unsplash.com/photo-1583391735258-47b2739512c2?w=600&h=800&fit=crop', 'Sharara Set — Emerald Green', 1),
  ('prod_013_img_1', 'prod_013', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop', 'Kids Lehenga — Pink', 1),
  ('prod_014_img_1', 'prod_014', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop', 'Boys Kurta Pajama — Blue', 1),
  ('prod_015_img_1', 'prod_015', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop', 'Kids Ethnic Jacket — Gold', 1),
  ('prod_016_img_1', 'prod_016', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop', 'Kids Dhoti Set — White', 1),
  ('prod_017_img_1', 'prod_017', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop', 'Leather Crossbody Bag — Tan', 1),
  ('prod_018_img_1', 'prod_018', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop', 'Embroidered Jutti — Red', 1),
  ('prod_019_img_1', 'prod_019', 'https://images.unsplash.com/photo-1520903920243-00d744a2ee11?w=600&h=800&fit=crop', 'Silk Stole — Ivory', 1),
  ('prod_020_img_1', 'prod_020', 'https://images.unsplash.com/photo-1566150905458-1bf597814247?w=600&h=800&fit=crop', 'Brass Clutch — Gold', 1),
  ('prod_021_img_1', 'prod_021', 'https://images.unsplash.com/photo-1583391735258-47b2739512c2?w=600&h=800&fit=crop', 'Festive Lehenga — Burgundy', 1),
  ('prod_022_img_1', 'prod_022', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=800&fit=crop', 'Sherwani — Ivory Gold', 1),
  ('prod_023_img_1', 'prod_023', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop', 'Organic Cotton Kurta — Natural', 1),
  ('prod_024_img_1', 'prod_024', 'https://images.unsplash.com/photo-1473966968600-fa801b279ec0?w=600&h=800&fit=crop', 'Hemp Blend Trousers — Charcoal', 1)
ON DUPLICATE KEY UPDATE
  product_id = VALUES(product_id),
  url = VALUES(url),
  alt = VALUES(alt),
  sort_order = VALUES(sort_order);

COMMIT;
