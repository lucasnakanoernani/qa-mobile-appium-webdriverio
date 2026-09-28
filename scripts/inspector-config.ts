import { androidCapabilities } from '../config/capabilities.js'

// Para exploração manual, preserva os dados. Nos testes, vale NO_RESET do .env.
console.log(JSON.stringify({
    ...androidCapabilities(),
    'appium:noReset': true,
}, null, 2))
