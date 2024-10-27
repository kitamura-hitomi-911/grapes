import "grapesjs/dist/css/grapes.min.css";
import grapesjs from "grapesjs";
import grapesJsMjml from "grapesjs-mjml";
import grapesJsNewsletter from "grapesjs-preset-newsletter";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import {grapesjsPluginCkeditor5} from './grapesjsPluginCkeditor5'
// import gjsPluginCkeditor from 'grapesjs-plugin-ckeditor'
import grapesjsPluginTiptap from "./grapesjsPluginTiptap";
// import {tinymcePlugin} from './tinymcePlugin'
// @ts-ignore
import ja from "./ja.js";
// @ts-ignore
import mjmlJa from "./mjml-ja.js";
import prosemirrorStyle from "prosemirror-view/style/prosemirror.css?inline";
import "./style.css";

declare var CKEDITOR: any;

console.log("CKEDITOR" in window);

const isMjml = true;

const cmnInitObj = {
  container: "#gjs",
  height: "100vh", // これがないと位置計算が変だよ
  i18n: {
    // locale: 'en', // default locale
    // detectLocale: true, // by default, the editor will detect the language
    // localeFallback: 'en', // default fallback
    messages: { ja },
  },
  storageManager: false,
  cssIcons: "", //cdn 置きのアイコンは読み込ませないよ
};
const initObjForMjml = {
  plugins: [grapesJsMjml, grapesjsPluginTiptap],
  pluginsOpts: {
    [grapesJsMjml as any]: {
      useCustomTheme: false,
      i18n: { ja: mjmlJa },
    },
    [grapesjsPluginTiptap as any]: {},
  },
  components: `<mjml>
  <mj-body>
    <!-- Your MJML body here -->
    <mj-section>
      <mj-column>
        <mj-text>My Company</mj-text>
        <mj-text>My Company2</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
  style: `'.txt-red{color: red}'`,
};

const initObjForNewsletter = {
  canvas: {
    styles: ["./newsletter-style.css"], // 外部CSSファイルのパス
  },
  /**
   * fromElement: true, で、対象要素内のスタイルをいかすこともできる
   */
  plugins: [grapesJsNewsletter],
  pluginsOpts: {
    [grapesJsNewsletter as any]: {
      // i18n がきかない
      modalLabelImport: "あああPaste all your code here below and click import",
      modalLabelExport: "いいいCopy the code and use it wherever you want",
      importPlaceholder:
        '<table class="table"><tr><td class="cell">うぇいHello world!</td></tr></table>',
      cellStyle: {
        "font-size": "12px",
        "font-weight": 300,
        "vertical-align": "top",
        color: "rgb(111, 119, 125)",
        margin: 0,
        padding: 0,
      },
    },
  },
  components: `<div><h1>よろしく</h1></div>`,
  style: `'.txt-red{color: red}'`,
};

const editor = grapesjs.init({
  ...cmnInitObj,
  ...(isMjml ? initObjForMjml : initObjForNewsletter),
});

editor.on("load", () => {
  // パネルの「表示/非表示」ボタン（sw-visibility）を取得
  const visibilityBtn = editor.Panels.getButton("options", "sw-visibility");
  if (visibilityBtn) {
    const baseClassName = visibilityBtn.className;
    const newClassName = baseClassName.replace("fa-square-o", "far fa-square");
    visibilityBtn.set({ className: newClassName });
  }

  const iframe = editor.Canvas.getFrameEl();
  const iframeHead = iframe.contentDocument?.head;
  const styleTag = document.createElement("style");
  styleTag.textContent = prosemirrorStyle;
  iframeHead?.appendChild(styleTag);
});
console.log(editor);
