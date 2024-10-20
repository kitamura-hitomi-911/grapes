import { Extension } from "@tiptap/core";

interface IndentOptions {
  types: string[];
  indentRange: number;
  minIndent: number;
  maxIndent: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      /**
       * Indent the selected list item
       */
      indent: () => ReturnType;
      /**
       * Outdent the selected list item
       */
      outdent: () => ReturnType;
    };
  }
}

export const Indent = Extension.create<IndentOptions>({
  name: "indent",

  addOptions() {
    return {
      types: ["listItem"],
      indentRange: 24, // インデント幅のピクセル数
      minIndent: 0, // 最小のインデント幅
      maxIndent: 240, // 最大のインデント幅
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            renderHTML: (attributes) => ({
              style: `margin-left: ${attributes.indent}px;`,
            }),
            parseHTML: (element) => parseInt(element.style.marginLeft, 10) || 0,
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;
          let canIndent = false;

          state.doc.nodesBetween(from, to, (node) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = node.attrs.indent || 0;
              if (currentIndent < this.options.maxIndent) {
                canIndent = true;
                return false; // 処理を停止
              }
            }
          });

          if (!canIndent) {
            return false; // インデント不可能な場合はfalseを返す
          }

          if (dispatch) {
            tr.setSelection(selection);
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (this.options.types.includes(node.type.name)) {
                const indent =
                  (node.attrs.indent || 0) + this.options.indentRange;
                if (indent <= this.options.maxIndent) {
                  tr.setNodeMarkup(pos, null, { ...node.attrs, indent });
                }
              }
            });
            dispatch(tr);
          }
          return true;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;
          let canOutdent = false;

          state.doc.nodesBetween(from, to, (node) => {
            if (this.options.types.includes(node.type.name)) {
              const currentIndent = node.attrs.indent || 0;
              if (currentIndent > this.options.minIndent) {
                canOutdent = true;
                return false; // 処理を停止
              }
            }
          });

          if (!canOutdent) {
            return false; // アウトデント不可能な場合はfalseを返す
          }

          if (dispatch) {
            tr.setSelection(selection);
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (this.options.types.includes(node.type.name)) {
                const indent =
                  (node.attrs.indent || 0) - this.options.indentRange;
                if (indent >= this.options.minIndent) {
                  tr.setNodeMarkup(pos, null, { ...node.attrs, indent });
                }
              }
            });
            dispatch(tr);
          }
          return true;
        },
      /*
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          if (dispatch) {
            tr.setSelection(selection);
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (this.options.types.includes(node.type.name)) {
                const indent =
                  (node.attrs.indent || 0) + this.options.indentRange;
                if (indent <= this.options.maxIndent) {
                  tr.setNodeMarkup(pos, null, { ...node.attrs, indent });
                }
              }
            });
            dispatch(tr);
          }
          return true;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          if (dispatch) {
            tr.setSelection(selection);
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (this.options.types.includes(node.type.name)) {
                const indent =
                  (node.attrs.indent || 0) - this.options.indentRange;
                if (indent >= this.options.minIndent) {
                  tr.setNodeMarkup(pos, null, { ...node.attrs, indent });
                }
              }
            });
            dispatch(tr);
          }
          return true;
        }, */
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      "Shift-Tab": () => this.editor.commands.outdent(),
    };
  },
});
