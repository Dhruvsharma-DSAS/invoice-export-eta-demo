# Invoice Export ETA Demo

An example app that uses [api-latency-brief](https://github.com/Dhruvsharma-DSAS/npm_package_time_evaluation) to check whether a billing app's invoice export usually meets the wait time shown to users.

## Try it

With Node.js 22 or newer:

```sh
npm ci
npm test
npm run demo
```

The demo generates `eta-audit-report.json`. It records 200 simulated invoice exports, then checks the displayed 5-second message and replays the same history with a 12-second estimate. The 5-second message falls below the 90% target. The candidate clears it in this synthetic sample.

The app imports the package's capture helper to record message and completion events. It passes those events to the package's auditor to score each message. The demo uses a simulated clock and needs no credentials or external API.
