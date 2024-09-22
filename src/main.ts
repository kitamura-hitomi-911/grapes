import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs'
import grapesJsMjml from 'grapesjs-mjml'
import grapesJsNewsletter from 'grapesjs-preset-newsletter';
// @ts-ignore
import ja from './ja.js';
// @ts-ignore
import mjmlJa from './mjml-ja.js'
import './style.css'

// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

const isMjml = false

const cmnInitObj = {
  container : '#gjs',
  i18n: {
    // locale: 'en', // default locale
    // detectLocale: true, // by default, the editor will detect the language
    // localeFallback: 'en', // default fallback
    messages: { ja },
  },
  storageManager: false,
}
const initObjForMjml={
  plugins:[grapesJsMjml], 
  pluginsOpts: {
    [grapesJsMjml as any]: {
      useCustomTheme:false,
      i18n: { ja: mjmlJa }
    },
  },
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
} 

const initObjForNewsletter={
  plugins:[grapesJsNewsletter], 
  pluginsOpts: {
    [grapesJsNewsletter as any]: {
      useCustomTheme:false,
      i18n: { ja: mjmlJa }
    },
  },
  components: `<div><h1>よろしく</h1></div>`,
style: `'.txt-red{color: red}'`,
} 

console.log(grapesJsMjml)
const editor = grapesjs.init({
  ...cmnInitObj,
  ...(isMjml? initObjForMjml:initObjForNewsletter)
});
console.log(editor)

