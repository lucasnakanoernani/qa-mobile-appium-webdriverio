import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const envFile = path.join(projectRoot, '.env')
if (existsSync(envFile)) process.loadEnvFile(envFile)

function value(name: string, fallback: string): string {
    return process.env[name]?.trim() || fallback
}

const mode = value('APP_MODE', 'installed')
if (mode !== 'installed' && mode !== 'apk') {
    throw new Error('APP_MODE deve ser installed ou apk no arquivo .env.')
}
const noReset = value('NO_RESET', 'false')
if (!['true', 'false'].includes(noReset)) {
    throw new Error('NO_RESET deve ser true ou false.')
}
const port = Number(value('APPIUM_PORT', '4723'))
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('APPIUM_PORT deve ser uma porta inteira entre 1 e 65535.')
}

export const env = {
    mode,
    udid: value('ANDROID_UDID', 'emulator-5554'),
    deviceName: value('ANDROID_DEVICE_NAME', 'Android Emulator'),
    platformVersion: value('ANDROID_PLATFORM_VERSION', ''),
    appPackage: value('APP_PACKAGE', 'com.saucelabs.mydemoapp.android'),
    appActivity: value('APP_ACTIVITY', 'com.saucelabs.mydemoapp.android.view.activities.SplashActivity'),
    appWaitActivity: value('APP_WAIT_ACTIVITY', 'com.saucelabs.mydemoapp.android.view.activities.MainActivity'),
    appPath: path.resolve(projectRoot, value('APP_PATH', './app/my-demo-app.apk')),
    noReset: noReset === 'true',
    port,
}
