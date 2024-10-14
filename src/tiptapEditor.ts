import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import mainStyles from "./TiptapEditor.css?inline";
import remixicon from "remixicon/fonts/remixicon.css?inline";

@customElement("tiptap-editor")
export class TiptapEditor extends LitElement {
  createRenderRoot() {
    return this; // Light DOMにする
  }

  @property()
  hoge: boolean = true;

  @state()
  actionList: (
    | {
        name: string;
        param?: string;
        label: string;
        icon?: string;
        ui: "btn_icon" | "btn_label" | "select";
      }
    | "separator"
  )[] = [
    {
      name: "textAlign",
      param: "left",
      label: "左揃え",
      icon: "ri-align-left",
      ui: "btn_icon",
    },
    {
      name: "textAlign",
      param: "center",
      label: "中央揃え",
      icon: "ri-align-center",
      ui: "btn_icon",
    },
    {
      name: "textAlign",
      param: "right",
      label: "右揃え",
      icon: "ri-align-center",
      ui: "btn_icon",
    },
    "separator",
    {
      name: "bold",
      label: "太字",
      icon: "ri-bold",
      ui: "btn_icon",
    },
    {
      name: "italic",
      label: "斜体",
      icon: "ri-italic",
      ui: "btn_icon",
    },
    {
      name: "underline",
      label: "下線",
      icon: "ri-underline",
      ui: "btn_icon",
    },
    "separator",
    {
      name: "bulletList",
      label: "箇条書き",
      icon: "ri-list-unordered",
      ui: "btn_icon",
    },
    {
      name: "orderList",
      label: "ナンバリング",
      icon: "ri-list-ordered",
      ui: "btn_icon",
    },
    "separator",
    {
      name: "link",
      label: "リンク",
      icon: "ri-list-ordered",
      ui: "btn_icon",
    },
    {
      name: "h1",
      label: "見出し",
      ui: "select",
    },
    {
      name: "mergetag",
      label: "差し込みタグ",
      ui: "btn_label",
    },
  ];

  onBtnClick = (e: Event) => {
    e.preventDefault();
    console.log(e);
    const tgtElm = e.currentTarget as HTMLButtonElement;
    const action = tgtElm.dataset.action || "";
    if (action) {
      const event = new CustomEvent("on-click-tiptap-editor", {
        detail: { action },
        bubbles: true,
      });

      // カスタムイベントを発火
      this.dispatchEvent(event);
    }
  };

  render() {
    return html`<style>
        ${mainStyles}</style
      ><style>
        ${remixicon}
      </style>
      <div class="wrapper">
        ${this.actionList.map((action) =>
          action === "separator"
            ? html`<span class="separator"></span>`
            : html`<button
                data-action="${action.name}"
                data-param="${action.param}"
                @click="${this.onBtnClick}"
                class="${classMap({
                  "is-icon": action.ui === "btn_icon",
                  "is-label": action.ui === "btn_label",
                  "is-select": action.ui === "select",
                })}"
              >
                ${action.icon
                  ? html`<i class="${action.icon}"></i>`
                  : html`<span class="label">${action.label}</span>`}
                ${action.ui === "select"
                  ? html`<span class="dropdown"
                      ><i class="ri-arrow-down-s-line"></i
                    ></span>`
                  : ""}
              </button>`
        )}
      </div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tiptap-editor": TiptapEditor;
  }
  interface HTMLElementEventMap {
    "on-click-tiptap-editor": CustomEvent;
  }
}
