import { LitElement, html } from "lit";
import { customElement, property, state, queryAll } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { computePosition, flip, shift } from "@floating-ui/dom";
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
        ui: "btn_icon" | "btn_label";
      }
    | {
        name: string;
        param?: string;
        label: string;
        icon?: string;
        ui: "select";
        list: {
          name: string;
          param?: string;
          label: string;
          icon?: string;
        }[];
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
      icon: "ri-link",
      ui: "btn_icon",
    },
    {
      name: "unlink",
      label: "リンク解除",
      icon: "ri-link-unlink",
      ui: "btn_icon",
    },
    "separator",
    {
      name: "open-heading",
      label: "見出し",
      ui: "select",
      list: [
        {
          name: "h1",
          label: "H1",
          icon: "ri-h-1",
        },
        {
          name: "h2",
          label: "H2",
          icon: "ri-h-2",
        },
        {
          name: "h3",
          label: "H3",
          icon: "ri-h-3",
        },
      ],
    },
    {
      name: "mergetag",
      label: "差し込みタグ",
      ui: "btn_label",
    },
  ];

  @queryAll(".options")
  optionsElms!: NodeListOf<HTMLDivElement>;

  toggleOptions = (btnElm: HTMLButtonElement) => {
    const optionsElm =
      btnElm.parentElement?.querySelector<HTMLDivElement>(".options");
    if (!optionsElm) {
      return;
    }
    if (optionsElm.classList.contains("is-show")) {
      optionsElm.classList.remove("is-show");
      return;
    }
    optionsElm.classList.add("is-show");
    computePosition(btnElm, optionsElm, {
      placement: "bottom-start",
      middleware: [flip(), shift()],
    }).then(({ x, y }) => {
      console.log(x, y);
      Object.assign(optionsElm.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  };

  onBtnClick = (e: Event) => {
    e.preventDefault();
    console.log(e);
    const tgtElm = e.currentTarget as HTMLButtonElement;
    const action = tgtElm.dataset.action || "";
    console.log(action);
    if (action.startsWith("open")) {
      this.toggleOptions(tgtElm);
    } else if (action) {
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
            : html`<div class="btn_wrapper">
                <button
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
                    ? html`<span class="dropdown_icon"
                        ><i class="ri-arrow-down-s-line"></i
                      ></span>`
                    : ""}
                </button>
                ${action.ui === "select"
                  ? html`<div class="options">
                      ${action.list.map(
                        (option) => html`<button
                          data-action="${option.name}"
                          data-param="${option.param}"
                          @click="${this.onBtnClick}"
                          class="is-option"
                        >
                          ${option.icon
                            ? html`<i class="${option.icon}"></i>`
                            : ""}
                          <span class="label">${option.label}</span>
                        </button>`
                      )}
                    </div></div>`
                  : ""}
              </div> `
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
