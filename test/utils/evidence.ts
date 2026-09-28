import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { driver } from '@wdio/globals'
import { projectRoot } from '../../config/env.js'

export async function saveFailureEvidence(title: string, error?: Error): Promise<void> {
    try {
        const slug = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 80)
        const stamp = new Date().toISOString().replace(/[:.]/g, '-')
        const dir = path.join(projectRoot, 'artifacts', 'failures', `${stamp}-${slug}`)
        mkdirSync(dir, { recursive: true })
        writeFileSync(path.join(dir, 'error.json'), JSON.stringify({
            title,
            date: new Date().toISOString(),
            message: error?.message ?? 'Falha sem mensagem',
            stack: error?.stack,
        }, null, 2))

        const captures = await Promise.allSettled([
            driver.saveScreenshot(path.join(dir, 'screenshot.png')),
            driver.getPageSource().then(xml => writeFileSync(path.join(dir, 'page-source.xml'), xml)),
        ])
        captures.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.warn(`Evidência ${index === 0 ? 'screenshot' : 'XML'} indisponível.`)
            }
        })
        console.log(`Evidências da falha: ${dir}`)
    } catch (captureError) {
        // Uma falha na coleta não deve ocultar o erro original do teste.
        console.warn('Não foi possível salvar as evidências:', captureError)
    }
}
