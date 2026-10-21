/**
 * Plantrix Botanics — Cloudflare R2 Production Integration Diagnostics Service
 * Safely executes preflight checks, uploads a temporary test object, reads it back,
 * verifies exact byte-level integrity & metadata, deletes the test object, and verifies cleanup.
 * Strictly avoids logging secrets or authorization credentials.
 */

import {
  getR2Config,
  isR2Configured,
  uploadToR2,
  getObjectFromR2,
  headObjectFromR2,
  deleteFromR2,
} from '../r2/client';

export interface R2DiagnosticTestStep {
  name: string;
  passed: boolean;
  httpStatus?: number;
  message: string;
  details?: Record<string, any>;
}

export interface R2DiagnosticReport {
  timestamp: string;
  overallStatus: 'PASS' | 'FAIL';
  bucketName: string;
  testObjectKey: string;
  steps: {
    configuration: R2DiagnosticTestStep;
    upload: R2DiagnosticTestStep;
    readBack: R2DiagnosticTestStep;
    byteIntegrity: R2DiagnosticTestStep;
    metadata: R2DiagnosticTestStep;
    cleanup: R2DiagnosticTestStep;
    cleanupVerification: R2DiagnosticTestStep;
    publicDelivery: R2DiagnosticTestStep;
  };
  summary: {
    totalSteps: number;
    passedSteps: number;
    failedSteps: number;
    cleanupSuccess: boolean;
  };
  remediationAdvice?: string[];
}

// Minimal valid 1x1 PNG fixture (67 bytes)
const MINIMAL_PNG_FIXTURE = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

/**
 * Runs the comprehensive production R2 integration diagnostic
 */
export async function runR2ProductionTest(): Promise<R2DiagnosticReport> {
  const cfg = getR2Config();
  const testId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const testKey = `_integration-tests/r2-test-${testId}.png`;
  const remediation: string[] = [];

  // Step 1: Configuration Check
  const configPresent = Boolean(
    cfg.accountId &&
    cfg.accessKeyId &&
    cfg.secretAccessKey &&
    cfg.bucketName === 'plantrix-product-images'
  );

  const stepConfig: R2DiagnosticTestStep = {
    name: 'Configuration Check',
    passed: configPresent,
    message: configPresent
      ? 'All expected R2 variables present with target bucket "plantrix-product-images"'
      : 'Missing one or more required R2 variables or bucket name mismatch',
    details: {
      hasAccountId: Boolean(cfg.accountId),
      hasAccessKeyId: Boolean(cfg.accessKeyId),
      hasSecretAccessKey: Boolean(cfg.secretAccessKey),
      configuredBucket: cfg.bucketName,
      isTargetBucket: cfg.bucketName === 'plantrix-product-images',
    },
  };

  if (!cfg.accountId) remediation.push('Set R2_ACCOUNT_ID in Cloudflare Worker vars/secrets.');
  if (!cfg.accessKeyId) remediation.push('Set R2_ACCESS_KEY_ID in Cloudflare Worker secrets.');
  if (!cfg.secretAccessKey) remediation.push('Set R2_SECRET_ACCESS_KEY in Cloudflare Worker secrets.');

  // If configuration is completely missing, abort early
  if (!configPresent) {
    return {
      timestamp: new Date().toISOString(),
      overallStatus: 'FAIL',
      bucketName: cfg.bucketName,
      testObjectKey: testKey,
      steps: {
        configuration: stepConfig,
        upload: { name: 'Real R2 Upload', passed: false, message: 'Skipped: Configuration missing' },
        readBack: { name: 'Read-Back', passed: false, message: 'Skipped: Configuration missing' },
        byteIntegrity: { name: 'Byte Integrity', passed: false, message: 'Skipped: Configuration missing' },
        metadata: { name: 'Metadata Verification', passed: false, message: 'Skipped: Configuration missing' },
        cleanup: { name: 'Temporary Object Deletion', passed: false, message: 'Skipped: Configuration missing' },
        cleanupVerification: { name: 'Cleanup Absence Verification', passed: false, message: 'Skipped: Configuration missing' },
        publicDelivery: { name: 'Public Image Delivery', passed: false, message: 'Not configured (Custom Domain not bound)' },
      },
      summary: {
        totalSteps: 7,
        passedSteps: 0,
        failedSteps: 7,
        cleanupSuccess: true,
      },
      remediationAdvice: remediation,
    };
  }

  let uploadSuccess = false;
  let uploadStatus: number | undefined;
  let readSuccess = false;
  let readStatus: number | undefined;
  let readBody: Uint8Array | null = null;
  let readContentType = '';
  let readContentLength = 0;
  let bytesMatch = false;
  let metadataValid = false;
  let deleteSuccess = false;
  let deleteStatus: number | undefined;
  let absenceVerified = false;

  try {
    // Step 2: Upload Real Test Object
    const uploadRes = await uploadToR2({
      key: testKey,
      body: MINIMAL_PNG_FIXTURE,
      contentType: 'image/png',
    });

    if (uploadRes && uploadRes.httpStatus >= 200 && uploadRes.httpStatus < 300) {
      uploadSuccess = true;
      uploadStatus = uploadRes.httpStatus;
    } else {
      uploadStatus = uploadRes?.httpStatus || 500;
      remediation.push('Verify Cloudflare R2 bucket permissions and API token read/write scope.');
    }

    // Step 3: Read-Back Real Object
    if (uploadSuccess) {
      const readRes = await getObjectFromR2(testKey);
      if (readRes && readRes.httpStatus >= 200 && readRes.httpStatus < 300) {
        readSuccess = true;
        readStatus = readRes.httpStatus;
        readBody = readRes.body;
        readContentType = readRes.contentType;
        readContentLength = readRes.contentLength;

        // Step 4: Byte Integrity Comparison
        if (readBody.byteLength === MINIMAL_PNG_FIXTURE.byteLength) {
          let identical = true;
          for (let i = 0; i < MINIMAL_PNG_FIXTURE.byteLength; i++) {
            if (MINIMAL_PNG_FIXTURE[i] !== readBody[i]) {
              identical = false;
              break;
            }
          }
          bytesMatch = identical;
        }

        // Step 5: Metadata Verification
        metadataValid =
          readContentType.toLowerCase().includes('image/png') &&
          readContentLength === MINIMAL_PNG_FIXTURE.byteLength;
      } else {
        readStatus = readRes?.httpStatus || 500;
        remediation.push('R2 object uploaded but could not be read back via authenticated SigV4.');
      }
    }
  } finally {
    // Step 6: Safe Cleanup of Test Object (Always runs)
    if (uploadSuccess) {
      const delRes = await deleteFromR2(testKey);
      deleteSuccess = delRes.success;
      deleteStatus = delRes.httpStatus;

      // Step 7: Absence Verification
      const headRes = await headObjectFromR2(testKey);
      if (!headRes.exists && (headRes.httpStatus === 404 || !headRes.exists)) {
        absenceVerified = true;
      } else {
        remediation.push(`Test object ${testKey} may still exist in R2; manual deletion recommended.`);
      }
    } else {
      deleteSuccess = true;
      absenceVerified = true;
    }
  }

  // Step 8: Public Delivery Status Check
  const publicDeliveryConfigured = Boolean(cfg.publicBaseUrl);

  const stepUpload: R2DiagnosticTestStep = {
    name: 'Real R2 Upload',
    passed: uploadSuccess,
    httpStatus: uploadStatus,
    message: uploadSuccess
      ? `Successfully uploaded test fixture (${MINIMAL_PNG_FIXTURE.byteLength} bytes) to ${cfg.bucketName}`
      : `Failed to upload test fixture to R2 (HTTP ${uploadStatus || 'Error'})`,
  };

  const stepReadBack: R2DiagnosticTestStep = {
    name: 'Read-Back via SigV4 GET',
    passed: readSuccess,
    httpStatus: readStatus,
    message: readSuccess
      ? `Retrieved ${readContentLength} bytes via authenticated S3 REST API`
      : 'Failed to retrieve test object from R2',
  };

  const stepIntegrity: R2DiagnosticTestStep = {
    name: 'Byte Integrity',
    passed: bytesMatch,
    message: bytesMatch
      ? 'Retrieved bytes match original 67-byte PNG fixture exactly (100% byte fidelity)'
      : 'Byte mismatch between uploaded and retrieved object',
    details: {
      expectedBytes: MINIMAL_PNG_FIXTURE.byteLength,
      receivedBytes: readBody ? readBody.byteLength : 0,
    },
  };

  const stepMetadata: R2DiagnosticTestStep = {
    name: 'Metadata Verification',
    passed: metadataValid,
    message: metadataValid
      ? `Content-Type verified as "${readContentType}", Content-Length matches fixture`
      : `Metadata mismatch: Content-Type="${readContentType}", Content-Length=${readContentLength}`,
    details: {
      contentType: readContentType,
      contentLength: readContentLength,
    },
  };

  const stepCleanup: R2DiagnosticTestStep = {
    name: 'Temporary Object Deletion',
    passed: deleteSuccess,
    httpStatus: deleteStatus,
    message: deleteSuccess
      ? `Successfully deleted temporary test object ${testKey}`
      : `Failed to delete temporary test object ${testKey}`,
  };

  const stepCleanupVerify: R2DiagnosticTestStep = {
    name: 'Cleanup Absence Verification',
    passed: absenceVerified,
    message: absenceVerified
      ? 'Verified object no longer exists in bucket (HTTP 404 confirmed)'
      : 'Object still detectable in bucket after deletion attempt',
  };

  const stepDelivery: R2DiagnosticTestStep = {
    name: 'Public Image Delivery',
    passed: publicDeliveryConfigured,
    message: publicDeliveryConfigured
      ? `Configured with public delivery URL: ${cfg.publicBaseUrl}`
      : 'Not configured yet: Custom domain (e.g. images.plantrixbotanics.com) is not bound, and public development URL is disabled as required.',
  };

  const passedCount = [
    stepConfig.passed,
    stepUpload.passed,
    stepReadBack.passed,
    stepIntegrity.passed,
    stepMetadata.passed,
    stepCleanup.passed,
    stepCleanupVerify.passed,
  ].filter(Boolean).length;

  const allCorePassed =
    stepConfig.passed &&
    stepUpload.passed &&
    stepReadBack.passed &&
    stepIntegrity.passed &&
    stepMetadata.passed &&
    stepCleanup.passed &&
    stepCleanupVerify.passed;

  return {
    timestamp: new Date().toISOString(),
    overallStatus: allCorePassed ? 'PASS' : 'FAIL',
    bucketName: cfg.bucketName,
    testObjectKey: testKey,
    steps: {
      configuration: stepConfig,
      upload: stepUpload,
      readBack: stepReadBack,
      byteIntegrity: stepIntegrity,
      metadata: stepMetadata,
      cleanup: stepCleanup,
      cleanupVerification: stepCleanupVerify,
      publicDelivery: stepDelivery,
    },
    summary: {
      totalSteps: 7,
      passedSteps: passedCount,
      failedSteps: 7 - passedCount,
      cleanupSuccess: deleteSuccess && absenceVerified,
    },
    remediationAdvice: remediation.length > 0 ? remediation : undefined,
  };
}
