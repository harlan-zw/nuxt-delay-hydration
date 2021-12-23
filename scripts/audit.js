const { computeMedianRun } = require('lighthouse/lighthouse-core/lib/median-run.js')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

const runPerformanceAudit = async() => {
  const results = []
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  for (let i = 0; i < 20; i++) {
    // eslint-disable-next-line no-console
    console.log(`Iteration: ${i + 1}`)
    const options = { /* logLevel: 'info', output: 'html', */onlyCategories: ['performance'], port: chrome.port }
    const runnerResult = await lighthouse('http://localhost:3000', options)
    results.push(runnerResult.lhr)
  }
  await chrome.kill()
  const median = computeMedianRun(results)

  const score = median.categories.performance.score
  const blocking = median.audits['total-blocking-time'].displayValue
  const interactive = median.audits.interactive.displayValue
  const cls = median.audits['cumulative-layout-shift'].displayValue
  const fcp = median.audits['first-contentful-paint'].displayValue
  const speedIndex = median.audits['speed-index'].displayValue
  const lcp = median.audits['largest-contentful-paint'].displayValue

  return {
    'Score': score,
    'Total Blocking Time': blocking,
    'Time to Interactive': interactive,
    'Cumulative Layout Shift': cls,
    'First Contentful Paint': fcp,
    'Speed Index': speedIndex,
    'Last Contentful Paint': lcp,
  }
}

(async() => {
  const result = await runPerformanceAudit()
  /* eslint-disable no-console */
  console.table(result)
})()
