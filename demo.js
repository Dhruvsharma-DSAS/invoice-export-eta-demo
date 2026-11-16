import { writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { auditWaitMessages } from 'api-latency-brief';
import { createWaitCapture } from 'api-latency-brief/capture';

export async function runDemo() {
  // A simulated clock keeps the audit reproducible, while export completion is async.
  let now = Date.UTC(2026, 0, 1);
  let sequence = 0;
  const capture = createWaitCapture({
    now: () => now,
    makeId: () => 'demo-' + ++sequence
  });

  async function exportInvoices(index) {
    await delay(0);
    if (index >= 194) return { durationMs: 15000, outcome: 'timeout' };
    return { durationMs: index < 122 ? 4000 : 9000, outcome: 'ready' };
  }

  for (let index = 0; index < 200; index++) {
    const exposure = capture.show(5000);
    const result = await exportInvoices(index);
    now += result.durationMs;
    exposure.finish(result.outcome);
    now += 10;
  }
  return auditWaitMessages(capture.takeCompleted(), {
    targetRate: 0.90,
    candidateMs: 12000
  });
}

const isEntryPoint = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isEntryPoint) {
  const report = await runDemo();
  await writeFile(new URL('./eta-audit-report.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  for (const [label, result] of [
    ['5-second message', report.observed],
    ['12-second replay', report.candidate]
  ]) {
    console.log(label, result.counts.on_time + '/' + result.total, result.decision);
  }
}
