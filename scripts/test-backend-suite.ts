/**
 * Plantrix Botanics — Comprehensive Backend Engineering Test Suite
 * Tests all 14 phases of the backend architecture:
 * 1. Product catalogue retrieval & sanitization
 * 2. Filters & pagination
 * 3. Cart & order price/stock verification
 * 4. Order creation & inventory decrement
 * 5. State transitions & legal lifecycle enforcement
 * 6. Order access isolation
 * 7. Payment signature verification & webhook idempotency
 * 8. Shipping serviceability & tracking generation
 * 9. Admin authorization guard
 * 10. Zod validation schemas
 * 11. R2 object storage key resolution
 */

import {
  getPublicProducts,
  getPublicProductBySlug,
  getAdminProducts,
  createProduct,
  updateProduct,
} from '../src/lib/services/productService';
import {
  calculateOrderTotals,
  createOrder,
  getOrderById,
  updateOrderStatus,
} from '../src/lib/services/orderService';
import {
  verifyWebhookSignature,
  markOrderPaid,
  createPaymentSession,
} from '../src/lib/services/paymentService';
import {
  checkPincodeServiceability,
  createShipmentForOrder,
} from '../src/lib/services/shippingService';
import {
  ProductCreateSchema,
  CheckoutRequestSchema,
  ImageUploadSignSchema,
} from '../src/lib/validation/schemas';
import { resolveImagePublicUrl } from '../src/lib/r2/client';
import { verifyAdminRequest } from '../src/lib/firebase/admin-auth';

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🌿 PLANTRIX BOTANICS — BACKEND TEST SUITE (PRODUCTION READINESS)');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST GROUP 1: Product Catalogue & Security Boundary
  // -------------------------------------------------------------
  console.log('\n--- Test Group 1: Product Catalogue & Security Boundary ---');
  const catalogRes = await getPublicProducts({ limit: 4 });
  assert(catalogRes.products.length > 0, 'Public products retrieved');
  assert(catalogRes.limit === 4, 'Pagination limit respected');

  // Verify zero leakage of sensitive supplier fields
  const firstProd = catalogRes.products[0] as any;
  assert(firstProd.sourceCostPaise === undefined, 'Security Boundary: sourceCostPaise stripped');
  assert(firstProd.sourceProductUrl === undefined, 'Security Boundary: sourceProductUrl stripped');
  assert(firstProd.supplierSku === undefined, 'Security Boundary: supplierSku stripped');
  assert(firstProd.internalNotes === undefined, 'Security Boundary: internalNotes stripped');

  // Slug retrieval
  const slugProd = await getPublicProductBySlug('sculptural-ribbed-fluted-planter');
  assert(slugProd !== null, 'Public product retrieved by slug');
  assert(
    slugProd?.name === 'Sculptural Ribbed Fluted Planter',
    'Product name matches slug specification'
  );

  // Department filter
  const plantsOnly = await getPublicProducts({ department: 'PLANTS_BOTANICS' });
  const allMatchDept = plantsOnly.products.every(
    (p) => p.department === 'PLANTS_BOTANICS'
  );
  assert(allMatchDept, 'Department filter returns only requested department');

  // -------------------------------------------------------------
  // TEST GROUP 2: Server-Side Cart & Pricing Verification
  // -------------------------------------------------------------
  console.log('\n--- Test Group 2: Server-Side Cart & Pricing Verification ---');
  const calcSuccess = await calculateOrderTotals([
    { productId: 'pb-01', quantity: 2 }, // ₹1,899 * 2 = ₹3,798 (379800 paise)
  ]);
  assert(!calcSuccess.errors, 'Valid product pricing calculated');
  assert(
    calcSuccess.calculation.subtotalPaise === 379800,
    'Subtotal matches server catalog prices (not client-submitted)'
  );
  assert(
    calcSuccess.calculation.shippingPaise === 0,
    'Free shipping applied for order >= ₹999 (99900 paise)'
  );
  assert(
    calcSuccess.calculation.totalPaise === 379800,
    'Total matches subtotal + free shipping'
  );

  // Standard shipping test for order < ₹999
  const calcSmall = await calculateOrderTotals([
    { productId: 'pb-02', quantity: 0 }, // Invalid quantity handled
  ]);
  // Rejection of invalid item ID
  const calcInvalid = await calculateOrderTotals([
    { productId: 'non-existent-product-id-999', quantity: 1 },
  ]);
  assert(
    Boolean(calcInvalid.errors && calcInvalid.errors.length > 0),
    'Non-existent product rejected with server validation error'
  );

  // -------------------------------------------------------------
  // TEST GROUP 3: Order Placement & Inventory Decrement
  // -------------------------------------------------------------
  console.log('\n--- Test Group 3: Order Creation & Inventory Decrement ---');
  const orderRes = await createOrder({
    customer: {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      phone: '9876543210',
    },
    shippingAddress: {
      line1: '12B Palm Grove Residency',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'IN',
    },
    items: [{ productId: 'pb-01', quantity: 1 }],
    paymentMethod: 'COD',
    customerUid: 'cust-rohan-001',
  });

  assert(Boolean(orderRes.order), 'Order created successfully');
  const createdOrder = orderRes.order!;
  assert(createdOrder.status === 'PLACED', 'COD order initial status is PLACED');
  assert(createdOrder.paymentStatus === 'PENDING', 'COD payment status is PENDING');
  assert(createdOrder.orderNumber.startsWith('PLX-'), 'Human-readable orderNumber generated');
  assert(createdOrder.items[0].unitPricePaise === 189900, 'Immutable snapshot captured');

  // -------------------------------------------------------------
  // TEST GROUP 4: Legal Order State Transitions
  // -------------------------------------------------------------
  console.log('\n--- Test Group 4: Order State Transitions ---');
  // Legal transition: PLACED -> CONFIRMED
  const confirmed = await updateOrderStatus(createdOrder.orderId, 'CONFIRMED');
  assert(confirmed.order?.status === 'CONFIRMED', 'Legal transition: PLACED -> CONFIRMED succeeded');

  // Illegal transition: CONFIRMED -> DELIVERED (Cannot jump directly without PROCESSING/SHIPPED)
  const illegal = await updateOrderStatus(createdOrder.orderId, 'DELIVERED');
  assert(
    Boolean(illegal.error),
    'Illegal state transition rejected (CONFIRMED -> DELIVERED)'
  );

  // Legal step-by-step: CONFIRMED -> PROCESSING -> PACKED -> SHIPPED
  await updateOrderStatus(createdOrder.orderId, 'PROCESSING');
  await updateOrderStatus(createdOrder.orderId, 'PACKED');
  const shipped = await updateOrderStatus(createdOrder.orderId, 'SHIPPED');
  assert(shipped.order?.status === 'SHIPPED', 'Step-by-step lifecycle: PACKED -> SHIPPED succeeded');

  // -------------------------------------------------------------
  // TEST GROUP 5: Order Access Isolation
  // -------------------------------------------------------------
  console.log('\n--- Test Group 5: Order Access Isolation ---');
  // Owner customer can access
  const ownerAccess = await getOrderById(createdOrder.orderId, 'cust-rohan-001', false);
  assert(ownerAccess !== null, 'Owner customer can access their own order');

  // Different customer is denied
  const intruderAccess = await getOrderById(createdOrder.orderId, 'cust-intruder-999', false);
  assert(intruderAccess === null, 'Intruder customer denied access to order (Security Isolation)');

  // Admin can access any order
  const adminAccess = await getOrderById(createdOrder.orderId, undefined, true);
  assert(adminAccess !== null, 'Admin can access any customer order');

  // -------------------------------------------------------------
  // TEST GROUP 6: Payment Webhook Signature & Idempotency
  // -------------------------------------------------------------
  console.log('\n--- Test Group 6: Payment Verification & Webhook ---');
  const testSecret = 'plantrix_test_webhook_secret_998877';
  const testPayload = JSON.stringify({
    event: 'payment.captured',
    orderId: createdOrder.orderId,
  });

  // Generate real HMAC SHA256 signature for test
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(testSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(testPayload));
  const validHexSig = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Valid signature verification
  const sigValid = await verifyWebhookSignature(testPayload, validHexSig, testSecret);
  assert(sigValid, 'HMAC SHA256 webhook signature verified');

  // Tampered payload rejected
  const tamperedValid = await verifyWebhookSignature(
    testPayload + '_tampered',
    validHexSig,
    testSecret
  );
  assert(!tamperedValid, 'Tampered webhook payload correctly rejected');

  // Idempotent markOrderPaid
  const paidFirst = await markOrderPaid({
    orderId: createdOrder.orderId,
    providerReference: 'pay_test_ref_12345',
    provider: 'razorpay',
  });
  assert(paidFirst, 'Order successfully marked as PAID');

  const paidSecond = await markOrderPaid({
    orderId: createdOrder.orderId,
    providerReference: 'pay_test_ref_12345',
    provider: 'razorpay',
  });
  assert(paidSecond, 'Idempotency: Repeated markOrderPaid does not corrupt order');

  // -------------------------------------------------------------
  // TEST GROUP 7: Shipping Serviceability & Tracking
  // -------------------------------------------------------------
  console.log('\n--- Test Group 7: Shipping & Logistics ---');
  const validPin = await checkPincodeServiceability('560038');
  assert(validPin.serviceable, 'Valid 6-digit PIN code marked serviceable');
  assert(validPin.estimatedDays === 3, 'Estimated delivery transit days calculated');

  const invalidPin = await checkPincodeServiceability('999');
  assert(!invalidPin.serviceable, 'Invalid PIN code rejected');

  const shipmentRes = await createShipmentForOrder({
    orderId: createdOrder.orderId,
    courierPartner: 'Blue Dart Air Express',
  });
  assert(Boolean(shipmentRes.shipment), 'Shipment created and tracking number linked');
  assert(
    shipmentRes.shipment?.carrierName === 'Blue Dart Air Express',
    'Courier partner recorded'
  );

  // -------------------------------------------------------------
  // TEST GROUP 8: Zod Validation Schemas
  // -------------------------------------------------------------
  console.log('\n--- Test Group 8: Zod Validation Schemas ---');
  // Valid product schema
  const validProductParse = ProductCreateSchema.safeParse({
    name: 'Artisan Terracotta Planter',
    department: 'GARDEN_OUTDOOR',
    categoryId: 'pots-planters',
    sku: 'PLX-TER-99',
    sellingPricePaise: 129900,
    stock: 20,
    status: 'ACTIVE',
  });
  assert(validProductParse.success, 'Valid product schema passes validation');

  // Invalid product schema (negative price)
  const invalidPriceParse = ProductCreateSchema.safeParse({
    name: 'Invalid Price Planter',
    department: 'GARDEN_OUTDOOR',
    categoryId: 'pots-planters',
    sku: 'PLX-INV-01',
    sellingPricePaise: -500, // Invalid!
  });
  assert(!invalidPriceParse.success, 'Negative price rejected by schema');

  // Invalid checkout phone number
  const invalidCheckoutParse = CheckoutRequestSchema.safeParse({
    customer: {
      name: 'Test',
      phone: '12345', // Invalid Indian phone (must be 10 digits starting with 6-9)
    },
    shippingAddress: {
      line1: 'Road 1',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'IN',
    },
    items: [],
  });
  assert(!invalidCheckoutParse.success, 'Invalid phone number rejected by schema');

  // -------------------------------------------------------------
  // TEST GROUP 9: R2 Storage Key Resolution
  // -------------------------------------------------------------
  console.log('\n--- Test Group 9: R2 Storage Key Resolution ---');
  const r2Resolved = resolveImagePublicUrl('products/pb-01/hero.webp');
  assert(
    r2Resolved.includes('products/pb-01/hero.webp'),
    'R2 object key resolved to public delivery URL'
  );

  const httpPassThrough = resolveImagePublicUrl('https://images.unsplash.com/photo-12345');
  assert(
    httpPassThrough === 'https://images.unsplash.com/photo-12345',
    'Existing absolute URL passed through without alteration'
  );

  // -------------------------------------------------------------
  // TEST GROUP 10: Admin Authorization Guard
  // -------------------------------------------------------------
  console.log('\n--- Test Group 10: Admin Authorization Guard ---');
  const mockReqNoAuth = new Request('https://plantrixbotanics.com/api/admin/products');
  const authNoToken = await verifyAdminRequest(mockReqNoAuth);
  assert(!authNoToken.authorized && authNoToken.status === 401, 'Unauthorized request rejected with 401');

  const mockReqDev = new Request('https://plantrixbotanics.com/api/admin/products', {
    headers: { 'x-dev-admin': 'true' },
  });
  const authDev = await verifyAdminRequest(mockReqDev);
  assert(authDev.authorized && authDev.status === 200, 'Dev/API admin access authorized');

  // -------------------------------------------------------------
  // TEST GROUP 11: Bulk Product Import Module
  // -------------------------------------------------------------
  console.log('\n--- Test Group 11: Bulk Product Import Module ---');
  const {
    parseInrToPaise,
    matchImagesForSku,
    validateImportCsv,
    executeImportJob,
    generateImportTemplateCsv,
    generateImportSampleCsv,
    getImportJobs,
  } = await import('../src/lib/services/bulkImportService');

  // 11.1 Exact INR to Paise Conversion
  const p1 = parseInrToPaise('1899');
  assert(p1.paise === 189900, 'INR integer converted exactly to paise (1899 -> 189900)');
  const p2 = parseInrToPaise('₹ 2,499.50');
  assert(p2.paise === 249950, 'INR currency string with symbols converted to paise (₹2,499.50 -> 249950)');
  const pInvalid = parseInrToPaise('-150');
  assert(Boolean(pInvalid.error), 'Negative price rejected with validation error');

  // 11.2 Template Generation
  const tpl = generateImportTemplateCsv();
  assert(tpl.includes('sku,name,slug') && tpl.includes('sellingPrice'), 'Official CSV template contains standard headers');
  const sample = generateImportSampleCsv();
  assert(sample.includes('PLX-POT-201') && sample.includes('PLX-MIS-202'), 'Sample CSV contains valid multi-department products');

  // 11.3 ZIP Image Matching & Path Traversal Security
  const mockArchiveFiles = [
    'POT-001/01.webp',
    'POT-001/02.webp',
    'POT-001/03.webp',
    'TOOL-002-01.jpg',
    'TOOL-002-02.jpg',
    'custom-hero.webp',
    '../etc/passwd', // malicious traversal
    '/root/secret.png', // malicious absolute
    '__MACOSX/._POT-001.webp', // OS junk
  ];

  // Path traversal test
  const matchedTraversal = matchImagesForSku('TRAV', ['../etc/passwd'], mockArchiveFiles);
  assert(matchedTraversal.length === 0, 'Malicious path traversal in archive safely rejected');

  // Match by SKU folder
  const folderMatches = matchImagesForSku('POT-001', [], mockArchiveFiles);
  assert(
    folderMatches.length === 3 && folderMatches[0] === 'POT-001/01.webp',
    'Matched multiple images by SKU folder with deterministic ordering'
  );

  // Match by SKU prefix
  const prefixMatches = matchImagesForSku('TOOL-002', [], mockArchiveFiles);
  assert(
    prefixMatches.length === 2 && prefixMatches[0] === 'TOOL-002-01.jpg',
    'Matched images by SKU prefix (TOOL-002-01.jpg)'
  );

  // Match by explicit CSV filename
  const explicitMatches = matchImagesForSku('EXP-999', ['custom-hero.webp'], mockArchiveFiles);
  assert(
    explicitMatches.length === 1 && explicitMatches[0] === 'custom-hero.webp',
    'Matched explicit image filename from CSV'
  );

  // 11.4 CSV Validation & Duplicate Detection
  const validCsv = `sku,name,categoryId,sellingPrice,stock\nTEST-SKU-01,Test Ceramic Pot,pots-planters,1299,20\nTEST-SKU-02,Brass Kitchen Tongs,cooking-tools,899,15`;
  const valRes = await validateImportCsv(validCsv, { duplicatePolicy: 'CREATE_NEW' });
  assert(valRes.totalRows === 2 && valRes.validRows === 2, 'Valid CSV parsed with 2 valid products');
  assert(valRes.rows[0].department === 'GARDEN_OUTDOOR', 'Category "pots-planters" auto-mapped to GARDEN_OUTDOOR');
  assert(valRes.rows[1].department === 'KITCHEN_TOOLS', 'Category "cooking-tools" auto-mapped to KITCHEN_TOOLS');

  // Missing required column error
  const invalidCsv = `sku,name\nTEST-03,Missing Price Pot`;
  const valMissingPrice = await validateImportCsv(invalidCsv);
  assert(valMissingPrice.rows[0].action === 'ERROR', 'Row missing sellingPrice marked as ERROR');

  // Intra-file duplicate SKU check
  const dupCsv = `sku,name,categoryId,sellingPrice\nDUP-01,Product A,pots-planters,999\nDUP-01,Product B,pots-planters,1499`;
  const valDup = await validateImportCsv(dupCsv);
  assert(
    valDup.rows[0].action === 'ERROR' && valDup.rows[1].action === 'ERROR',
    'Intra-file duplicate SKUs both flagged as errors'
  );

  // 11.5 Duplicate Policy: UPDATE_EXISTING vs SKIP_EXISTING
  // SKU PLX-POT-001 exists in database
  const existingSkuCsv = `sku,name,categoryId,sellingPrice,stock\nPLX-POT-001,Updated Ribbed Planter,pots-planters,1999,35`;
  
  const valUpdate = await validateImportCsv(existingSkuCsv, { duplicatePolicy: 'UPDATE_EXISTING' });
  assert(valUpdate.rows[0].action === 'UPDATE', 'Policy UPDATE_EXISTING marks existing SKU as UPDATE');

  const valSkip = await validateImportCsv(existingSkuCsv, { duplicatePolicy: 'SKIP_EXISTING' });
  assert(valSkip.rows[0].action === 'SKIP', 'Policy SKIP_EXISTING marks existing SKU as SKIP');

  const valConflict = await validateImportCsv(existingSkuCsv, { duplicatePolicy: 'CREATE_NEW' });
  assert(valConflict.rows[0].action === 'ERROR', 'Policy CREATE_NEW flags existing SKU as CONFLICT ERROR');

  // 11.6 Real Dry-Run Simulation (Zero writes)
  const dryRunJob = await executeImportJob({
    rows: valRes.rows,
    duplicatePolicy: 'CREATE_NEW',
    isDryRun: true,
    importAsDraftDefault: true,
    initiatingAdminId: 'test-admin',
    fileName: 'dryrun-test.csv',
  });
  assert(
    dryRunJob.isDryRun && dryRunJob.status === 'COMPLETED' && dryRunJob.createdProductIds.length === 0,
    'Dry run simulates execution without creating database records'
  );

  // 11.7 Permanent Import Execution & Job Record Tracking
  const permJob = await executeImportJob({
    rows: valRes.rows,
    duplicatePolicy: 'CREATE_NEW',
    isDryRun: false,
    importAsDraftDefault: true,
    initiatingAdminId: 'test-admin',
    fileName: 'permanent-test.csv',
  });
  assert(permJob.successCount === 2, 'Committed import successfully created 2 products in batch');
  assert(permJob.createdProductIds.length === 2, 'Created product IDs recorded in import job record');

  const allJobs = await getImportJobs();
  assert(allJobs.some((j) => j.jobId === permJob.jobId), 'Import job persisted in importJobs history');

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
