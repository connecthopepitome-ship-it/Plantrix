/**
 * Plantrix Botanics — Category Taxonomy & Dynamic Attribute Engine
 * Complies with Section 4 and 5 of MEESHO PRODUCT SOURCING SPECIFICATION
 */

import { Department } from '@/types/category';
import { CategoryAttribute } from '@/types/sourcing';

export interface TaxonomySubcategory {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

export interface TaxonomyCategory {
  id: string;
  departmentId: Department;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  subcategories: TaxonomySubcategory[];
}

export const INITIAL_TAXONOMY: TaxonomyCategory[] = [
  // ==========================================
  // 1. GARDEN & OUTDOOR
  // ==========================================
  {
    id: 'garden-tools',
    departmentId: 'GARDEN_OUTDOOR',
    name: 'Garden Tools',
    slug: 'garden-tools',
    description: 'Ergonomic hand tools, pruning shears, and garden maintenance implements',
    active: true,
    subcategories: [
      { id: 'gt-sets', name: 'Gardening Tool Sets', slug: 'gardening-tool-sets', active: true },
      { id: 'gt-trowels', name: 'Hand Trowels & Cultivators', slug: 'hand-trowels-cultivators', active: true },
      { id: 'gt-pruners', name: 'Pruning & Cutting Tools', slug: 'pruning-cutting-tools', active: true },
      { id: 'gt-gloves', name: 'Garden Gloves & Protection', slug: 'garden-gloves', active: true },
      { id: 'gt-watering-cans', name: 'Watering Cans & Vessels', slug: 'watering-cans', active: true },
      { id: 'gt-hoses', name: 'Garden Hoses & Brass Nozzles', slug: 'garden-hoses-nozzles', active: true },
      { id: 'gt-sprayers', name: 'Pressure Sprayers & Misters', slug: 'sprayers-misters', active: true },
      { id: 'gt-supports', name: 'Plant Ties, Stakes & Trellises', slug: 'plant-ties-supports', active: true },
      { id: 'gt-storage', name: 'Garden Tool Storage & Totes', slug: 'garden-tool-storage', active: true },
      { id: 'gt-other', name: 'Specialty Gardening Accessories', slug: 'specialty-gardening', active: true },
    ],
  },
  {
    id: 'pots-planters',
    departmentId: 'GARDEN_OUTDOOR',
    name: 'Pots & Planters',
    slug: 'pots-planters',
    description: 'Ceramic, terracotta, self-watering, and decorative planting vessels',
    active: true,
    subcategories: [
      { id: 'pp-ceramic', name: 'Ceramic & Stoneware Pots', slug: 'ceramic-pots', active: true },
      { id: 'pp-terracotta', name: 'Handcrafted Terracotta Pots', slug: 'terracotta-pots', active: true },
      { id: 'pp-self-watering', name: 'Self-Watering Sub-Irrigation Planters', slug: 'self-watering-planters', active: true },
      { id: 'pp-hanging', name: 'Hanging & Macramé Planters', slug: 'hanging-planters', active: true },
      { id: 'pp-wall', name: 'Wall-Mounted Planters & Pockets', slug: 'wall-planters', active: true },
      { id: 'pp-stands', name: 'Plant Stands & Pot Risers', slug: 'plant-stands-holders', active: true },
      { id: 'pp-growbags', name: 'Heavy-Duty Fabric Grow Bags', slug: 'grow-bags', active: true },
      { id: 'pp-seedling', name: 'Seedling Propagation Trays', slug: 'seedling-trays', active: true },
      { id: 'pp-decorative', name: 'Sculptural & Art Deco Planters', slug: 'decorative-planters', active: true },
      { id: 'pp-plastic', name: 'UV-Stabilized Nursery Pots', slug: 'plastic-pots', active: true },
    ],
  },
  {
    id: 'plant-care',
    departmentId: 'GARDEN_OUTDOOR',
    name: 'Plant Care & Growing',
    slug: 'plant-care',
    description: 'Organic potting media, nutrient solutions, and propagation equipment',
    active: true,
    subcategories: [
      { id: 'pc-media', name: 'Potting Soil & Perlite Blends', slug: 'growing-media', active: true },
      { id: 'pc-cocopeat', name: 'Washed Coco Peat & Husk Chips', slug: 'coco-peat-chips', active: true },
      { id: 'pc-nutrients', name: 'Bio-Fertilizer & Liquid Kelp Feeds', slug: 'fertilizer-nutrition', active: true },
      { id: 'pc-propagation', name: 'Rooting Hormone & Glass Hydroponics', slug: 'propagation-accessories', active: true },
      { id: 'pc-seeds', name: 'Heirloom & Microgreen Seeds', slug: 'seeds', active: true },
      { id: 'pc-labels', name: 'Botanical Slate & Copper Markers', slug: 'plant-labels', active: true },
      { id: 'pc-pest', name: 'Neem Oil & Natural Pest Deterrents', slug: 'pest-management', active: true },
    ],
  },
  {
    id: 'outdoor-balcony',
    departmentId: 'GARDEN_OUTDOOR',
    name: 'Outdoor & Balcony',
    slug: 'outdoor-balcony',
    description: 'Weatherproof balconies, garden fencing, solar illumination, and outdoor accents',
    active: true,
    subcategories: [
      { id: 'ob-decor', name: 'Garden Sculptures & Wind Chimes', slug: 'garden-decor', active: true },
      { id: 'ob-storage', name: 'Deck Boxes & Weatherproof Storage', slug: 'outdoor-storage', active: true },
      { id: 'ob-balcony', name: 'Railing Planters & Privacy Screens', slug: 'balcony-accessories', active: true },
      { id: 'ob-lighting', name: 'Solar Warm Garden Lanterns', slug: 'garden-lighting', active: true },
      { id: 'ob-fencing', name: 'Border Fencing & Edge Edging', slug: 'garden-fencing-edging', active: true },
    ],
  },

  // ==========================================
  // 2. KITCHEN TOOLS & UTILITIES
  // ==========================================
  {
    id: 'food-prep',
    departmentId: 'KITCHEN_TOOLS',
    name: 'Food Preparation',
    slug: 'food-prep',
    description: 'Precision choppers, stainless steel peelers, graters, and measuring tools',
    active: true,
    subcategories: [
      { id: 'fp-choppers', name: 'Multi-Blade Rotary & Pull Choppers', slug: 'choppers', active: true },
      { id: 'fp-peelers', name: 'Y-Peelers & Julienne Cutters', slug: 'peelers', active: true },
      { id: 'fp-graters', name: 'Zesters & Mandoline Slicers', slug: 'graters-slicers', active: true },
      { id: 'fp-boards', name: 'End-Grain Bamboo Cutting Boards', slug: 'cutting-boards', active: true },
      { id: 'fp-knives', name: 'Damascus & Chef Knife Sets', slug: 'knives-sets', active: true },
      { id: 'fp-scissors', name: 'Heavy-Duty Poultry & Herb Scissors', slug: 'kitchen-scissors', active: true },
      { id: 'fp-juicers', name: 'Cast-Iron Citrus & Manual Juicers', slug: 'manual-juicers', active: true },
      { id: 'fp-measuring', name: 'Graduated Measuring Cups & Spoons', slug: 'measuring-tools', active: true },
      { id: 'fp-mixing', name: 'Non-Slip Stainless Steel Mixing Bowls', slug: 'mixing-bowls', active: true },
      { id: 'fp-sieves', name: 'Fine-Mesh Flour Strainers & Colanders', slug: 'strainers-sieves', active: true },
    ],
  },
  {
    id: 'cooking-tools',
    departmentId: 'KITCHEN_TOOLS',
    name: 'Cooking Tools & Utensils',
    slug: 'cooking-tools',
    description: 'Heat-resistant silicone spatulas, cast-iron oil pourers, and tongs',
    active: true,
    subcategories: [
      { id: 'ct-spatulas', name: 'Heat-Proof Silicone Spatulas & Turners', slug: 'spatulas-turners', active: true },
      { id: 'ct-ladles', name: 'Deep Ladles & Skimming Spoons', slug: 'ladles-serving-spoons', active: true },
      { id: 'ct-tongs', name: 'Silicone-Tipped Locking Tongs', slug: 'tongs', active: true },
      { id: 'ct-dispensers', name: 'Drip-Free Glass Oil Dispensers', slug: 'oil-dispensers', active: true },
      { id: 'ct-sets', name: 'Teak Wood Cooking Utensil Sets', slug: 'cooking-utensil-sets', active: true },
      { id: 'ct-baking', name: 'Silicone Baking Mats & Pastry Brushes', slug: 'baking-accessories', active: true },
    ],
  },
  {
    id: 'kitchen-storage',
    departmentId: 'KITCHEN_TOOLS',
    name: 'Kitchen Storage & Organization',
    slug: 'kitchen-storage',
    description: 'Airtight containers, revolving spice racks, and under-sink organizers',
    active: true,
    subcategories: [
      { id: 'ks-containers', name: 'Airtight Borosilicate Glass Jars', slug: 'storage-containers', active: true },
      { id: 'ks-spiceracks', name: 'Revolving Stainless Spice Carousels', slug: 'spice-racks', active: true },
      { id: 'ks-cutlery', name: 'Expandable Bamboo Cutlery Trays', slug: 'cutlery-organizers', active: true },
      { id: 'ks-dishracks', name: 'Over-The-Sink Stainless Dish Drainers', slug: 'dish-racks', active: true },
      { id: 'ks-trolleys', name: 'Multi-Tier Rolling Kitchen Carts', slug: 'kitchen-trolleys', active: true },
      { id: 'ks-fridge', name: 'Clear PET Refrigerator Bins', slug: 'refrigerator-organizers', active: true },
      { id: 'ks-sink-org', name: 'Telescopic Sink Sponge Caddies', slug: 'sink-organizers', active: true },
    ],
  },
  {
    id: 'kitchen-cleaning',
    departmentId: 'KITCHEN_TOOLS',
    name: 'Kitchen Cleaning & Sink Accessories',
    slug: 'kitchen-cleaning',
    description: 'Ergonomic sink scrubbers, microfiber cloths, and soap dispensers',
    active: true,
    subcategories: [
      { id: 'kc-scrubbers', name: 'Natural Sisal & Coconut Fiber Brushes', slug: 'scrubbers-brushes', active: true },
      { id: 'kc-cloths', name: 'Waffle-Weave Microfiber Dish Towels', slug: 'kitchen-cloths', active: true },
      { id: 'kc-dispensers', name: 'Touchless Sensor Soap Dispensers', slug: 'cleaning-dispensers', active: true },
      { id: 'kc-faucets', name: '360° Swivel Aerator Faucet Extenders', slug: 'faucet-extensions', active: true },
      { id: 'kc-draining', name: 'Roll-Up Heat-Resistant Draining Mats', slug: 'draining-accessories', active: true },
    ],
  },

  // ==========================================
  // 3. HOME & EVERYDAY ESSENTIALS
  // ==========================================
  {
    id: 'home-organization',
    departmentId: 'HOME_ESSENTIALS',
    name: 'Home Organization',
    slug: 'home-organization',
    description: 'Fabric storage cubes, wardrobe organizers, and cable tidies',
    active: true,
    subcategories: [
      { id: 'ho-boxes', name: 'Foldable Linen Storage Cubes', slug: 'storage-boxes', active: true },
      { id: 'ho-wardrobe', name: 'Hanging Closet Shelves & Shoe Organizers', slug: 'wardrobe-organizers', active: true },
      { id: 'ho-drawers', name: 'Honeycomb Drawer Divider Sets', slug: 'drawer-organizers', active: true },
      { id: 'ho-cables', name: 'Silicone Cable Clips & Cord Concealers', slug: 'cable-organizers', active: true },
      { id: 'ho-underbed', name: 'Zippered Under-Bed Dustproof Cases', slug: 'under-bed-storage', active: true },
      { id: 'ho-racks', name: 'Foldable Metal Utility Storage Racks', slug: 'multipurpose-racks', active: true },
    ],
  },
  {
    id: 'cleaning-maintenance',
    departmentId: 'HOME_ESSENTIALS',
    name: 'Cleaning & Floor Care',
    slug: 'cleaning-maintenance',
    description: 'Flat spin mops, telescopic dusters, and lint removers',
    active: true,
    subcategories: [
      { id: 'cm-mops', name: 'Microfiber Flat & Spray Spin Mops', slug: 'mops-floor-cleaning', active: true },
      { id: 'cm-dusters', name: 'Telescopic Bendable Electrostatic Dusters', slug: 'dusters', active: true },
      { id: 'cm-brooms', name: 'Ergonomic Dustpan & Comb Broom Sets', slug: 'dustpans-brooms', active: true },
      { id: 'cm-window', name: 'Magnetic Double-Sided Window Cleaners', slug: 'window-cleaning', active: true },
      { id: 'cm-drain', name: 'Stainless Steel Drain Snake Clog Removers', slug: 'drain-cleaning', active: true },
    ],
  },
  {
    id: 'bathroom-utility',
    departmentId: 'HOME_ESSENTIALS',
    name: 'Bathroom & Utility',
    slug: 'bathroom-utility',
    description: 'Adhesive shower caddies, soap pumps, and laundry hampers',
    active: true,
    subcategories: [
      { id: 'bu-caddies', name: 'Rust-Proof Matte Black Shower Caddies', slug: 'bathroom-racks', active: true },
      { id: 'bu-soap', name: 'Automatic Frothing Soap Dispensers', slug: 'soap-holders', active: true },
      { id: 'bu-toothbrush', name: 'UV Sanitizing Toothbrush Holders', slug: 'toothbrush-holders', active: true },
      { id: 'bu-laundry', name: 'Collapsible Mesh Laundry Baskets', slug: 'laundry-accessories', active: true },
      { id: 'bu-hooks', name: 'Waterproof Vacuum Suction Hooks', slug: 'hooks-holders', active: true },
    ],
  },
  {
    id: 'home-hardware',
    departmentId: 'HOME_ESSENTIALS',
    name: 'Home Tools & Hardware',
    slug: 'home-hardware',
    description: 'Precision magnetic screwdrivers, damage-free adhesive hooks, and level gauges',
    active: true,
    subcategories: [
      { id: 'hh-screwdrivers', name: 'Multi-Bit Magnetic Precision Sets', slug: 'screwdriver-sets', active: true },
      { id: 'hh-handtools', name: 'Claw Hammers, Pliers & Multi-Tools', slug: 'hand-tools', active: true },
      { id: 'hh-hooks', name: 'Heavy-Duty Damage-Free Command Hooks', slug: 'adhesive-hooks', active: true },
      { id: 'hh-measuring', name: 'Digital Laser & Steel Tape Measures', slug: 'measuring-tools', active: true },
      { id: 'hh-fasteners', name: 'Wall Anchors, Screws & Bracket Assortments', slug: 'fasteners-fixings', active: true },
      { id: 'hh-repair', name: 'Waterproof Sealant Tapes & Glues', slug: 'small-repair', active: true },
    ],
  },
  {
    id: 'home-accessories',
    departmentId: 'HOME_ESSENTIALS',
    name: 'Home Decor & Accessories',
    slug: 'home-accessories',
    description: 'Accent trays, decorative hooks, aroma diffusers, and table organizers',
    active: true,
    subcategories: [
      { id: 'ha-organizers', name: 'Minimalist Entryway Catchall Trays', slug: 'decorative-organizers', active: true },
      { id: 'ha-solutions', name: 'Space-Saving Corner Shelves', slug: 'small-space-solutions', active: true },
      { id: 'ha-everyday', name: 'Everyday Practical Problem Solvers', slug: 'everyday-utility', active: true },
    ],
  },
];

// ==========================================
// CANONICAL CATEGORY ATTRIBUTES (Dynamic Schemas)
// ==========================================
export const DEFAULT_CATEGORY_ATTRIBUTES: CategoryAttribute[] = [
  // Garden Attributes
  {
    attributeKey: 'pot_material',
    displayName: 'Pot Material',
    dataType: 'select',
    options: ['Ceramic', 'Terracotta', 'Plastic / HDPE', 'Stoneware', 'Fiberglass', 'Fabric', 'Metal'],
    departmentId: 'GARDEN_OUTDOOR',
    categoryId: 'pots-planters',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: true,
    isSeoMetadata: true,
    sourceMappings: [{ sourcePlatform: 'MEESHO', sourceAttributeKey: 'Material' }],
  },
  {
    attributeKey: 'pot_diameter_cm',
    displayName: 'Pot Diameter',
    dataType: 'number',
    unit: 'cm',
    departmentId: 'GARDEN_OUTDOOR',
    categoryId: 'pots-planters',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: false,
    isSeoMetadata: false,
    sourceMappings: [
      { sourcePlatform: 'MEESHO', sourceAttributeKey: 'Diameter' },
      { sourcePlatform: 'MEESHO', sourceAttributeKey: 'Product Breadth' },
    ],
  },
  {
    attributeKey: 'drainage_hole',
    displayName: 'Drainage Aperture',
    dataType: 'boolean',
    departmentId: 'GARDEN_OUTDOOR',
    categoryId: 'pots-planters',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: false,
    isSeoMetadata: true,
    sourceMappings: [{ sourcePlatform: 'MEESHO', sourceAttributeKey: 'Drainage' }],
  },
  {
    attributeKey: 'self_watering',
    displayName: 'Self-Watering Sub-Irrigation',
    dataType: 'boolean',
    departmentId: 'GARDEN_OUTDOOR',
    categoryId: 'pots-planters',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: true,
    isSeoMetadata: true,
  },
  {
    attributeKey: 'tool_material',
    displayName: 'Tool Blade Material',
    dataType: 'select',
    options: ['Stainless Steel', 'Carbon Steel', 'Cast Aluminum', 'Titanium Coated', 'Brass'],
    departmentId: 'GARDEN_OUTDOOR',
    categoryId: 'garden-tools',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: true,
    isSeoMetadata: true,
  },
  
  // Kitchen Attributes
  {
    attributeKey: 'food_contact_safe',
    displayName: 'Food Contact Safe (BPA Free)',
    dataType: 'boolean',
    departmentId: 'KITCHEN_TOOLS',
    categoryId: 'food-prep',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: true,
    isSeoMetadata: true,
  },
  {
    attributeKey: 'dishwasher_safe',
    displayName: 'Dishwasher Safe',
    dataType: 'boolean',
    departmentId: 'KITCHEN_TOOLS',
    categoryId: 'food-prep',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: true,
    isSeoMetadata: false,
  },
  {
    attributeKey: 'piece_count',
    displayName: 'Piece Count / Set Size',
    dataType: 'number',
    unit: 'pcs',
    departmentId: 'KITCHEN_TOOLS',
    categoryId: 'cooking-tools',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: true,
    isSeoMetadata: false,
    sourceMappings: [
      { sourcePlatform: 'MEESHO', sourceAttributeKey: 'Set Of' },
      { sourcePlatform: 'MEESHO', sourceAttributeKey: 'Net Quantity (N)' },
    ],
  },
  {
    attributeKey: 'kitchen_material',
    displayName: 'Primary Material',
    dataType: 'select',
    options: ['Food-Grade Silicone', 'Borosilicate Glass', '304 Stainless Steel', 'Teak Wood', 'Cast Iron', 'BPA-Free Acrylic'],
    departmentId: 'KITCHEN_TOOLS',
    categoryId: 'kitchen-storage',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: true,
    isSeoMetadata: true,
    sourceMappings: [{ sourcePlatform: 'MEESHO', sourceAttributeKey: 'Material' }],
  },

  // Home Organization & Hardware Attributes
  {
    attributeKey: 'installation_type',
    displayName: 'Installation Method',
    dataType: 'select',
    options: ['Damage-Free Adhesive', 'Wall Anchored (Screw)', 'Magnetic Mount', 'Suction Cup', 'Freestanding'],
    departmentId: 'HOME_ESSENTIALS',
    categoryId: 'bathroom-utility',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: true,
    isSeoMetadata: true,
  },
  {
    attributeKey: 'load_capacity_kg',
    displayName: 'Maximum Load Capacity',
    dataType: 'number',
    unit: 'kg',
    departmentId: 'HOME_ESSENTIALS',
    categoryId: 'home-organization',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: false,
    isSeoMetadata: false,
  },
  {
    attributeKey: 'foldable',
    displayName: 'Collapsible / Foldable',
    dataType: 'boolean',
    departmentId: 'HOME_ESSENTIALS',
    categoryId: 'home-organization',
    isRequired: false,
    isFilterable: true,
    isStorefrontVisible: true,
    isSearchable: true,
    isSeoMetadata: false,
  },
];
