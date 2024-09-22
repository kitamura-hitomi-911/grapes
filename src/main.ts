import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs'
// @ts-ignore
import ja from './ja.js';
import grapesJSMJML from 'grapesjs-mjml'
import './style.css'

// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'


console.log(grapesJSMJML)
const editor = grapesjs.init({
  container : '#gjs',
  i18n: {
    // locale: 'en', // default locale
    // detectLocale: true, // by default, the editor will detect the language
    // localeFallback: 'en', // default fallback
    messages: { ja },
  },
  plugins:[grapesJSMJML],
  pluginsOpts: {
    [grapesJSMJML as any]: {
      useCustomTheme:false
    },
  },
  storageManager: false,
  components: `<mjml>
    <mj-body>
      <!-- Your MJML body here -->
      <mj-section>
        <mj-column>
          <mj-text>My Company</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`,
  style: `'.txt-red{color: red}'`,
});
console.log(editor)
/* 
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!) */
