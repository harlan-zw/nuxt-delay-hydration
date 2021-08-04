import { setupTest, getNuxt } from '@nuxt/test-utils'
const {computeMedianRun} = require('lighthouse/lighthouse-core/lib/median-run.js');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { spawn } = require('child_process');

const runPerformanceAudit = async (url) => {
  const results = []
  const chrome = await chromeLauncher.launch(/*{chromeFlags: ['--headless']}*/);
  for (let i = 0; i < 5; i++) {
    const options = {/*logLevel: 'info', output: 'html', */onlyCategories: ['performance'], port: chrome.port};
    const runnerResult = await lighthouse(url, options);
    results.push(runnerResult.lhr)
  }
  await chrome.kill()
  const median = computeMedianRun(results)

  const score = median.categories.performance.score
  const blocking = median.audits['total-blocking-time'].displayValue
  const interactive = median.audits['interactive'].displayValue
  const cls = median.audits['cumulative-layout-shift'].displayValue
  const fcp = median.audits['first-contentful-paint'].displayValue
  const speedIndex = median.audits['speed-index'].displayValue
  const lcp = median.audits['largest-contentful-paint'].displayValue

  return {
    score,
    blocking,
    interactive,
    cls,
    fcp,
    speedIndex,
    lcp
  }
}

let noModuleStats

describe('No module test',  () => {

  setupTest({
    testDir: __dirname,
    fixture: __dirname,
    configFile: 'nuxt.config.ts',
    build: false,
    server: false,
    generate: false,
  })

  let server

  beforeEach((done) => {
    server = spawn('yarn', ['start:pokemon'])
    done()
  });

  afterEach((done) => {
    server.kill()
    server = null
    done()
  });


  it('renders index route', async (done) => {
    noModuleStats= await runPerformanceAudit(`http://localhost:3000`)
    try {
      expect(noModuleStats.score).toBeLessThan(0.95)
    } catch (e) {

    }
    console.log('did test', noModuleStats)
    done()
  })
})
