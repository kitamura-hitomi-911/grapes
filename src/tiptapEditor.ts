import { LitElement, html, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { computePosition, flip, shift } from "@floating-ui/dom";
import mainStyles from "./TiptapEditor.css?inline";
import remixicon from "remixicon/fonts/remixicon.css?inline";
import "./ColorPicker";

type SimpleBtnProp = {
  name:
    | "bold"
    | "italic"
    | "underline"
    | "bulletList"
    | "orderList"
    | "unlink"
    | "anchor"
    | "indent"
    | "outdent";
  attr?: Record<string, string>;
  label: string;
  icon?: string;
};
type LinkBtnProp = {
  name: "link";
  attr: { href: string; target: string };
  label: string;
  icon?: string;
};
type TextAlignBtnProp = {
  name: "textAlign";
  attr: { alignment: "left" | "center" | "right" };
  label: string;
  icon?: string;
};
type HeadingBtnProp = {
  name: "heading";
  attr: { level: "1" | "2" | "3" | "4" | "5" | "6" };
  label: string;
  icon?: string;
};
type FontFamilyBtnProp = {
  name: "fontFamily";
  attr: { name: string };
  label: string;
  icon?: string;
};
type FontSizeBtnProp = {
  name: "fontSize";
  attr: { size: string };
  label: string;
  icon?: string;
};
type TextStyleBtnProp = {
  name: "textStyle";
  attr: { color?: string };
  label: string;
  icon?: string;
};

type BtnProp = (SimpleBtnProp | LinkBtnProp | TextAlignBtnProp) & {
  ui: "btn_icon" | "btn_label";
};

type OpenBtnProp =
  | {
      name: "open-color";
      label: string;
      icon?: string;
      ui: "select_color";
      list: TextStyleBtnProp[];
      isOpen: boolean;
      isColorPickerOpen: boolean;
    }
  | {
      name: "open-link";
      label: string;
      icon?: string;
      ui: "btn_icon";
      isOpen: boolean;
    }
  | {
      name: "open-heading";
      label: string;
      icon?: string;
      ui: "select";
      list: HeadingBtnProp[];
      isOpen: boolean;
    }
  | {
      name: "open-fontFamily";
      label: string;
      icon?: string;
      ui: "select";
      list: FontFamilyBtnProp[];
      isOpen: boolean;
    }
  | {
      name: "open-fontSize";
      label: string;
      icon?: string;
      ui: "select";
      list: FontSizeBtnProp[];
      isOpen: boolean;
    }
  | {
      name: "open-mergetag";
      label: string;
      icon?: string;
      ui: "btn_label";
      isOpen: boolean;
    };

@customElement("tiptap-editor")
export class TiptapEditor extends LitElement {
  createRenderRoot() {
    return this; // Light DOMにする
  }

  @property({ type: Object })
  isShow: boolean = false;

  @property({ type: Object })
  state: {
    [key in
      | SimpleBtnProp["name"]
      | LinkBtnProp["name"]
      | TextAlignBtnProp["name"]
      | HeadingBtnProp["name"]
      | TextStyleBtnProp["name"]]: {
      isActive: boolean;
      isDisabled: boolean;
    };
  } = {
    textAlign: {
      isActive: false,
      isDisabled: false,
    },
    bold: {
      isActive: false,
      isDisabled: false,
    },
    italic: {
      isActive: false,
      isDisabled: false,
    },
    underline: {
      isActive: false,
      isDisabled: false,
    },
    textStyle: {
      isActive: false,
      isDisabled: false,
    },
    bulletList: {
      isActive: false,
      isDisabled: false,
    },
    orderList: {
      isActive: false,
      isDisabled: false,
    },
    indent: {
      isActive: false,
      isDisabled: false,
    },
    outdent: {
      isActive: false,
      isDisabled: false,
    },
    link: {
      isActive: false,
      isDisabled: false,
    },
    unlink: {
      isActive: false,
      isDisabled: false,
    },
    anchor: {
      isActive: false,
      isDisabled: false,
    },
    heading: {
      isActive: false,
      isDisabled: false,
    },
  };

  @state()
  isShowColorPicker: boolean = false;

  @state()
  actionList: (BtnProp | OpenBtnProp | "separator")[] = [
    {
      name: "textAlign",
      attr: { alignment: "left" },
      label: "左揃え",
      icon: "ri-align-left",
      ui: "btn_icon",
    },
    {
      name: "textAlign",
      attr: { alignment: "center" },
      label: "中央揃え",
      icon: "ri-align-center",
      ui: "btn_icon",
    },
    {
      name: "textAlign",
      attr: { alignment: "right" },
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
      name: "open-color",
      label: "文字色",
      icon: "ri-font-color",
      ui: "select_color",
      list: [
        {
          name: "textStyle",
          attr: { color: "#F94144" },
          label: "Color 1",
        },
        {
          name: "textStyle",
          attr: { color: "#F3722C" },
          label: "Color 2",
        },
        {
          name: "textStyle",
          attr: { color: "#F8961E" },
          label: "Color 3",
        },
        {
          name: "textStyle",
          attr: { color: "#F9C74F" },
          label: "Color 4",
        },
        {
          name: "textStyle",
          attr: { color: "#90BE6D" },
          label: "Color 5",
        },
        {
          name: "textStyle",
          attr: { color: "#43AA8B" },
          label: "Color 6",
        },
        {
          name: "textStyle",
          attr: { color: "#577590" },
          label: "Color 7",
        },
        {
          name: "textStyle",
          attr: { color: "#003049" },
          label: "Color 8",
        },
        {
          name: "textStyle",
          attr: { color: "#D62828" },
          label: "Color 9",
        },
        {
          name: "textStyle",
          attr: { color: "#F77F00" },
          label: "Color 10",
        },
        {
          name: "textStyle",
          attr: { color: "#FCBF49" },
          label: "Color 11",
        },
        {
          name: "textStyle",
          attr: { color: "#EAE2B7" },
          label: "Color 12",
        },
        {
          name: "textStyle",
          attr: { color: "#A8DADC" },
          label: "Color 13",
        },
        {
          name: "textStyle",
          attr: { color: "#457B9D" },
          label: "Color 14",
        },
        {
          name: "textStyle",
          attr: { color: "#1D3557" },
          label: "Color 15",
        },
        {
          name: "textStyle",
          attr: { color: "#264653" },
          label: "Color 16",
        },
        {
          name: "textStyle",
          attr: { color: "#2A9D8F" },
          label: "Color 17",
        },
        {
          name: "textStyle",
          attr: { color: "#E9C46A" },
          label: "Color 18",
        },
        {
          name: "textStyle",
          attr: { color: "#F4A261" },
          label: "Color 19",
        },
        {
          name: "textStyle",
          attr: { color: "#E76F51" },
          label: "Color 20",
        },
      ],
      isOpen: false,
      isColorPickerOpen: false,
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
    {
      name: "indent",
      label: "インデント",
      icon: "ri-indent-increase",
      ui: "btn_icon",
    },
    {
      name: "outdent",
      label: "インデントを戻す",
      icon: "ri-indent-decrease",
      ui: "btn_icon",
    },
    "separator",
    {
      name: "open-link",
      label: "リンク",
      icon: "ri-link",
      ui: "btn_icon",
      isOpen: false,
    },
    {
      name: "unlink",
      label: "リンク解除",
      icon: "ri-link-unlink",
      ui: "btn_icon",
    },
    {
      name: "anchor",
      label: "アンカータグ",
      icon: "ri-flag-line",
      ui: "btn_icon",
    },
    "separator",
    {
      name: "open-heading",
      label: "見出し",
      ui: "select",
      list: [
        {
          name: "heading",
          attr: { level: "1" },
          label: "Heading 1",
        },
        {
          name: "heading",
          attr: { level: "2" },
          label: "Heading 2",
        },
        {
          name: "heading",
          attr: { level: "3" },
          label: "Heading 3",
        },
      ],
      isOpen: false,
    },
    {
      name: "open-fontFamily",
      label: "フォント",
      ui: "select",
      list: [
        {
          name: "fontFamily",
          attr: { name: "" },
          label: "(default)",
        },
        {
          name: "fontFamily",
          attr: { name: "Arial, Helvetica, sans-serif" },
          label: "Arial",
        },
        {
          name: "fontFamily",
          attr: { name: "Helvetica, Arial, sans-serif" },
          label: "Helvetica",
        },
        {
          name: "fontFamily",
          attr: { name: "Verdana, Geneva, sans-serif" },
          label: "Verdana",
        },
        {
          name: "fontFamily",
          attr: { name: "Georgia, Times, Times New Roman, serif" },
          label: "Georgia",
        },
        {
          name: "fontFamily",
          attr: { name: "Times New Roman, Times, serif" },
          label: "Times New Roman",
        },
        {
          name: "fontFamily",
          attr: { name: "Tahoma, Geneva, sans-serif" },
          label: "Tahoma",
        },
        {
          name: "fontFamily",
          attr: { name: "Trebuchet MS, Helvetica, sans-serif" },
          label: "Trebuchet MS",
        },
        {
          name: "fontFamily",
          attr: { name: "Courier New, Courier, monospace" },
          label: "Courier New",
        },
        {
          name: "fontFamily",
          attr: { name: "Lucida Console, Monaco, monospace" },
          label: "Lucida Console",
        },
      ],
      isOpen: false,
    },
    {
      name: "open-fontSize",
      label: "フォントサイズ",
      ui: "select",
      list: [
        {
          name: "fontSize",
          attr: { size: "" },
          label: "default",
        },
        {
          name: "fontSize",
          attr: { size: "10px" },
          label: "10",
        },
        {
          name: "fontSize",
          attr: { size: "12px" },
          label: "12",
        },
        {
          name: "fontSize",
          attr: { size: "14px" },
          label: "14",
        },

        {
          name: "fontSize",
          attr: { size: "16px" },
          label: "16",
        },
        {
          name: "fontSize",
          attr: { size: "18px" },
          label: "18",
        },
        {
          name: "fontSize",
          attr: { size: "20px" },
          label: "20",
        },
        {
          name: "fontSize",
          attr: { size: "22px" },
          label: "22",
        },
        {
          name: "fontSize",
          attr: { size: "24px" },
          label: "24",
        },
      ],
      isOpen: false,
    },
    {
      name: "open-mergetag",
      label: "差し込みタグ",
      ui: "btn_label",
      isOpen: false,
    },
  ];

  resetOpen = () => {
    console.log("resetOpen");
    this.actionList = this.actionList.map((action) => {
      if (typeof action === "string") {
        return action;
      }
      if (action.name === "open-color") {
        return {
          ...action,
          isOpen: false,
          isColorPickerOpen: false,
        };
      }
      return action.name === "open-fontFamily" ||
        action.name === "open-heading" ||
        action.name === "open-fontSize" ||
        action.name === "open-link"
        ? {
            ...action,
            isOpen: false,
          }
        : action;
    });
  };

  openColorPicker = (e: Event) => {
    e.preventDefault();
    console.log(e);
    this.actionList = this.actionList.map((action) => {
      if (typeof action !== "string" && action.name === "open-color") {
        return { ...action, isColorPickerOpen: true };
      }
      return action;
    });
  };

  onBtnClick = (e: Event) => {
    e.preventDefault();
    const tgtElm = e.currentTarget as HTMLButtonElement;
    const action = tgtElm.dataset.action || "";
    const attr = tgtElm.dataset.attr || "";
    console.log("onBtnClick", action);
    if (action.startsWith("open")) {
      if (
        action === "open-color" ||
        action === "open-fontSize" ||
        action === "open-fontFamily" ||
        action === "open-heading"
      ) {
        console.log("ここきた");
        this.actionList = this.actionList.map((actionData) => {
          if (typeof actionData === "string") {
            return actionData;
          }
          if (
            actionData.name === "open-color" ||
            actionData.name === "open-fontSize" ||
            actionData.name === "open-fontFamily" ||
            actionData.name === "open-heading"
          ) {
            if (actionData.name === action) {
              return {
                ...actionData,
                isOpen: !actionData.isOpen,
                ...(actionData.name === "open-color"
                  ? { isColorPickerOpen: false }
                  : {}),
              };
            } else {
              console.log("isOpenを閉じた", action);
              return {
                ...actionData,
                isOpen: false,
                ...(actionData.name === "open-color"
                  ? { isColorPickerOpen: false }
                  : {}),
              };
            }
          }
          return actionData;
        });
        console.log(this.actionList);
        const optionsElm = tgtElm.parentElement?.querySelector<HTMLDivElement>(
          action === "open-color" ? ".color_options" : ".options"
        );
        if (optionsElm) {
          computePosition(tgtElm, optionsElm, {
            placement: "bottom-start",
            middleware: [flip(), shift()],
          }).then(({ x, y }) => {
            console.log(x, y);
            Object.assign(optionsElm.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
          });
        }
      } else if (action === "open-link") {
        const event = new CustomEvent("on-click-tiptap-editor", {
          detail: {
            action: "link",
            attr: {
              href: "https://example.com",
              target: "_blank",
            },
          },
          bubbles: true,
        });
        // カスタムイベントを発火
        this.dispatchEvent(event);
      } else if (action === "open-mergetag") {
        const event = new CustomEvent("on-click-tiptap-editor", {
          detail: {
            action: "mergetag",
            attr: {
              string: "hoge",
            },
          },
          bubbles: true,
        });
        // カスタムイベントを発火
        this.dispatchEvent(event);
      }
    } else if (action) {
      this.resetOpen();
      const event = new CustomEvent("on-click-tiptap-editor", {
        detail: { action, attr: attr ? JSON.parse(attr) || null : null },
        bubbles: true,
      });

      // カスタムイベントを発火
      this.dispatchEvent(event);
    }
  };

  willUpdate(changedProperties: PropertyValues) {
    // only need to check changed properties for an expensive computation.
    if (changedProperties.has("isShow")) {
      if (!this.isShow) {
        this.resetOpen();
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    console.log("きてる？disconnectedCallback");
  }

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
                  data-attr="${action.name === "textAlign"
                    ? JSON.stringify(action.attr)
                    : ""}"
                  @click="${this.onBtnClick}"
                  class="${classMap({
                    "is-icon": action.ui === "btn_icon",
                    "is-label": action.ui === "btn_label",
                    "is-select": action.ui === "select",
                    "is-active":
                      action.name !== "open-heading" &&
                      action.name !== "open-fontFamily" &&
                      action.name !== "open-fontSize" &&
                      action.name !== "open-mergetag" &&
                      action.name !== "open-color" &&
                      action.name !== "open-link"
                        ? this.state[action.name].isActive
                        : false,
                    "is-disabled":
                      action.name !== "open-heading" &&
                      action.name !== "open-fontFamily" &&
                      action.name !== "open-fontSize" &&
                      action.name !== "open-mergetag" &&
                      action.name !== "open-color" &&
                      action.name !== "open-link"
                        ? this.state[action.name].isDisabled
                        : false,
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
                  ? html`<div class="${classMap({
                      options: true,
                      "is-open": action.isOpen,
                    })}">
                      ${action.list.map(
                        (option) => html`<button
                          data-action="${option.name}"
                          data-attr="${option.attr
                            ? JSON.stringify(option.attr)
                            : ""}"
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
                ${action.ui === "select_color"
                  ? html`<div
                      class="${classMap({
                        color_options: true,
                        "is-open": action.isOpen,
                      })}"
                    >
                      <color-picker
                        .isShow="${action.isColorPickerOpen}"
                      ></color-picker>
                      <div
                        class="${classMap({
                          "color_options-inner": true,
                          "is-hide": action.isColorPickerOpen,
                        })}"
                      >
                        <div class="color_options-clear">自動</div>
                        <div class="color_options-panels">
                          ${action.list.map(
                            (option) => html`<button
                              data-action="${option.name}"
                              data-attr="${option.attr
                                ? JSON.stringify(option.attr)
                                : ""}"
                              @click="${this.onBtnClick}"
                              style="${styleMap({
                                "background-color":
                                  option.attr?.color || "#000",
                              })}"
                              class="is-color"
                            >
                              ${option.icon
                                ? html`<i class="${option.icon}"></i>`
                                : ""}
                            </button>`
                          )}
                        </div>
                        <div class="color_options-more">
                          <a href="#" @click="${this.openColorPicker}"
                            >他の色</a
                          >
                        </div>
                      </div>
                    </div>`
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
