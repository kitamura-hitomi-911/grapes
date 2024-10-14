import tinymce from "tinymce";
import 'tinymce/icons/default';         // デフォルトのアイコンセット
import 'tinymce/themes/silver';         // Silverテーマ
import 'tinymce/models/dom';            // DOMモデル
import 'tinymce/plugins/lists';         // 必要なプラグイン例 (リストのサポート)
import 'tinymce/plugins/link';          // 必要なプラグイン例 (リンクのサポート)
import {Plugin} from 'grapesjs';

type TinymceOptions = {}

export const tinymcePlugin:Plugin<TinymceOptions> = (editor, opts = {}) => {
    const options = { ...{
      // TinyMCE options
      options: {},
  
      // On which side of the element to position the toolbar
      // Available options: 'left|center|right'
      position: 'left',
    },  ...opts };
  
    if (!tinymce) {
      throw new Error('tinymce not found');
    }
  
    editor.setCustomRte({
      enable :async(el, rte = {}) => {
        const { activeEditor } = rte;
        const rteToolbar = editor.RichTextEditor.getToolbarEl();
        el.contentEditable = 'true';
  
        // Hide everything inside the GrapesJS' toolbar container
        // @ts-ignore
        [].forEach.call(rteToolbar.children, child => child.style.display = 'none');
  
        // If already exists I'll just focus on it
        if (activeEditor) {
          activeEditor.show();
          activeEditor.focus();
            return rte;
        }

        const iframe =  document.querySelector('.gjs-frame') as HTMLIFrameElement
        const inlineEditor = document.createElement('div')
  
        // Init TinyMCE
        const newRte = await tinymce.EditorManager.init({
            target: el,
            inline: true,
            menubar: true,
            // forced_root_block:  undefined, // avoid '<p>' wrapper
            //fixed_toolbar_container: tlbSelector, // place the toolbar inside GrapesJS' toolbar container
            fixed_toolbar_container_target:inlineEditor,
            content_window: iframe.contentWindow,
            content_document: iframe.contentWindow?.document,
            plugins: 'lists link',
            toolbar: 'bold italic | link',
            setup:(ed) => {
                console.log(ed)
              ed.on<'init'>('init', (e) => {
                console.log('onInit',e)
                rte.activeEditor = ed
                ed.focus()
            });
              // Fix the position of the toolbar when the editor is created
              // @ts-ignore
              ed.once('focus', e => setTimeout(() => editor.trigger('canvasScroll')));
            },
            ...options.options,
        });

        console.log('★',newRte,newRte[0])

        // const rteToolbar = editor.RichTextEditor.getToolbarEl()
        console.log(rteToolbar)
        rteToolbar.appendChild(inlineEditor)

        // rte.activeEditor = newRte[0]
  
        // The init method returns a Promise, so we need to store the editor instance on it
        // @ts-ignore
        // rte.then(result => rte.activeEditor = result[0]);
  
        return newRte[0];
      },
  
      disable(el, rte = {}) {
        const { activeEditor } = rte;
        el.contentEditable = 'false';
        activeEditor && activeEditor.hide();
      },
    });
  
    // Update RTE toolbar position
    editor.on('rteToolbarPosUpdate', (pos) => {
      // Update by position
      switch (options.position) {
        case 'center':
          let diff = (pos.elementWidth / 2) - (pos.targetWidth / 2);
          pos.left = pos.elementLeft + diff;
          break;
        case 'right':
          let width = pos.targetWidth;
          pos.left = pos.elementLeft + pos.elementWidth - width;
          break;
      }
  
      if (pos.top <= pos.canvasTop) {
        pos.top = pos.elementTop + pos.elementHeight;
      }
  
      // Check if not outside of the canvas
      if (pos.left < pos.canvasLeft) {
        pos.left = pos.canvasLeft;
      }
    });
  
  };