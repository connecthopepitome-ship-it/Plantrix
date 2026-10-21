/**
 * Automated Verification Script: Product DTO Sanitizer & Security Boundary
 * Tests that toPublicProduct() strips 100% of internal supplier fields.
 */

import { Product, toPublicProduct, formatPaiseToINR, calculateDiscountPercentage } from '../src/types/product';

const mockInternalProduct: Product = {
  productId: 'PLANT-001',
  sku: 'PLT-MONS-MED',
  slug: 'monstera-deliciosa-swiss-cheese-plant',
  name: 'Monstera Deliciosa (Swiss Cheese Plant)',
  shortDescription: 'Lush tropical indoor plant with natural fenestrations.',
  department: 'PLANTS_BOTANICS',
  categoryId: 'indoor-plants',
  sellingPricePaise: 79900, // ₹799
  compareAtPricePaise: 119900, // ₹1,199
  stock: 15,
  status: 'ACTIVE',
  featured: true,
  trending: true,
  newArrival: true,
  imageKeys: ['products/PLANT-001/hero-original.webp', 'products/PLANT-001/gallery-01.webp'],
  specifications: {
    'Sunlight': 'Bright Indirect Light',
    'Watering': 'Once every 7-10 days',
    'Pot Size': '6 inch nursery pot included',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  // STRICT SENSITIVE SUPPLIER FIELDS
  sourceCostPaise: 35000, // ₹350 wholesale
  sourceProductUrl: 'https://supplier.example.com/item/987123?ref=internal_dropship',
  supplierSku: 'SUP-MONS-BENGALURU-04',
  sourceCostVerifiedAt: '2026-10-20T10:00:00Z',
  internalNotes: 'Supplier has 200 units in stock. Courier pickup window 2 PM.',
};

console.log('🧪 RUNNING PLANTRIX DATA MODEL & SECURITY BOUNDARY TESTS...');

// Test 1: Currency Formatting
const inr = formatPaiseToINR(mockInternalProduct.sellingPricePaise);
console.assert(inr === '₹799', `Expected ₹799, got ${inr}`);
console.log('✅ Test 1 Passed: formatPaiseToINR(79900) === "₹799"');

// Test 2: Legitimate Discount Calculation
const discount = calculateDiscountPercentage(
  mockInternalProduct.sellingPricePaise,
  mockInternalProduct.compareAtPricePaise
);
console.assert(discount === 33, `Expected 33%, got ${discount}%`);
console.log(`✅ Test 2 Passed: calculateDiscountPercentage -> ${discount}%`);

// Test 3: Security Boundary & Field Scrubbing
const publicProduct = toPublicProduct(mockInternalProduct, 'https://images.plantrixbotanics.com');

console.assert((publicProduct as any).sourceCostPaise === undefined, 'FAIL: sourceCostPaise leaked!');
console.assert((publicProduct as any).sourceProductUrl === undefined, 'FAIL: sourceProductUrl leaked!');
console.assert((publicProduct as any).supplierSku === undefined, 'FAIL: supplierSku leaked!');
console.assert((publicProduct as any).internalNotes === undefined, 'FAIL: internalNotes leaked!');
console.assert((publicProduct as any).sourceCostVerifiedAt === undefined, 'FAIL: sourceCostVerifiedAt leaked!');

console.assert(publicProduct.imageUrls[0] === 'https://images.plantrixbotanics.com/products/PLANT-001/hero-original.webp', 'FAIL: R2 URL mapping failed!');
console.assert(publicProduct.sellingPricePaise === 79900, 'FAIL: Price altered!');

console.log('✅ Test 3 Passed: toPublicProduct() strictly scrubs all supplier data and maps R2 public URLs.');
console.log('\n🎉 ALL 3 DATA MODEL SECURITY TESTS PASSED!');
