import { LitElement, html } from 'lit';
import { customElement/* , property */ } from 'lit/decorators.js';
import mainStyles from './TiptapEditor.css?inline'
import remixicon from 'remixicon/fonts/remixicon.css?inline'

@customElement('tiptap-editor')
export class TiptapEditor extends LitElement {      

  createRenderRoot() {
    return this; // Light DOMにする
  }

  onBtnClick= (e:Event) => {
    e.preventDefault()
    console.log(e)
    const tgtElm = e.currentTarget as HTMLButtonElement
    const action = tgtElm.dataset.action || ''
    if(action){
        const event = new CustomEvent('on-click-tiptap-editor', {
            detail: { action },
            bubbles: true
            });
        
            // カスタムイベントを発火
            this.dispatchEvent(event);
    }
  }

  render() {
    return html`<style>${mainStyles}</style><style>${remixicon}</style>
    <div class="wrapper">
        <button data-action="textAlign" data-param="left" @click="${this.onBtnClick}" class="is-icon"><i class="ri-align-left"></i></button>
        <button data-action="textAlign" data-param="center" @click="${this.onBtnClick}" class="is-icon"><i class="ri-align-center"></i></button>
        <button data-action="textAlign" data-param="right" @click="${this.onBtnClick}" class="is-icon"><i class="ri-align-right"></i></button>
        <span class="separator"></span>
        <button data-action="bold" @click="${this.onBtnClick}" class="is-icon"><i class="ri-bold"></i></button>
        <button data-action="italic" @click="${this.onBtnClick}" class="is-icon"><i class="ri-italic"></i></button>
        <button data-action="underline" @click="${this.onBtnClick}" class="is-icon"><i class="ri-underline"></i></button>
        <span class="separator"></span>
        <button data-action="bulletList" @click="${this.onBtnClick}" class="is-icon"><i class="ri-list-unordered"></i></button>
        <button data-action="orderList" @click="${this.onBtnClick}" class="is-icon"><i class="ri-list-ordered"></i></button>
        <span class="separator"></span>
        <button data-action="h1" @click="${this.onBtnClick}" class="is-icon">H1</button>
        <button data-action="h2" @click="${this.onBtnClick}" class="is-icon">H2</button>
        <button data-action="h3" @click="${this.onBtnClick}" class="is-icon">H3</button>
        <button data-action="color" @click="${this.onBtnClick}">赤</button>
        <button data-action="color" @click="${this.onBtnClick}">青</button>
        <button data-action="color" @click="${this.onBtnClick}">黄色</button>
        <button data-action="color" @click="${this.onBtnClick}">黒</button>
        <button data-action="color" @click="${this.onBtnClick}">差し込みタグ</button>
        <button data-action="link" @click="${this.onBtnClick}" class="is-icon">Link</button>

        
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tiptap-editor': TiptapEditor;
  }
  interface HTMLElementEventMap {
    'on-click-tiptap-editor': CustomEvent;
  }
}