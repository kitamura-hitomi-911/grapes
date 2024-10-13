import { LitElement, css, html } from 'lit';
import { customElement/* , property */ } from 'lit/decorators.js';
import 'remixicon/fonts/remixicon.css'

@customElement('tiptap-editor')
export class TiptapEditor extends LitElement {
    createRenderRoot() {
        return this; // shadow DOMではなくlight DOMを使用する
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
    return html`<div class="wrapper">
        <button data-action="bold" @click="${this.onBtnClick}"><i class="ri-bold"></i></button>
        <button data-action="italic" @click="${this.onBtnClick}"<i class="ri-italic"></i></button>
        <button data-action="underline" @click="${this.onBtnClick}"><i class="ri-underline"></i></button>
        <button data-action="h1" @click="${this.onBtnClick}">H1</button>
        <button data-action="h2" @click="${this.onBtnClick}">H2</button>
        <button data-action="h3" @click="${this.onBtnClick}">H3</button>
        <button data-action="color" @click="${this.onBtnClick}">赤</button>
        <button data-action="color" @click="${this.onBtnClick}">青</button>
        <button data-action="color" @click="${this.onBtnClick}">黄色</button>
        <button data-action="color" @click="${this.onBtnClick}">黒</button>
        <button data-action="color" @click="${this.onBtnClick}">差し込みタグ</button>
        <button data-action="link" @click="${this.onBtnClick}">Link</button>
        <button data-action="bulletList" @click="${this.onBtnClick}">UL</button>
        <button data-action="orderList" @click="${this.onBtnClick}">OL</button>
        <button data-action="textAlign" @click="${this.onBtnClick}">Left</button>
        </div>
    `;
  }

  static styles = css`
    .wrapper{
    display:flex;
    align-items:center
    flex-wrap:wrap:
    }
     button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'tiptap-editor': TiptapEditor;
  }
  interface HTMLElementEventMap {
    'on-click-tiptap-editor': CustomEvent;
  }
}