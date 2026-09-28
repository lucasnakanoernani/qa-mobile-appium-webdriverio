import { existsSync, statSync } from 'node:fs'
import { env } from './env.js'

export function androidCapabilities() {
    if (env.mode === 'apk' && (!existsSync(env.appPath) || !statSync(env.appPath).isFile())) {
        throw new Error(`APK não encontrado: ${env.appPath}. Ajuste APP_PATH ou use APP_MODE=installed.`)
    }

    return {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:udid': env.udid,
        'appium:deviceName': env.deviceName,
        ...(env.platformVersion ? { 'appium:platformVersion': env.platformVersion } : {}),
        ...(env.mode === 'apk' ? { 'appium:app': env.appPath } : {}),
        'appium:appPackage': env.appPackage,
        'appium:appActivity': env.appActivity,
        'appium:appWaitActivity': env.appWaitActivity,
        'appium:autoLaunch': true,
        'appium:autoGrantPermissions': true,
        'appium:noReset': env.noReset,
        'appium:fullReset': false,
        'appium:forceAppLaunch': true,
        'appium:newCommandTimeout': 120,
    }
}
