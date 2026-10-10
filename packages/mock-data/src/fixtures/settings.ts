import type { BrandSettings } from '@twa/shared';

export const brandSettings: BrandSettings = {
  name: 'TWA Fashion',
  tagline: 'Crafted for the Modern Indian Wardrobe',
  logoUrl: '/logo.svg',
  supportEmail: 'hello@twafashion.in',
  supportPhone: '+91 98765 43210',
  social: {
    instagramHandle: '@the_witty_alley',
    instagramUrl: 'https://instagram.com/the_witty_alley',
    facebookUrl: 'https://facebook.com/twafashion',
    twitterUrl: 'https://twitter.com/twafashion',
  },
};

export const sellerGstDetails = {
  legalName: 'TWA Fashion Pvt. Ltd.',
  gstin: '27AABCT1234F1Z5',
  stateCode: '27',
  address: {
    fullName: 'TWA Fashion Pvt. Ltd.',
    phone: '+91 98765 43210',
    line1: '101, Fashion Hub, Linking Road',
    line2: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    stateCode: '27',
    pincode: '400050',
    country: 'India',
  },
};

export const policySections = [
  {
    id: 'pol_shipping',
    title: 'Shipping Policy',
    content:
      'We ship across India within 3-7 business days. Free shipping on orders above ₹1,999. Express delivery available in metro cities for an additional ₹149.',
    sortOrder: 1,
  },
  {
    id: 'pol_returns',
    title: 'Returns & Exchanges',
    content:
      'Returns accepted within 7 days of delivery for unworn items with original tags. Customized products are non-returnable. Exchange available for size issues within 14 days.',
    sortOrder: 2,
  },
  {
    id: 'pol_privacy',
    title: 'Privacy Policy',
    content:
      'We collect only essential data to process orders and improve your experience. We never sell your personal information to third parties. Payment data is encrypted and processed securely.',
    sortOrder: 3,
  },
  {
    id: 'pol_terms',
    title: 'Terms of Service',
    content:
      'By using TWA Fashion, you agree to our terms. All prices are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify product availability and pricing.',
    sortOrder: 4,
  },
];

export const aboutContent = {
  brandStory:
    'Founded in Mumbai in 2018, TWA Fashion blends traditional Indian craftsmanship with contemporary design. Every piece is thoughtfully curated to celebrate the modern Indian wardrobe.',
  mission:
    'To make premium, sustainable fashion accessible to every Indian household while supporting local artisans and ethical manufacturing practices.',
  team: [
    {
      name: 'Rupansh Agarwal',
      role: 'Founder & Creative Director',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    },
    {
      name: 'Aditi Verma',
      role: 'Head of Design',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    },
    {
      name: 'Sameer Khan',
      role: 'Operations Lead',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
  ],
};
