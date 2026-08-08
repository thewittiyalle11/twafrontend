import type { Category } from '@twa/shared';

export const categories: Category[] = [
  {
    id: 'cat_men',
    slug: 'men',
    name: 'Men',
    description: 'Contemporary menswear for every occasion',
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a41?w=600&h=800&fit=crop',
    sortOrder: 1,
  },
  {
    id: 'cat_women',
    slug: 'women',
    name: 'Women',
    description: 'Elegant ethnic and western wear',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
    sortOrder: 2,
  },
  {
    id: 'cat_kids',
    slug: 'kids',
    name: 'Kids',
    description: 'Comfortable styles for little ones',
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop',
    sortOrder: 3,
  },
  {
    id: 'cat_accessories',
    slug: 'accessories',
    name: 'Accessories',
    description: 'Bags, belts, and finishing touches',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
    sortOrder: 4,
  },
  {
    id: 'cat_festive',
    slug: 'festive',
    name: 'Festive',
    description: 'Celebration-ready collections',
    imageUrl: 'https://images.unsplash.com/photo-1583391735258-47b2739512c2?w=600&h=800&fit=crop',
    sortOrder: 5,
  },
  {
    id: 'cat_sustainable',
    slug: 'sustainable',
    name: 'Sustainable',
    description: 'Eco-conscious fashion choices',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop',
    sortOrder: 6,
  },
];
