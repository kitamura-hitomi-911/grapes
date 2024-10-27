import { Editor, Node /* , mergeAttributes */ } from "@tiptap/core";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Strike } from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontSize } from "./FontSize";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Editor as GrapesJSEditor } from "grapesjs";
import "./tiptapEditor";

const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        // Customize the HTML parsing (for example, to load the initial content)
        parseHTML: (element) => {
          return element.getAttribute("style");
        },
        // … and customize the HTML rendering.
        renderHTML: (attributes) => {
          return attributes.style
            ? {
                style: attributes.style,
              }
            : {};
        },
      },
      isInitialLoad: {
        default: false,
        parseHTML: () => true, // 初回読み込み時は true
        renderHTML: () => {
          return {};
        },
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    // 初回読み込み時には受け取ったスタイルをそのまま使用
    if (node.attrs.isInitialLoad) {
      return [`h${level}`, HTMLAttributes, 0];
    }

    // Tiptap内で変更が加わった場合に適用するフォントサイズ
    const tiptapFontSize =
      level === 1 ? "font-size: 145%;" : level === 2 ? "font-size: 130%;" : "";

    // 現在のスタイルに font-size があるかチェックし、削除
    const existingStyle = (HTMLAttributes.style || "")
      .replace(/font-size:\s*\S+;?/g, "")
      .trim();

    // Tiptap の font-size をマージ
    const mergedStyle = `${existingStyle} ${tiptapFontSize}`.trim();

    return [
      `h${level}`, // レベルに応じたタグ名
      { ...HTMLAttributes, style: mergedStyle }, // 属性にスタイルをマージ
      0,
    ];
  },
});

const CustomDiv = Node.create({
  name: "customDiv",

  group: "block", // div をブロック要素として扱う
  content: "inline*", // div の中にはインライン要素のみ許可する（p タグを含まない）
  // content: 'block*',

  parseHTML() {
    return [
      {
        tag: "div",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },
});

const CustomAnchor = Node.create({
  name: "customAnchor",
  inline: true,
  group: "inline",
  atom: true,

  addAttributes() {
    return {
      name: {
        default: null,
      },
      id: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a[name]:not([href])",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["a", HTMLAttributes];
  },
});

// https://github.com/ueberdosis/tiptap/issues/118
// li の中の p は編集上必要なので消えない

const tiptapRTEPlugin = (grapesjsEditor: GrapesJSEditor) => {
  let tiptapEditor: Editor | null = null;
  let tiptapToolbar: HTMLDivElement | null;
  const tiptapEditorUi: HTMLElementTagNameMap["tiptap-editor"] =
    document.createElement("tiptap-editor");

  grapesjsEditor.setCustomRte({
    enable: (el: HTMLElement, rte: Editor | null) => {
      if (rte && !rte.isDestroyed) {
        console.log(rte);
        return rte;
      }
      console.log("rteをつくる流れ", el, rte);

      const tgtComponentStyle = el.getAttribute("style");

      const updateIsActive = (editor: Editor) => {
        tiptapEditorUi.state = {
          textAlign: {
            isActive: false,
            isDisabled: false,
          },
          bold: {
            isActive: editor?.isActive("bold") || false,
            isDisabled: false,
          },
          italic: {
            isActive: editor?.isActive("italic") || false,
            isDisabled: false,
          },
          underline: {
            isActive: editor?.isActive("underline") || false,
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
            isDisabled:
              !editor.isActive("listItem") ||
              !editor.can().sinkListItem("listItem"),
          },
          outdent: {
            isActive: false,
            isDisabled:
              !editor.isActive("listItem") ||
              !editor.can().liftListItem("listItem"),
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
      };

      tiptapEditor = new Editor({
        element: el.parentElement as HTMLElement,
        extensions: [
          Document,
          Paragraph,
          Bold,
          Italic,
          Strike,
          CustomDiv,
          CustomHeading,
          Underline,
          Text,
          TextStyle,
          Color,
          FontSize,
          Link,
          CustomAnchor,
          TextAlign.configure({
            types: ["heading", "paragraph", "customDiv"],
          }),
          BulletList,
          OrderedList,
          ListItem,
          FontFamily,
          HardBreak,
        ],
        content: el.innerHTML,
        editorProps: {
          attributes: {
            class: "tiptap-editor is-hide",
            style: tgtComponentStyle || "",
          },
        },
        onCreate: ({ editor }) => {
          el.style.display = "none";
          editor.view.dom.classList.remove("is-hide");
          grapesjsEditor.refresh(); // これ必要だったよ
          tiptapEditorUi.isShow = true;
        },
        onDestroy: () => {
          el.style.display = "block";
        },
        onUpdate: ({ editor }) => {
          updateIsActive(editor);
        },
        onSelectionUpdate: ({ editor }) => {
          updateIsActive(editor);
        },
        /* 
        onUpdate: ({ editor }) => {
          const innerHtml = editor.getHTML()
          console.log('el', el)
          console.log(innerHtml)
          // el.innerHTML = editor.getHTML()
          const component = grapesjsEditor.getSelected()
          console.log(component)
          if (component) {
            // component.set('content', innerHtml)
          }
        }, */
      });

      if (!tiptapToolbar) {
        // Tiptapのツールバーを作成
        tiptapToolbar = document.createElement("div");
        tiptapToolbar.className = "tiptap-toolbar";
        tiptapToolbar.appendChild(tiptapEditorUi);
        // tiptapToolbar.innerHTML = "<tiptap-editor></tiptap-editor>";
        /* tiptapToolbar.innerHTML = `
          <button data-action="bold">Bold</button>
          <button data-action="italic">Italic</button>
          <button data-action="underline">Underline</button>
          <button data-action="h1">H1</button>
          <button data-action="h2">H2</button>
          <button data-action="color">赤</button>
          <button data-action="color">ながい文相</button>
          <button data-action="color">ながい文相ながい文相ながい文相ながい文相ながい文相</button>
          <button data-action="link">Link</button>
          <button data-action="bulletList">UL</button>
          <button data-action="orderList">OL</button>
          <button data-action="textAlign">Left</button> 
        ` */

        // ツールバーのイベントリスナーを設定
        tiptapToolbar.addEventListener(
          "on-click-tiptap-editor",
          (
            e: CustomEvent<{
              action: string;
              attr: Record<string, string> | null;
            }>
          ) => {
            const { action, attr } = e.detail;
            if (action && tiptapEditor) {
              switch (action) {
                case "bold":
                  tiptapEditor.chain().focus().toggleBold().run();
                  break;
                case "italic":
                  tiptapEditor.chain().focus().toggleItalic().run();
                  break;
                case "underline":
                  tiptapEditor.chain().focus().toggleUnderline().run();
                  break;
                case "heading":
                  const culcLevel = attr?.level || "1";
                  tiptapEditor
                    .chain()
                    .focus()
                    .toggleHeading({
                      level: Number(culcLevel) as 1 | 2 | 3 | 4 | 5 | 6,
                    })
                    .run();
                  break;
                case "fontFamily":
                  const fontFamily = attr?.name || "";
                  if (fontFamily) {
                    tiptapEditor
                      .chain()
                      .focus()
                      .setFontFamily(fontFamily)
                      .run();
                  } else {
                    tiptapEditor.chain().focus().unsetFontFamily().run();
                  }
                  break;
                case "fontSize":
                  const fontSize = attr?.size || "";
                  if (fontSize) {
                    tiptapEditor.chain().focus().setFontSize(fontSize).run();
                  } else {
                    tiptapEditor.chain().focus().unsetFontSize().run();
                  }
                  break;
                case "color":
                  tiptapEditor.chain().focus().setColor("#ff0000").run();
                  break;
                case "link":
                  const href = attr?.href || "";
                  const target = attr?.target || "";
                  if (href && target) {
                    tiptapEditor
                      .chain()
                      .focus()
                      .toggleLink({
                        href,
                        target,
                      })
                      .run();
                  }
                  break;
                case "unlink":
                  tiptapEditor.chain().focus().unsetLink().run();
                  break;
                case "bulletList":
                  tiptapEditor.chain().focus().toggleBulletList().run();
                  break;
                case "orderList":
                  tiptapEditor.chain().focus().toggleOrderedList().run();
                  break;
                case "indent":
                  tiptapEditor.chain().focus().sinkListItem("listItem").run();
                  break;
                case "outdent":
                  tiptapEditor.chain().focus().liftListItem("listItem").run();
                  break;
                case "textAlign":
                  tiptapEditor
                    .chain()
                    .focus()
                    .setTextAlign(attr?.alignment || "left")
                    .run();
                  break;
                case "anchor":
                  const from = tiptapEditor.state.selection.from;
                  const name = attr?.name || "hoge";
                  if (name) {
                    tiptapEditor
                      .chain()
                      .focus()
                      .insertContentAt(from, {
                        type: "customAnchor",
                        attrs: { name: name, id: name },
                      })
                      .run();
                  }
                  break;
                case "mergetag":
                  const string = attr?.string || "";
                  if (string) {
                    tiptapEditor.chain().focus().insertContent(string).run();
                  }
                  break;
              }
            }
          }
        );

        const rteToolbar = grapesjsEditor.RichTextEditor.getToolbarEl();
        rteToolbar.appendChild(tiptapToolbar);
      }

      // ツールバーをエディターの前に挿入
      // el.parentNode?.insertBefore(toolbar, el)

      return tiptapEditor;
    },

    disable: (el: HTMLElement, rte: Editor | null) => {
      if (rte) {
        console.log("きた？", el, rte);
        rte.destroy();
        tiptapEditorUi.isShow = false;
      }
    },

    getContent: (el: HTMLElement, rte: Editor | null) => {
      return rte ? rte.getHTML() : el.innerHTML;
    },
  });
};

export default tiptapRTEPlugin;
