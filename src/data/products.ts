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
  // 1. PLANTS & BOTANICS
  // -------------------------------------------------------------
  {
    productId: 'pb-01',
    sku: 'PLX-POT-001',
    slug: 'sculptural-ribbed-fluted-planter',
    name: 'Sculptural Ribbed Fluted Planter',
    shortDescription: 'Textured fluted ceramic vessel engineered with internal drainage reservoir for architectural specimens.',
    description: 'Meticulously crafted from high-density ceramic clay with a fluted exterior texture and speckled terrazzo undertone. Formulated for indoor botanical longevity with an integrated sub-drainage plate and moisture buffering.',
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
    imageKeys: [
      'pot-fluted-olive-hero',
      'pot-fluted-olive-angle',
      'pot-fluted-olive-lifestyle',
      'pot-fluted-olive-detail',
    ],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChZEoXATYlvmGWZelVPp1BnGn2Kn0uXCb_4z0RZJ7UNgfEC5HA3Mw0QyqXAloqIvG3BTw1vw_gKL6mGvS47C79fqIUWdjJxB3PAKnzDvSSzI1RptTaRDvpfOrhk7wQQjmq1X3DbkUkfIPtuXurRODwYZsQxszHjLf0Gg6NebTdxL8mj3tHuRlN2NZpqIkkuthFvnx5jgMTAJZ-tjqb2dUUL-Rjqkh1ODNTBVyYgRp4nUOltgbA5KtG',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=85',
    ],
    highlights: [
      'Matte exterior with tactile ribbed fluting',
      'Engineered base drainage with discrete catch plate',
      'High thermal inertia protects sensitive root balls',
      'Transit-safe shockproof double-wall packaging',
    ],
    specifications: {
      'Product Type': 'High-Fire Stoneware Planter',
      'Primary Material': 'Ceramic Stoneware & Terrazzo Slip',
      'Finish': 'Speckled Matte Glaze',
      'Drainage': 'Integrated Bottom Aperture with Catch Plate',
      'Indoor / Outdoor': 'Optimized for Indoor & Shaded Balcony Spaces',
      'Dimensions': '18 cm Diameter × 20 cm Height',
      'Weight': '1.8 kg (Empty)',
      'Care Instructions': 'Wipe with damp microfiber cloth. Avoid acidic cleaning detergents.',
    },
    variants: [
      {
        variantId: 'v-01-olive',
        sku: 'PLX-POT-001-OLV',
        label: 'Matte Olive / Standard (18cm)',
        attributes: { size: '18cm DIA', finish: 'Matte Olive' },
        stock: 3,
        active: true,
      },
      {
        variantId: 'v-01-charcoal',
        sku: 'PLX-POT-001-CHR',
        label: 'Speckled Charcoal / Standard (18cm)',
        attributes: { size: '18cm DIA', finish: 'Speckled Charcoal' },
        priceAdjustmentPaise: 20000,
        stock: 5,
        active: true,
      },
      {
        variantId: 'v-01-large',
        sku: 'PLX-POT-001-LRG',
        label: 'Architectural Grande (24cm)',
        attributes: { size: '24cm DIA', finish: 'Matte Olive' },
        priceAdjustmentPaise: 60000,
        stock: 2,
        active: true,
      },
    ],
  },
  {
    productId: 'pb-02',
    sku: 'PLX-MIS-002',
    slug: 'brass-mist-dew-spray-vessel',
    name: 'Brass Mist & Dew Spray Vessel',
    shortDescription: 'Solid spun brass micro-droplet misting device with vintage pneumatic pump.',
    description: 'Precision engineered from solid brushed brass to deliver an ultra-fine botanical mist plume. Optimal for tropical broadleaf foliage, ambient humidity enrichment, and delicate moss terrariums.',
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
    imageKeys: [
      'brass-mist-vessel-hero',
      'brass-mist-vessel-nozzle',
      'brass-mist-vessel-lifestyle',
      'brass-mist-vessel-pump',
    ],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCkjahF4HBMIUs78uk61Y8G31NRpZMxQ38dkiZlJEBXtdYAgMdOgl7-q63H2Bd61TuGBSHsJoCz_hoUM0zlbA2IM51L3_16sY7Xwc6ouHLNsFlfhko6KTSRtWerB_hzyy4tqe1IH0vqdHEAXPsoELDsgNYl4uN82GZdacARfsM8_JF5d4iO-E_ssgYXBADAsixZsFxRU4AF7pfTDgwCa5eCMjV5P3BBdBtsmn8ItdCsB7eisul3LVob',
      'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1200&q=85',
    ],
    highlights: [
      'Solid rust-resistant spun brass construction',
      'Pneumatic micro-nozzle distributes 50μm droplet plume',
      'Gentle foliage hydration without root saturation',
      'Weighted ergonomic base prevents tipping on sills',
    ],
    specifications: {
      'Product Function': 'Botanical Foliage Mister',
      'Material': 'Solid Spun Brass & Brass Mechanism',
      'Finish': 'Hand-Brushed Satin Raw Brass with Protective Clear Coat',
      'Fluid Capacity': '350 ml (12 fl oz)',
      'Droplet Pattern': 'Conical Micro-Mist (50 Micron)',
      'Dimensions': '8.5 cm Base DIA × 15 cm Height',
      'Weight': '420 grams (Dry)',
      'Care Instructions': 'Rinse reservoir monthly with distilled water. Buff with dry cotton.',
    },
    variants: [
      {
        variantId: 'v-02-brass',
        sku: 'PLX-MIS-002-BRS',
        label: 'Raw Brushed Brass (350ml)',
        attributes: { finish: 'Brushed Brass', capacity: '350ml' },
        stock: 14,
        active: true,
      },
      {
        variantId: 'v-02-copper',
        sku: 'PLX-MIS-002-CPR',
        label: 'Antique Aged Copper (350ml)',
        attributes: { finish: 'Aged Copper', capacity: '350ml' },
        priceAdjustmentPaise: 15000,
        stock: 6,
        active: true,
      },
    ],
  },
  {
    productId: 'pb-03',
    sku: 'PLX-WAL-003',
    slug: 'floating-botanical-wall-sconce',
    name: 'Floating Botanical Wall Sconce',
    shortDescription: 'Architectural blackened bronze wall cradle with laboratory-grade propagation vessel.',
    description: 'Designed to elevate single leaf propagation into a sculptural living wall installation. Hand-poured blackened bronze mount holding high-purity borosilicate glass cylinder with concealed magnetic alignment.',
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
    categoryLabel: 'Wall Sculptures',
    specsSummary: 'Cast Bronze & Glass',
    dimensionsSummary: 'Wall Mounted • 24cm H',
    imageKeys: [
      'floating-wall-sconce-hero',
      'floating-wall-sconce-cutting',
      'floating-wall-sconce-bronze',
      'floating-wall-sconce-living',
    ],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAgNsmVUfl6uBv9ZwsHEcwwuPyrR2m5LhvDkQNZF3ol7mY6n7CvxBTbh8rDx03J-KcqRsNsueqh7Azao7MZr5LHcoCYtWKDih95pK3UB6hsFC-eQHjEtTe09Nbevbj1aDa1rRuAJZqeqCrp3B4U-aAn_z1Ktni-JBF5A175Z-zRPrXAUgtkY_oNiEOs06z0NvKGotGLiMtmqNk3gnGfhRFS9EyIIUhZk8k6OYZPJP9BrGFDaiOXVJAj',
      'https://images.unsplash.com/photo-1517196084887-57884878a709?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=85',
    ],
    highlights: [
      'Solid cast bronze with hand-applied antiqued patina',
      'Removable laboratory borosilicate cylinder for easy water changes',
      'Includes concealed mounting hardware and heavy-duty drywall anchors',
    ],
    specifications: {
      'Mounting Type': 'Concealed Keyhole Wall Mount',
      'Material': 'Cast Bronze Alloy & High-Purity Borosilicate Glass',
      'Finish': 'Blackened Patina with Satin Wax Seal',
      'Dimensions': '6 cm W × 10 cm D × 24 cm H',
      'Glass Cylinder Capacity': '180 ml',
      'Installation': 'Drywall anchors and brass flush screws included',
    },
    variants: [
      {
        variantId: 'v-03-single',
        sku: 'PLX-WAL-003-SGL',
        label: 'Single Wall Cradle',
        attributes: { pack: '1 Sconce' },
        stock: 5,
        active: true,
      },
      {
        variantId: 'v-03-pair',
        sku: 'PLX-WAL-003-PR',
        label: 'Duo Diptych Pair (Set of 2)',
        attributes: { pack: '2 Sconces' },
        priceAdjustmentPaise: 199900,
        stock: 3,
        active: true,
      },
    ],
  },
  {
    productId: 'pb-04',
    sku: 'PLX-MON-004',
    slug: 'architectural-monstera-deliciosa',
    name: 'Architectural Monstera Deliciosa (Curated Specimen)',
    shortDescription: 'Vibrant acclimatized Swiss Cheese Plant potted in porous mineral ceramic vessel.',
    description: 'Acclimatized indoor Monstera Deliciosa with distinct mature fenestrations. Supplied potted in organic nutrient substrate with mineral top-dress in an architectural ribbed container.',
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
    categoryLabel: 'Living Botanicals',
    specsSummary: 'Live Specimen + Pot',
    dimensionsSummary: '55-65cm Plant Height',
    imageKeys: [
      'monstera-specimen-hero',
      'monstera-specimen-foliage',
      'monstera-specimen-placement',
      'monstera-specimen-pot',
    ],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATkqoBSmB5eEarq9c5B8Jh0Cw6pA8qte-jsmfekdo_qt2V2R5fAIOWBd-4uiv6rCi6gzl6-vN44Zh_AnNS9Nv2w76x-gLjxFhzqktmwEaVDxiXDEyqzoAIGziodgjyoVwuAubm9Da-Gibnv9-iRykgFRjtYHMi7pB31-1g2vszumZ1N3KyiRz2ZK6A4ZkHJRz_L64wwx_AgE6WxCXtYROnn9dSXW8qCsWM7ByZs3HYQzU36Ui6Hnxd',
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=85',
    ],
    highlights: [
      'Healthy 14-day greenhouse acclimatization period prior to dispatch',
      'Transit-cushioned foliage protection ensures unblemished delivery',
      'Includes botanical care booklet and moisture testing probe',
    ],
    specifications: {
      'Botanical Name': 'Monstera deliciosa Liebm.',
      'Pot Material': 'Breathable Porous Terracotta Ceramic with Drainage',
      'Light Requirements': 'Bright indirect natural light; tolerates medium light',
      'Watering Frequency': 'Every 7-10 days once top 5cm soil dries out',
      'Total Specimen Height': '55 cm - 65 cm (including pot)',
      'Toxicity': 'Keep out of reach of domestic pets',
    },
    variants: [
      {
        variantId: 'v-04-medium',
        sku: 'PLX-MON-004-MED',
        label: 'Medium Specimen (55-65cm)',
        attributes: { height: '55-65cm' },
        stock: 8,
        active: true,
      },
      {
        variantId: 'v-04-tall',
        sku: 'PLX-MON-004-TAL',
        label: 'Architectural Specimen (75-85cm)',
        attributes: { height: '75-85cm' },
        priceAdjustmentPaise: 90000,
        stock: 4,
        active: true,
      },
    ],
  },

  // -------------------------------------------------------------
  // 2. HOME & EVERYDAY ESSENTIALS
  // -------------------------------------------------------------
  {
    productId: 'he-01',
    sku: 'PLX-PAN-001',
    slug: 'nordic-modular-pantry-stack-cube',
    name: 'Nordic Modular Pantry Stack Cube',
    shortDescription: 'Airtight smoked borosilicate glass container with precision hermetic silicone seal.',
    description: 'Modular pantry storage system designed to optimize counter and shelf geometry. Crafted from heat-resistant smoked borosilicate glass with an airtight silicone hermetic gasket.',
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
    imageKeys: [
      'nordic-stack-cube-hero',
      'nordic-stack-cube-rim',
      'nordic-stack-cube-stack',
      'nordic-stack-cube-airseal',
    ],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnvzT3bpPx60B4p5J4CKaSI9f_Ygexjc7LfQpjHZ3YmydbRKUHDpUzqskA6CICLpIplWUXIDY_yQgmaVlzMtS7CbRvLLwqsqUD6jVetIP0h6ZmQEyxDPlAMv0v4ZjVnCwAKI6FozmYHw6WDYiCeGUaHSGGZFR_dG16WTzeGIm6qqp2ZQpRuN9ZguQp4nr6dcFM32emoxLDShJcynSuk3BSk-fZTQEi_eaoS1RrhESrWrEfcd80USHw',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584990347449-399066e57dfc?auto=format&fit=crop&w=1200&q=85',
    ],
    highlights: [
      'Modular interlocking rim for secure vertical stacking',
      'Food-grade odor-resistant borosilicate glass body',
      'Dishwasher safe glass vessel and BPA-free silicone gasket',
    ],
    specifications: {
      'Storage Capacity': '1,200 ml (40 fl oz)',
      'Primary Material': 'Borosilicate Glass & Natural Ash Wood Lid',
      'Seal Type': 'Multi-Ridge Airtight Silicone Gasket',
      'Thermal Tolerance': '-20°C to 150°C (Glass vessel)',
      'Dishwasher Safe': 'Yes (Glass vessel only; hand-wash lid)',
      'Dimensions': '11 cm W × 11 cm D × 16 cm H',
    },
    variants: [
      {
        variantId: 'v-he01-medium',
        sku: 'PLX-PAN-001-MED',
        label: 'Medium Cube (1,200ml)',
        attributes: { capacity: '1,200ml' },
        stock: 12,
        active: true,
      },
      {
        variantId: 'v-he01-large',
        sku: 'PLX-PAN-001-LRG',
        label: 'Tall Grande Cube (2,000ml)',
        attributes: { capacity: '2,000ml' },
        priceAdjustmentPaise: 40000,
        stock: 7,
        active: true,
      },
    ],
  },
  {
    productId: 'he-02',
    sku: 'PLX-PAN-002',
    slug: 'airtight-fluted-pantry-canisters-set',
    name: 'Airtight Fluted Pantry Canisters (Set of 3)',
    shortDescription: 'Uniform tall ribbed glass canisters with natural acacia wood airtight sealing lids.',
    description: 'Transform cluttered pantries into tranquil culinary stations. Ribbed exterior glass provides tactile grip, while precision silicone gaskets preserve ingredient freshness against moisture and oxidation.',
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
    imageKeys: [
      'canister-set-3-hero',
      'canister-set-3-lids',
      'canister-set-3-texture',
      'canister-set-3-pantry',
    ],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhpoN8HoX8_03xi9qNn7j-Vf20GkoFmSHbdgs8uFV1yrBIB8QgOp6sIHRyCiRDY4ah4if1LwnhUYR6DGI1bohw1Hmm52u5bxkrUbT3Nf3qPY3B18nxBojwI31G91Xvu8hRCm4ygs8AWgjpTURzEfGmmLEJYItTCHhWBQwbLXyHM5GvYFHxIcIh1rMsp541QVqZvLzDOFe3wtfdv485lvXtMaLVrQAAZBTJDHpc51wk87ndBTjfzapg',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=85',
    ],
    highlights: [
      'Natural grain acacia wooden lids with laser-engraved monogram',
      'Hermetic silicone seal locks out moisture and pantry humidity',
      'Space-efficient vertical footprint with non-slip fluted walls',
    ],
    specifications: {
      'Set Composition': '3 Canisters (Small 800ml, Medium 1,200ml, Large 1,800ml)',
      'Glass Material': 'Lead-Free High Transparency Fluted Soda-Lime Glass',
      'Lid Material': 'Solid Hardwood Acacia with Food-Grade Silicone',
      'Dishwasher Safe': 'Glass jars are dishwasher safe',
    },
  },
  {
    productId: 'he-03',
    sku: 'PLX-DIV-003',
    slug: 'expandable-brass-drawer-divider-set',
    name: 'Expandable Brass Drawer Divider Set',
    shortDescription: 'Spring-loaded brushed brass culinary dividers for bespoke utensil organization.',
    description: 'Engineered for luxury kitchen drawers. Smooth spring tension adjustments fit standard depth drawers without drilling, tools, or sticky adhesive residues.',
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
    imageKeys: [
      'drawer-dividers-hero',
      'drawer-dividers-spring',
      'drawer-dividers-texture',
      'drawer-dividers-drawer',
    ],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCj1TwmUb91XqgSYQ7GyaDj7eTr0rw8Ksn7mAo3YVAc_jYtrTkxfsG3SE4yJhHiV9KHj0BjhsdQigE_fWOIzvYlh78JhMUJxuk8hU3PCPFPKkM3BjG12OmeK696I4AMqfrDHbnGxYUKxTgBvhEcnvohDdU6I7vU404oBY_IdsX7f12_0hSpkzsFuJPx2rmrFj9cc6itlQjxLqKfW0oVnFy_mdGAcRozhkVFfoCeGSTCvRnUOV9O3Dc_',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=85',
    ],
    highlights: [
      'Spring-loaded tension fit holds firmly in place across drawer shifts',
      'Protective high-friction silicone pads prevent drawer scratches',
      'Solid heavy-gauge brass body that will not warp or loosen',
    ],
    specifications: {
      'Expansion Range': '38 cm to 54 cm continuous tension extension',
      'Material': 'Brushed Solid Brass & Internal High-Tensile Steel Spring',
      'Height': '6.5 cm (Fits standard kitchen & cutlery drawers)',
      'Installation Method': 'Tool-free spring tension compression',
      'Set Count': 'Pair of 2 Dividers',
    },
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
    imageKeys: [
      'magnetic-knife-plinth-hero',
      'magnetic-knife-plinth-grain',
      'magnetic-knife-plinth-dual',
      'magnetic-knife-plinth-base',
    ],
    imageUrls: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDW_sMvAQq1GYEJ8zGLxgOVeggaeUUFCxD8HD8sxALZcS7LbKPb_VlhSGoXF-bAJfrzw5J2jLeSpsStxaPcbfx7fwzh_WzE6fe4-EdKVE0b7UHMhVTu_jFHyank4yDy5iDeG1PggHEaAMj1103eUe6wGmvqMulGWtkgIB_GHnBHvmr4pIto8vzQLKccy2_qv3GjFyhL4Gwnt8pIsp833zqm9Gh48ZTtAHcJccgQ3Gidq1fyqQyrjurm',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584990347449-399066e57dfc?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
    ],
    highlights: [
      'Dual-sided magnetic retention holds up to 8 blades effortlessly',
      'Heavy cast iron stabilizing base prevents tip-over during extraction',
      'Natural food-safe mineral oil finish protects wood grain',
    ],
    specifications: {
      'Blade Capacity': 'Up to 8 Chef / Santoku / Utility Knives (Dual Sided)',
      'Material': 'Solid Smoked European Oak & Cast Iron Weighted Plinth',
      'Magnet Type': 'Embedded N52 Neodymium Rare-Earth Array',
      'Dimensions': '26 cm W × 23 cm H × 10 cm Base Depth',
      'Weight': '2.6 kg (Ultra-Stable)',
    },
  },
];

export function getProductBySlug(slug: string): CatalogItem | undefined {
  if (typeof window !== 'undefined') {
    try {
      const adminStoreRaw = localStorage.getItem('plantrix_admin_products_v1');
      if (adminStoreRaw) {
        const adminProds: any[] = JSON.parse(adminStoreRaw);
        const match = adminProds.find((p) => p.slug === slug);
        if (match) {
          const resolvedUrls = (match.imageKeys || match.imageUrls || []).map((k: string) =>
            k.startsWith('http') ? k : `/images/${k}`
          );
          return {
            ...match,
            imageUrls: resolvedUrls.length > 0 ? resolvedUrls : ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=85'],
            categoryLabel: match.categoryId?.replace(/[-_]/g, ' ') || 'Curated',
          };
        }
      }
    } catch {
      // Fallback
    }
  }
  return CATALOG_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByDepartment(dept: 'PLANTS_BOTANICS' | 'HOME_ESSENTIALS'): CatalogItem[] {
  return CATALOG_PRODUCTS.filter((p) => p.department === dept);
}
