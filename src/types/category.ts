/**
 * Plantrix Botanics — Category & Collection Data Definitions
 * Complies with docs/DATA_MODEL.md
 */

export type Department =
  | 'GARDEN_OUTDOOR'
  | 'KITCHEN_TOOLS'
  | 'HOME_ESSENTIALS'
  | 'CLEANING_IMPROVEMENT'
  | 'STORAGE_ORGANIZATION'
  | 'TOOLS_HARDWARE'
  | 'PLANTS_BOTANICS'; // Backwards compatibility for existing storefront routes

export interface DepartmentInfo {
  id: Department;
  title: string;
  subtitle: string;
  description: string;
  slug: string;
}

export const DEPARTMENTS: Record<Department, DepartmentInfo> = {
  GARDEN_OUTDOOR: {
    id: 'GARDEN_OUTDOOR',
    title: 'Garden & Outdoor',
    subtitle: 'Living greenery, planters & garden craft',
    description: 'Gardening tool sets, ceramic & terracotta pots, grow bags, seeds, plant nutrition, and outdoor decor.',
    slug: 'garden-outdoor',
  },
  KITCHEN_TOOLS: {
    id: 'KITCHEN_TOOLS',
    title: 'Kitchen Tools & Utilities',
    subtitle: 'Culinary precision & kitchen efficiency',
    description: 'Food prep tools, oil dispensers, cooking utensil sets, dish racks, spice organizers, and smart kitchen fixtures.',
    slug: 'kitchen-tools',
  },
  HOME_ESSENTIALS: {
    id: 'HOME_ESSENTIALS',
    title: 'Home & Everyday Essentials',
    subtitle: 'Functional elegance for modern living',
    description: 'Thoughtfully designed organizers, bathroom racks, cleaning accessories, and everyday household problem-solvers.',
    slug: 'home-essentials',
  },
  CLEANING_IMPROVEMENT: {
    id: 'CLEANING_IMPROVEMENT',
    title: 'Home Cleaning & Improvement',
    subtitle: 'Effortless home care & maintenance',
    description: 'Microfiber scrubbers, precision dusters, floor cleaning accessories, sink cleaning brushes, and maintenance tools.',
    slug: 'cleaning-improvement',
  },
  STORAGE_ORGANIZATION: {
    id: 'STORAGE_ORGANIZATION',
    title: 'Storage & Organization',
    subtitle: 'Clutter-free order for every room',
    description: 'Modular storage boxes, wardrobe organizers, drawer dividers, shoe racks, and under-bed storage containers.',
    slug: 'storage-organization',
  },
  TOOLS_HARDWARE: {
    id: 'TOOLS_HARDWARE',
    title: 'Tools, Hardware & Accessories',
    subtitle: 'Household repair & installation craft',
    description: 'Hand tools, precision screwdriver kits, adhesive hooks, wall-mounting hardware, and household repair accessories.',
    slug: 'tools-hardware',
  },
  PLANTS_BOTANICS: {
    id: 'PLANTS_BOTANICS',
    title: 'Plants & Botanics',
    subtitle: 'Living greenery & curated garden craft',
    description: 'Indoor plants, handcrafted planters, plant stands, botanical care, and greenery accessories for calming spaces.',
    slug: 'plants-botanics',
  },
};

export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  department: Department;
  description?: string;
  imageKey?: string;
  parentCategoryId?: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  collectionId: string;
  title: string;
  slug: string;
  department?: Department;
  description?: string;
  imageKey?: string;
  productIds?: string[];
  active: boolean;
  sortOrder: number;
}
