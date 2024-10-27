import { LitElement, html, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import Pickr from "@simonwep/pickr";
import "@simonwep/pickr/dist/themes/nano.min.css";

@customElement("color-picker")
export class TiptapEditor extends LitElement {
  createRenderRoot() {
    return this; // Light DOMにする
  }

  pickr: Pickr | null = null;

  @property({ type: Boolean, attribute: "is-show" })
  isShow: boolean = false;

  createPickr = () => {
    this.pickr = Pickr.create({
      el: ".color_picker_tgt",
      // container: ".aaa",
      theme: "nano", // or 'monolith', or 'nano'
      inline: true,
      /* 
          swatches: [
            "rgba(244, 67, 54, 1)",
            "rgba(233, 30, 99, 0.95)",
            "rgba(156, 39, 176, 0.9)",
            "rgba(103, 58, 183, 0.85)",
            "rgba(63, 81, 181, 0.8)",
            "rgba(33, 150, 243, 0.75)",
            "rgba(3, 169, 244, 0.7)",
            "rgba(0, 188, 212, 0.7)",
            "rgba(0, 150, 136, 0.75)",
            "rgba(76, 175, 80, 0.8)",
            "rgba(139, 195, 74, 0.85)",
            "rgba(205, 220, 57, 0.9)",
            "rgba(255, 235, 59, 0.95)",
            "rgba(255, 193, 7, 1)",
          ], */

      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          /* hex: true,
          rgba: true,
          hsla: true,
          hsva: true,
          cmyk: true,*/
          input: true,
          /* clear: true,*/
          save: true,
          cancel: true,
        },
      },
      i18n: {
        // Strings visible in the UI
        "ui:dialog": "color picker dialog",
        "btn:toggle": "toggle color picker dialog",
        "btn:swatch": "color swatch",
        "btn:last-color": "use previous color",
        "btn:save": "選択",
        "btn:cancel": "キャンセル",
        "btn:clear": "クリア",

        // Strings used for aria-labels
        "aria:btn:save": "save and close",
        "aria:btn:cancel": "cancel and close",
        "aria:btn:clear": "clear and close",
        "aria:input": "color input field",
        "aria:palette": "color selection area",
        "aria:hue": "hue selection slider",
        "aria:opacity": "selection slider",
      },
    });
    this.pickr.on("init", (instance: Pickr) => {
      console.log('Event: "init"', instance);
      instance.show();
    });

    this.pickr
      .on("init", (instance: Pickr) => {
        console.log('Event: "init"', instance);
        instance.show();
      })
      .on("hide", (instance: Pickr) => {
        console.log('Event: "hide"', instance);
      })
      .on("show", (color: Pickr.HSVaColor, instance: Pickr) => {
        console.log('Event: "show"', color, instance);
      })
      .on("save", (color: Pickr.HSVaColor, instance: Pickr) => {
        console.log('Event: "save"', color, instance);
      })
      .on("clear", (instance: Pickr) => {
        console.log('Event: "clear"', instance);
      })
      .on(
        "change",
        (color: Pickr.HSVaColor, source: string, instance: Pickr) => {
          console.log('Event: "change"', color, source, instance);
        }
      )
      .on("changestop", (source: string, instance: Pickr) => {
        console.log('Event: "changestop"', source, instance);
      })
      .on("cancel", (instance: Pickr) => {
        console.log('Event: "cancel"', instance);
      })
      .on("swatchselect", (color: Pickr.HSVaColor, instance: Pickr) => {
        console.log('Event: "swatchselect"', color, instance);
      });
  };

  firstUpdated() {
    console.log("firstUpdated");
  }

  willUpdate(changedProperties: PropertyValues) {
    // only need to check changed properties for an expensive computation.
    if (changedProperties.has("isShow")) {
      if (this.isShow) {
        if (!this.pickr) {
          this.createPickr();
        } else {
          this.pickr.show();
        }
      } else {
        this.pickr?.hide();
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    console.log("disconnectedCallback");
    if (this.pickr) {
      this.pickr.destroy(); // Pickrインスタンスを破棄
      this.pickr = null; // 参照をクリア
    }
  }

  render() {
    return html`<style>
        .pickr {
          display: none;
        }
        .color_picker_wrapper {
          display: none;

          &.is-show {
            display: block;
          }
        }
      </style>
      <div
        class="${classMap({
          color_picker_wrapper: true,
          "is-show": this.isShow,
        })}"
      >
        <div class="color_picker_tgt"></div>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "color-picker": TiptapEditor;
  }
}
