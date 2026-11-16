import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runDemo } from './demo.js';

test('audits what the invoice export tells its users', async () => {
  const report = await runDemo();
  assert.equal(report.observed.counts.on_time, 122);
  assert.equal(report.observed.counts.timeout, 6);
  assert.equal(report.observed.decision, 'below_target');
  assert.equal(report.candidate.counts.on_time, 194);
  assert.equal(report.candidate.decision, 'passes_target');
});
