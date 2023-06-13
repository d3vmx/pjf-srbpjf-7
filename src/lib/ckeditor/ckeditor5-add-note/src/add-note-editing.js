import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { downcastAttributeToAttribute, upcastAttributeToAttribute } from './add-note-converters';

import AddNoteCommand from './add-note-command';

class AddNoteEditing extends Plugin {
    static get pluginName() {
        return 'AddNoteEditing';
    }
    init() {
        const editor = this.editor;
        const data = editor.data;
        const editing = editor.editing;
        //editor.data.upcastDispatcher.on('element', upcastAttributeToAttribute(), { priority: 'low' });
        //editing.downcastDispatcher.on('attribute:title', downcastAttributeToAttribute());
        //data.downcastDispatcher.on('attribute:title', downcastAttributeToAttribute());
        editor.commands.add('addNote', new AddNoteCommand(editor));
    }
}
export default AddNoteEditing;
