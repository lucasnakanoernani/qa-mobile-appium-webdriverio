import path from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'
import { androidCapabilities } from './config/capabilities.js'
import { env, projectRoot } from './config/env.js'
import { saveFailureEvidence } from './test/utils/evidence.js'

export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',
    hostname: '127.0.0.1',
    port: env.port,
    path: '/',
    specs: ['./test/specs/**/*.spec.ts'],
    suites: { smoke: ['./test/specs/smoke.spec.ts'] },
    maxInstances: 1,
    capabilities: [androidCapabilities()],
    logLevel: 'warn',
    outputDir: path.join(projectRoot, 'artifacts', 'wdio'),
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 1,
    services: [['appium', {
        args: { address: '127.0.0.1', port: env.port },
        logPath: path.join(projectRoot, 'artifacts', 'appium'),
    }]],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: { ui: 'bdd', timeout: 60000 },

    async afterTest(test, _context, { error, passed }) {
        if (!passed) await saveFailureEvidence(`${test.parent} ${test.title}`, error)
    },

    // Também captura falhas em before/beforeEach/afterEach.
    async afterHook(test, _context, { error, passed }) {
        if (!passed) await saveFailureEvidence(`hook ${test.title}`, error)
    },

    onComplete(exitCode) {
        const dir = path.join(projectRoot, 'artifacts')
        mkdirSync(dir, { recursive: true })
        // Status do processo, sem inventar contagens de testes no relatório.
        writeFileSync(path.join(dir, 'run-summary.json'), JSON.stringify({
            finishedAt: new Date().toISOString(),
            exitCode,
            status: exitCode === 0 ? 'concluido' : 'falha',
        }, null, 2))
    },
}
