# QA Mobile — Appium + WebdriverIO

Projeto de automação de testes Android com **TypeScript, Appium 3, UiAutomator2, WebdriverIO 9 e Mocha**, organizado com Page Objects.
Aplicativo de estudo: [My Demo App Android, da Sauce Labs](https://github.com/saucelabs/my-demo-app-android).

O projeto valida a abertura do catálogo e as operações de inclusão e remoção de produtos no carrinho, com cenários separados e captura automática de evidências em caso de falha.

**Status:** smoke e testes de carrinho executados com sucesso no emulador local, conforme validação realizada em **27/09/2026**. As execuções foram realizadas localmente; não há pipeline CI configurado.

## Cenários implementados e validados

| Arquivo | Cenário | Validações | Resultado local |
| --- | --- | --- | --- |
| `test/specs/smoke.spec.ts` | Abrir o aplicativo e exibir o catálogo | Pacote do app em primeiro plano, título e lista de produtos visíveis | Passou |
| `test/specs/carrinho.spec.ts` | Adicionar um produto ao carrinho | Nome e preço correspondem aos detalhes do produto; quantidade igual a 1 | Passou |
| `test/specs/carrinho.spec.ts` | Remover o produto do carrinho | Item deixa de ser exibido e o estado de carrinho vazio aparece | Passou |

O teste de inclusão compara os dados exibidos nas telas de produto e carrinho; ele não verifica o preço contra uma tabela externa de valores esperados.

## Organização dos testes

- **Page Objects:** elementos e ações de catálogo, produto e carrinho.
- **Specs:** passos dos cenários e assertions com `expect`.
- **Preparação independente:** cada teste de carrinho recria a sessão e prepara seu próprio produto, sem depender do teste anterior.
- **Esperas por elementos:** uso de `waitForDisplayed` antes das interações necessárias.
- **Evidências de falhas:** screenshot, hierarquia XML e detalhes do erro.
- **Configuração por ambiente:** seleção do emulador e do aplicativo por `.env`.

## 1. Preparar o ambiente

- Node.js **24.x** e npm **10 ou superior**.
- Java JDK, com `JAVA_HOME` apontando para a pasta raiz do JDK. Na configuração local, foi utilizado o JDK distribuído com o Android Studio (`jbr`).
- Android Studio, Android SDK e Platform Tools, com `ANDROID_HOME` configurado e `platform-tools` no `PATH`.
- Emulador Android **8/API 26 ou superior**, criado no Device Manager.
- Appium Inspector, se quiser explorar os elementos das telas.

O Android Studio inicia o emulador; os testes são executados no terminal do VS Code.
Use uma pasta nova para este projeto.

```powershell
node --version
npm --version
java -version
adb devices -l
```

Na pasta que contém `package.json`:

```powershell
npm ci
```

Crie um arquivo `.env` na raiz usando a configuração abaixo. Se existir `.env.example`, você pode copiá-lo para `.env`. Caso seu `.env` já esteja configurado e funcionando, mantenha os valores locais.

```dotenv
APP_MODE=installed
ANDROID_UDID=emulator-5554
ANDROID_DEVICE_NAME=Android Emulator
ANDROID_PLATFORM_VERSION=
APP_PACKAGE=com.saucelabs.mydemoapp.android
APP_ACTIVITY=com.saucelabs.mydemoapp.android.view.activities.SplashActivity
APP_WAIT_ACTIVITY=com.saucelabs.mydemoapp.android.view.activities.MainActivity
APP_PATH=./app/my-demo-app.apk
NO_RESET=false
APPIUM_PORT=4723
```

Ajuste o UDID conforme `adb devices -l`. O exemplo usa o aplicativo já instalado; o modo APK está descrito abaixo.

Depois, confira o ambiente:

```powershell
npm run doctor
```

Appium e UiAutomator2 já estão nas dependências locais do projeto. Não é necessário instalar outra versão global.
O driver é descoberto pelas dependências npm locais. Se precisar conferir, execute na raiz:

```powershell
npx --no-install appium driver list --installed
```

O Doctor verifica o ambiente Android; corrija requisitos obrigatórios apontados antes de executar os testes.
Depois da instalação, o `package-lock.json` deve continuar versionado para manter as dependências reproduzíveis.

## 2. Usar o app que já está instalado (padrão)

1. Inicie o emulador no **Android Studio → Device Manager**.
2. Instale o APK nativo Android da [página oficial de releases](https://github.com/saucelabs/my-demo-app-android/releases), caso ainda não esteja instalado.
3. Rode `npm run devices` e confira o identificador que aparece com status `device`.
4. Ajuste `ANDROID_UDID` no `.env` se for diferente de `emulator-5554`.
5. Mantenha `APP_MODE=installed`.

**Você pode abrir o aplicativo manualmente para explorá-lo, mas não precisa fazer isso para rodar o teste.**
O Appium abre a activity configurada e aguarda a tela principal automaticamente. O emulador deve estar ligado.

O padrão é para **My Demo App nativo Android**, com estas informações confirmadas no código público do app:

| Campo | Valor |
| --- | --- |
| `APP_PACKAGE` | `com.saucelabs.mydemoapp.android` |
| `APP_ACTIVITY` | `com.saucelabs.mydemoapp.android.view.activities.SplashActivity` |
| `APP_WAIT_ACTIVITY` | `com.saucelabs.mydemoapp.android.view.activities.MainActivity` |

Se baixou o app React Native ou outro app, pacote, activity e seletores serão diferentes.
`ANDROID_PLATFORM_VERSION` é opcional: deixe vazio para evitar fixar uma versão diferente da do seu emulador.

### Conferir o pacote e a activity no Windows

```powershell
adb -s emulator-5554 shell pm list packages | Select-String saucelabs
adb -s emulator-5554 shell cmd package resolve-activity --brief com.saucelabs.mydemoapp.android
```

Troque `emulator-5554` pelo seu UDID. O segundo comando mostra a activity de abertura.
Para conferir a activity atual, abra o app manualmente e use:

```powershell
adb -s emulator-5554 shell dumpsys activity activities | Select-String 'mResumedActivity|topResumedActivity'
```

## 3. Alternativa: instalar pelo APK

Coloque o arquivo em `app/my-demo-app.apk` e ajuste o `.env`:

```dotenv
APP_MODE=apk
APP_PATH=./app/my-demo-app.apk
```

Mantenha os campos de pacote/activity correspondentes ao APK. O Appium instala/usa o APK e abre o app.
O caminho é resolvido a partir da raiz do projeto, sem caminhos pessoais fixos.
O APK não é versionado. Crie a pasta `app` se ela ainda não existir e baixe o arquivo pela página oficial de releases indicada acima.

## 4. Executar

```powershell
npm run typecheck
npm run test:smoke
```

Para executar somente os testes de carrinho:

```powershell
npm test -- --spec ./test/specs/carrinho.spec.ts
```

Para executar todos os cenários:

```powershell
npm test
```

O comando `npm run wdio` também executa a configuração principal.

**O WebdriverIO inicia e encerra o servidor Appium automaticamente.** Não inicie outro servidor na mesma porta durante os testes.

Por padrão, `NO_RESET=false` limpa os dados do app de demonstração no início da sessão para um estado previsível.
Isso pode apagar login/carrinho do app; não apaga o emulador nem desinstala o aplicativo.
Se usar `NO_RESET=true`, o app será reaberto, mas seus dados persistirão; o estado salvo poderá afetar os cenários.
No `carrinho.spec.ts`, o `beforeEach` chama `driver.reloadSession()` antes de aguardar o catálogo. Com `NO_RESET=false`, a nova sessão prepara o app para o próximo cenário. Cada teste adiciona o próprio produto.

A recriação de sessão aumenta o tempo de execução, mas mantém a preparação independente entre os testes de carrinho.

## 5. Inspecionar elementos

Com os testes parados, execute:

```powershell
npm run appium
```

Em outro terminal, execute:

```powershell
npm run inspector:config
```

Copie somente o JSON impresso para o Appium Inspector. Configure:

- Remote Host: `127.0.0.1`
- Remote Port: `4723` (ou o valor de `APPIUM_PORT`)
- Remote Path: `/`
- SSL: desativado

O JSON usa seu `.env`, com `noReset=true` para preservar os dados durante a exploração.
Ao terminar, encerre a sessão no Inspector e pare o servidor com `Ctrl+C` antes de rodar `npm test`.
O Inspector funciona de forma independente; a base não precisa de assistentes ou integrações externas.

## 6. Estrutura e evidências

| Caminho | Finalidade |
| --- | --- |
| `wdio.conf.ts` | Runner, serviço Appium, Mocha, reporter e hooks |
| `config/env.ts` | Leitura e validação do `.env` |
| `config/capabilities.ts` | Configuração Android e escolha instalado/APK |
| `test/pageobjects/page.ts` | Ações Android compartilhadas |
| `test/pageobjects/catalogo.page.ts` | Elementos do catálogo, espera e abertura do produto |
| `test/pageobjects/produto.page.ts` | Dados do produto, inclusão e acesso ao carrinho |
| `test/pageobjects/carrinho.page.ts` | Elementos do carrinho e remoção do produto |
| `test/specs/smoke.spec.ts` | Abertura do app e exibição do catálogo |
| `test/specs/carrinho.spec.ts` | Inclusão e remoção de produto, com validações |
| `test/fixtures/` | Pasta reservada para massas de teste |
| `test/utils/evidence.ts` | Screenshot, XML e erro em falhas |
| `scripts/inspector-config.ts` | Gera capabilities para exploração manual |
| `docs/execucoes.md` | Registro de resultados reais |

Falhas de testes/hooks geram evidências em `artifacts/failures/`, quando a sessão está disponível.
Falhas anteriores à criação da sessão devem ser investigadas nos logs em `artifacts/appium/` e `artifacts/wdio/`.
`artifacts/run-summary.json` registra o status e o horário da última execução, sem contagens fictícias.

## 7. Versionamento

O `.gitignore` mantém fora do repositório:

- `node_modules/`;
- `.env` e suas variações, com exceção de `.env.example`;
- APKs em `app/`;
- `artifacts/` e arquivos de log;
- configurações locais do editor.

O código, o `package.json`, o `package-lock.json` e a documentação devem ser versionados.
A pasta `artifacts/failures/` pode conter registros de tentativas anteriores mesmo após os testes passarem. Esses registros são locais e não representam o resultado da execução mais recente.

## Problemas comuns

| Sintoma | O que conferir |
| --- | --- |
| `adb` não reconhecido | SDK Platform Tools e `PATH`; reabra completamente o VS Code após ajustar |
| `JAVA_HOME` não definido | Aponte para a raiz do JDK e adicione sua pasta `bin` ao `PATH` |
| Aviso de compatibilidade de 16 KB | Confira a compatibilidade do APK com a imagem do emulador; uma imagem padrão de 4 KB evita esse aviso específico |
| Emulador encerra antes de abrir | Consulte os logs; no diagnóstico local foi identificado espaço insuficiente para criar a partição de dados |
| `invalid selector` / `Unclosed paren` | Revise os parênteses e a expressão do seletor; para elemento visível, use `UiSelector` sem envolver em `UiScrollable` |
| Device `offline` ou ausente | Emulador iniciado, UDID correto e boot concluído |
| App não instalado | Instale o APK no mesmo emulador ou use `APP_MODE=apk` |
| Activity não encontrada | Pacote/activity do app nativo; não use os valores da versão React Native |
| APK não encontrado | `APP_PATH` no `.env` e nome do arquivo em `app/` |
| Porta 4723 ocupada | Encerre o Appium manual/Inspector ou escolha outra `APPIUM_PORT` |
| TypeScript/Node incompatível | Use Node 24.x e reinstale com `npm ci` |
| Catálogo não encontrado | Confirme resource IDs no Inspector e a versão do APK |

## Referências

- [WebdriverIO — Appium Service](https://webdriver.io/docs/appium-service/)
- [UiAutomator2 — requisitos e capabilities](https://github.com/appium/appium-uiautomator2-driver)
- [Appium — dependências npm locais](https://appium.io/docs/en/latest/guides/managing-exts/)
- [Manifest do app de demonstração](https://github.com/saucelabs/my-demo-app-android/blob/main/app/src/main/AndroidManifest.xml)
- [Layout do catálogo usado como referência](https://github.com/saucelabs/my-demo-app-android/blob/main/app/src/main/res/layout/fragment_product_catalog.xml)

O aplicativo de demonstração pertence aos seus mantenedores. Este repositório contém a automação e não redistribui o APK.
