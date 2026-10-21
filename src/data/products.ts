import { PublicProduct } from '@/types/product';

export interface CatalogItem extends Omit<PublicProduct, 'createdAt'> {
  createdAt?: string;
  badge?: string;
  categoryLabel?: string;
  specsSummary?: string;
  dimensionsSummary?: string;
}

export const CATALOG_PRODUCTS: CatalogItem[] = [
  // -------------------------------------------------------------
  // PLANTS & BOTANICS
  // -------------------------------------------------------------
  {
    productId: 'pb-01',
    sku: 'PLX-POT-001',
    slug: 'sculptural-ribbed-fluted-planter',
    name: 'Sculptural Ribbed Fluted Planter',
    shortDescription: 'Textured fluted ceramic vessel engineered with internal drainage reservoir for architectural specimens.',
    description: 'Meticulously crafted from high-density ceramic clay with a fluted exterior texture and speckled terrazzo undertone. Formulated for indoor botanical longevity with integrated drainage dish.',
    department: 'PLANTS_BOTANICS',
    categoryId: 'pots-planters',
    brand: 'Plantrix Studio',
    sellingPricePaise: 189900, // ₹1,899
    compareAtPricePaise: 249900, // ₹2,499
    stock: 3,
    status: 'ACTIVE',
    featured: true,
    trending: true,
    newArrival: false,
    badge: '-24% OFF • Low Stock',
    categoryLabel: 'Architectural Pots',
    specsSummary: 'Matte Olive / Terrazzo',
    dimensionsSummary: '18cm DIA × 20cm H',
    imageKeys: ['pot-fluted-olive'],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChZEoXATYlvmGWZelVPp1BnGn2Kn0uXCb_4z0RZJ7UNgfEC5HA3Mw0QyqXAloqIvG3BTw1vw_gKL6mGvS47C79fqIUWdjJxB3PAKnzDvSSzI1RptTaRDvpfOrhk7wQQjmq1X3DbkUkfIPtuXurRODwYZsQxszHjLf0Gg6NebTdxL8mj3tHuRlN2NZpqIkkuthFvnx5jgMTAJZ-tjqb2dUUL-Rjqkh1ODNTBVyYgRp4nUOltgbA5KtG',
    ],
    highlights: [
      'Matte exterior with tactile ribbed fluting',
      'Engineered base drainage with discrete catch plate',
      'High thermal inertia protects sensitive roots',
      'Safe courier packaging across India',
    ],
  },
  {
    productId: 'pb-02',
    sku: 'PLX-MIS-002',
    slug: 'brass-mist-dew-spray-vessel',
    name: 'Brass Mist & Dew Spray Vessel',
    shortDescription: 'Solid spun brass micro-droplet misting device with vintage pneumatic pump.',
    description: 'Precision engineered from solid brushed brass to deliver an ultra-fine botanical mist. Optimal for tropical broadleaf foliage, humidity enrichment, and delicate moss terrariums.',
    department: 'PLANTS_BOTANICS',
    categoryId: 'gardening-tools',
    brand: 'Plantrix Metalworks',
    sellingPricePaise: 129900, // ₹1,299
    compareAtPricePaise: 169900, // ₹1,699
    stock: 14,
    status: 'ACTIVE',
    featured: true,
    trending: false,
    newArrival: true,
    badge: 'Artisan Mold',
    categoryLabel: 'Hydration Vessels',
    specsSummary: 'Brushed Raw Brass',
    dimensionsSummary: '350ml Capacity',
    imageKeys: ['brass-mist-vessel'],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCkjahF4HBMIUs78uk61Y8G31NRpZMxQ38dkiZlJEBXtdYAgMdOgl7-q63H2Bd61TuGBSHsJoCz_hoUM0zlbA2IM51L3_16sY7Xwc6ouHLNsFlfhko6KTSRtWerB_hzyy4tqe1IH0vqdHEAXPsoELDsgNYl4uN82GZdacARfsM8_JF5d4iO-E_ssgYXBADAsixZsFxRU4AF7pfTDgwCa5eCMjV5P3BBdBtsmn8ItdCsB7eisul3LVob',
    ],
    highlights: [
      'Solid rust-resistant brushed brass construction',
      'Pneumatic micro-nozzle distributes 50μm droplet plume',
      'Gentle foliage hydration without root saturation',
      'Weighted ergonomic base prevents tipping',
    ],
  },
  {
    productId: 'pb-03',
    sku: 'PLX-WAL-003',
    slug: 'floating-botanical-wall-sconce',
    name: 'Floating Botanical Wall Sconce',
    shortDescription: 'Architectural blackened bronze wall cradle with laboratory-grade propagation vessel.',
    description: 'Designed to elevate single leaf propagation into a sculptural wall installation. Hand-poured blackened bronze mount holding high-purity borosilicate glass cylinder.',
    department: 'PLANTS_BOTANICS',
    categoryId: 'plant-stands',
    brand: 'Plantrix Foundry',
    sellingPricePaise: 229900, // ₹2,299
    compareAtPricePaise: 299900, // ₹2,999
    stock: 5,
    status: 'ACTIVE',
    featured: true,
    trending: true,
    newArrival: true,
    badge: 'Limited Cast • Batch No. 09',
    categoryLabel: 'Architectural Pots',
    specsSummary: 'Cast Bronze & Glass',
    dimensionsSummary: 'Wall Mounted • 24cm H',
    imageKeys: ['floating-wall-sconce'],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgNsmVUfl6uBv9ZwsHEcwwuPyrR2m5LhvDkQNZF3ol7mY6n7CvxBTbh8rDx03J-KcqRsNsueqh7Azao7MZr5LHcoCYtWKDih95pK3UB6hsFC-eQHjEtTe09Nbevbj1aDa1rRuAJZqeqCrp3B4U-aAn_z1Ktni-JBF5A175Z-zRPrXAUgtkY_oNiEOs06z0NvKGotGLiMtmqNk3gnGfhRFS9EyIIUhZk8k6OYZPJP9BrGFDaiOXVJAj',
    ],
    highlights: [
      'Solid bronze cast with antiqued patina',
      'Removable borosilicate water cylinder for effortless cleaning',
      'Includes concealed mounting hardware and anchors',
    ],
  },
  {
    productId: 'pb-04',
    sku: 'PLX-MON-004',
    slug: 'architectural-monstera-deliciosa',
    name: 'Architectural Monstera Deliciosa (Curated Specimen)',
    shortDescription: 'Vibrant acclimatized Swiss Cheese Plant potted in porous mineral ceramic vessel.',
    description: 'Acclimatized indoor Monstera Deliciosa with distinct fenestrations. Supplied potted in organic nutrient blend with mineral top-dress in an architectural ribbed container.',
    department: 'PLANTS_BOTANICS',
    categoryId: 'indoor-plants',
    brand: 'Plantrix Nursery',
    sellingPricePaise: 249900, // ₹2,499
    compareAtPricePaise: 329900, // ₹3,299
    stock: 8,
    status: 'ACTIVE',
    featured: true,
    trending: true,
    newArrival: false,
    badge: 'Acclimatised Living Specimen',
    categoryLabel: 'Architectural Pots',
    specsSummary: 'Live Specimen + Pot',
    dimensionsSummary: '55-65cm Plant Height',
    imageKeys: ['monstera-specimen'],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATkqoBSmB5eEarq9c5B8Jh0Cw6pA8qte-jsmfekdo_qt2V2R5fAIOWBd-4uiv6rCi6gzl6-vN44Zh_AnNS9Nv2w76x-gLjxFhzqktmwEaVDxiXDEyqzoAIGziodgjyoVwuAubm9Da-Gibnv9-iRykgFRjtYHMi7pB31-1g2vszumZ1N3KyiRz2ZK6A4ZkHJRz_L64wwx_AgE6WxCXtYROnn9dSXW8qCsWM7ByZs3HYQzU36Ui6Hnxd',
    ],
    highlights: [
      'Healthy 14-day nursery acclimatization period',
      'Transit-cushioned foliage protection',
      'Includes personalized botanical care card',
    ],
  },

  // -------------------------------------------------------------
  // HOME & EVERYDAY ESSENTIALS
  // -------------------------------------------------------------
  {
    productId: 'he-01',
    sku: 'PLX-PAN-001',
    slug: 'nordic-modular-pantry-stack-cube',
    name: 'Nordic Modular Pantry Stack Cube',
    shortDescription: 'Airtight smoked borosilicate glass container with precision hermetic silicone seal.',
    description: 'Modular pantry storage system designed to optimize counter and shelf geometry. Crafted from heat-resistant smoked borosilicate glass with airtight silicone seals.',
    department: 'HOME_ESSENTIALS',
    categoryId: 'pantry-storage',
    brand: 'Plantrix Living',
    sellingPricePaise: 149900, // ₹1,499
    compareAtPricePaise: 199900, // ₹1,999
    stock: 12,
    status: 'ACTIVE',
    featured: true,
    trending: true,
    newArrival: false,
    badge: 'Air-Seal Tech',
    categoryLabel: 'Pantry Modular',
    specsSummary: 'Smoked Glass / Ash',
    dimensionsSummary: '1200ml Stackable',
    imageKeys: ['nordic-stack-cube'],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnvzT3bpPx60B4p5J4CKaSI9f_Ygexjc7LfQpjHZ3YmydbRKUHDpUzqskA6CICLpIplWUXIDY_yQgmaVlzMtS7CbRvLLwqsqUD6jVetIP0h6ZmQEyxDPlAMv0v4ZjVnCwAKI6FozmYHw6WDYiCeGUaHSGGZFR_dG16WTzeGIm6qqp2ZQpRuN9ZguQp4nr6dcFM32emoxLDShJcynSuk3BSk-fZTQEi_eaoS1RrhESrWrEfcd80USHw',
    ],
    highlights: [
      'Modular interlocking rim for secure vertical stacking',
      'Food-grade odor-resistant borosilicate glass',
      'Dishwasher safe and BPA-free',
    ],
  },
  {
    productId: 'he-02',
    sku: 'PLX-PAN-002',
    slug: 'airtight-fluted-pantry-canisters-set',
    name: 'Airtight Fluted Pantry Canisters (Set of 3)',
    shortDescription: 'Uniform tall ribbed glass canisters with natural acacia wood airtight sealing lids.',
    description: 'Transform cluttered pantries into tranquil culinary stations. Ribbed exterior glass provides tactile grip, while precision silicone gaskets preserve ingredient freshness.',
    department: 'HOME_ESSENTIALS',
    categoryId: 'pantry-storage',
    brand: 'Plantrix Living',
    sellingPricePaise: 249900, // ₹2,499
    compareAtPricePaise: 319900, // ₹3,199
    stock: 9,
    status: 'ACTIVE',
    featured: true,
    trending: true,
    newArrival: true,
    badge: 'Curated 3-Piece Set',
    categoryLabel: 'Pantry Modular',
    specsSummary: 'Fluted Glass & Acacia',
    dimensionsSummary: '800ml, 1200ml, 1800ml',
    imageKeys: ['canister-set-3'],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhpoN8HoX8_03xi9qNn7j-Vf20GkoFmSHbdgs8uFV1yrBIB8QgOp6sIHRyCiRDY4ah4if1LwnhUYR6DGI1bohw1Hmm52u5bxkrUbT3Nf3qPY3B18nxBojwI31G91Xvu8hRCm4ygs8AWgjpTURzEfGmmLEJYItTCHhWBQwbLXyHM5GvYFHxIcIh1rMsp541QVqZvLzDOFe3wtfdv485lvXtMaLVrQAAZBTJDHpc51wk87ndBTjfzapg',
    ],
    highlights: [
      'Natural grain acacia wooden lids with laser-engraved monogram',
      'Hermetic silicone seal locks out moisture and air',
      'Space-efficient cylindrical footprint',
    ],
  },
  {
    productId: 'he-03',
    sku: 'PLX-DIV-003',
    slug: 'expandable-brass-drawer-divider-set',
    name: 'Expandable Brass Drawer Divider Set',
    shortDescription: 'Spring-loaded brushed brass culinary dividers for bespoke utensil organization.',
    description: 'Engineered for luxury kitchen drawers. Smooth spring tension adjustments fit standard depth drawers without drilling or adhesive residues.',
    department: 'HOME_ESSENTIALS',
    categoryId: 'kitchen-utilities',
    brand: 'Plantrix Metalworks',
    sellingPricePaise: 179900, // ₹1,799
    compareAtPricePaise: 229900, // ₹2,299
    stock: 16,
    status: 'ACTIVE',
    featured: false,
    trending: true,
    newArrival: false,
    badge: 'Spring-Fit Architecture',
    categoryLabel: 'Kitchen Utilities',
    specsSummary: 'Brushed Brass / Rubber Ends',
    dimensionsSummary: '38cm - 54cm Expandable',
    imageKeys: ['drawer-dividers'],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCj1TwmUb91XqgSYQ7GyaDj7eTr0rw8Ksn7mAo3YVAc_jYtrTkxfsG3SE4yJhHiV9KHj0BjhsdQigE_fWOIzvYlh78JhMUJxuk8hU3PCPFPKkM3BjG12OmeK696I4AMqfrDHbnGxYUKxTgBvhEcnvohDdU6I7vU404oBY_IdsX7f12_0hSpkzsFuJPx2rmrFj9cc6itlQjxLqKfW0oVnFy_mdGAcRozhkVFfoCeGSTCvRnUOV9O3Dc_',
    ],
    highlights: [
      'Spring-loaded tension fit holds firmly in place',
      'Protective foam silicone pads prevent drawer scratches',
      'Solid heavy-gauge brass body that will not bow',
    ],
  },
  {
    productId: 'he-04',
    sku: 'PLX-KNF-004',
    slug: 'magnetic-culinary-block-plinth',
    name: 'Architectural Magnetic Knife Plinth',
    shortDescription: 'Free-standing smoked oak monolithic knife block with concealed neodymium array.',
    description: 'Solid smoked European oak block embedded with powerful rare-earth magnets. Displays and protects up to 8 chef knives on dual faces without dulling blade edges.',
    department: 'HOME_ESSENTIALS',
    categoryId: 'kitchen-utilities',
    brand: 'Plantrix Living',
    sellingPricePaise: 289900, // ₹2,899
    compareAtPricePaise: 359900, // ₹3,599
    stock: 6,
    status: 'ACTIVE',
    featured: true,
    trending: false,
    newArrival: true,
    badge: 'Neodymium Core',
    categoryLabel: 'Kitchen Utilities',
    specsSummary: 'Smoked Oak & Cast Iron Base',
    dimensionsSummary: '26cm W × 23cm H × 10cm D',
    imageKeys: ['magnetic-knife-plinth'],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDW_sMvAQq1GYEJ8zGLxgOVeggaeUUFCxD8HD8sxALZcS7LbKPb_VlhSGoXF-bAJfrzw5J2jLeSpsStxaPcbfx7fwzh_WzE6fe4-EdKVE0b7UHMhVTu_jFHyank4yDy5iDeG1PggHEaAMj1103eUe6wGmvqMulGWtkgIB_GHnBHvmr4pIto8vzQLKccy2_qv3GjFyhL4Gwnt8pIsp833zqm9Gh48ZTtAHcJccgQ3Gidq1fyqQyrjurm',
    ],
    highlights: [
      'Dual-sided magnetic retention holds up to 8 blades',
      'Heavy cast iron stabilizing base prevents tip-over',
      'Natural food-safe mineral oil finish',
    ],
  },
];

export function getProductBySlug(slug: string): CatalogItem | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByDepartment(dept: 'PLANTS_BOTANICS' | 'HOME_ESSENTIALS'): CatalogItem[] {
  return CATALOG_PRODUCTS.filter((p) => p.department === dept);
}
