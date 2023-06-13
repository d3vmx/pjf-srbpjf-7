import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import AddNoteEditing from './add-note-editing';
import AddNoteUI from './add-note-ui';

class AddNote extends Plugin {
	static get requires() {
		return [ AddNoteEditing, AddNoteUI ];
	}

	static get pluginName() {
		return 'AddNote';
	}
}

export default AddNote;
