/**
 * Plantrix Botanics — Category & Collection Data Definitions
 * Complies with docs/DATA_MODEL.md
 */

export type Department = 'PLANTS_BOTANICS' | 'HOME_ESSENTIALS';

export interface DepartmentInfo {
  id: Department;
  title: string;
  subtitle: string;
  description: string;
  slug: string;
}

export const DEPARTMENTS: Record<Department, DepartmentInfo> = {
  PLANTS_BOTANICS: {
    id: 'PLANTS_BOTANICS',
    title: 'Plants & Botanics',
    subtitle: 'Living greenery & curated garden craft',
    description: 'Indoor plants, handcrafted planters, plant stands, botanical care, and greenery accessories for calming spaces.',
    slug: 'plants-botanics',
  },
  HOME_ESSENTIALS: {
    id: 'HOME_ESSENTIALS',
    title: 'Home & Everyday Essentials',
    subtitle: 'Functional elegance for modern living',
    description: 'Thoughtfully designed kitchen utilities, smart storage, bathroom organization, and everyday problem-solvers.',
    slug: 'home-essentials',
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
