// https://github.com/noreason/grapesjs-plugin-ckeditor5/
import {Plugin} from 'grapesjs';
// import {Essentials, Bold, Italic, Font, Paragraph} from 'ckeditor5'
// import {InlineEditor} from '@ckeditor/ckeditor5-editor-inline'
import { InlineEditor, /* getDataFromElement ,*/ Essentials,Bold, Code, AutoLink, Link, Italic, Strikethrough,Table, TableToolbar, TableColumnResize, List, Font, Subscript, Superscript, Underline, Alignment, RemoveFormat, Paragraph  } from 'ckeditor5';
import coreTranslations from 'ckeditor5/translations/ja.js';
// import { getDataFromElement/* , CKEditorError */ } from 'ckeditor5/src/utils.js';
import { type EditorConfig } from 'ckeditor5/src/core.js';
import 'ckeditor5/ckeditor5.css';

// https://grapesjs.com/docs/modules/Plugins.html#plugins-with-options


type Ckeditor5Options = {
  options?:number
}

export const grapesjsPluginCkeditor5: Plugin<Ckeditor5Options> = (editor, opts = {}) => {

  editor.setCustomRte({
      enable: async (el, rte) => {
        if (rte) {
          rte.destroy();
        }

        const option:EditorConfig = {
          language: 'ja',
          plugins: [ Essentials, Bold, Code, AutoLink, Link, Italic, Underline, Strikethrough, Table, TableToolbar, TableColumnResize, List, Font, Subscript, Superscript, Alignment, RemoveFormat, Paragraph ],
          toolbar: {
            items: [ 'bold', 'italic',  'underline',  'strikethrough', 'link', 'subscript', 'superscript', 'insertTable','numberedList', 'bulletedList','alignment','|', 
              'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|', 'removeFormat'
            ],
            shouldNotGroupWhenFull: true
          },
          table: {
              contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
          },
          translations: [
            coreTranslations,
          ],
          enterMode: 'BR',  // Enterキーで<br>を挿入
          shiftEnterMode: 'BR'  // Shift + Enterで<br>を挿入
        }
        // console.log('★',editor, opts,rte, getDataFromElement)

        // Hide other toolbars
        const rteToolbar = editor.RichTextEditor.getToolbarEl();
        Array.from(rteToolbar.children).forEach(child => {
            if(child instanceof HTMLElement){
                child.style.display = 'none';
            }
        })

        // Init CkEditors
        const newRte = await InlineEditor.create(el, option)
        console.log(newRte)
        // Append the editor
        if(newRte.ui.view.toolbar.element){
          editor.RichTextEditor.getToolbarEl().appendChild(newRte.ui.view.toolbar.element);
        }

        el.contentEditable = 'true';

        // Do nothing if already focused
        if (newRte && newRte.editing.view.document.isFocused) {
          return;
        }

        newRte && newRte.editing.view.focus();

        return newRte;
      },

      disable: async (el, _rte) => {
        el.contentEditable = 'false';
      },

     getContent(_el, rte) {
        const htmlString = rte.getData();
        console.log('きた？', htmlString)
        return htmlString;
      },
    })
}