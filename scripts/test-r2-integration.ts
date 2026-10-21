/**
 * Plantrix Botanics — Cloudflare R2 Production Integration Test Runner
 * Executes real R2 upload, read-back, byte integrity verification, metadata check, and cleanup.
 * Outputs results in the required diagnostic table format.
 */

import { runR2ProductionTest } from '../src/lib/services/r2DiagnosticsService';

async function main() {
  console.log('===============================================================');
  console.log('📦 PLANTRIX BOTANICS — CLOUDFLARE R2 PRODUCTION TEST');
  console.log('===============================================================\n');

  console.log('Running server-side R2 integration diagnostics...');
  const report = await runR2ProductionTest();

  console.log(`\nTest Key: ${report.testObjectKey}`);
  console.log(`Target Bucket: ${report.bucketName}`);
  console.log(`Overall Status: ${report.overallStatus}`);
  console.log(`Passed: ${report.summary.passedSteps} / ${report.summary.totalSteps}`);

  console.log('\n--- Step Results ---');
  for (const [stepKey, step] of Object.entries(report.steps)) {
    const symbol = step.passed ? '✅' : stepKey === 'publicDelivery' ? 'ℹ️' : '❌';
    console.log(`${symbol} [${step.name}] ${step.passed ? 'PASS' : 'FAIL/INFO'} — ${step.message}`);
  }

  if (report.remediationAdvice && report.remediationAdvice.length > 0) {
    console.log('\n--- Remediation Advice ---');
    report.remediationAdvice.forEach((advice) => console.log(`• ${advice}`));
  }

  console.log('\n===============================================================');
  if (report.overallStatus !== 'PASS') {
    console.log('⚠️ Test finished with status FAIL (Check environment/Worker secrets).');
  } else {
    console.log('🎉 Real R2 Storage integration verified with 100% byte fidelity!');
  }
}

main().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
