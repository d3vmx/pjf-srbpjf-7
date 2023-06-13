import Command from '@ckeditor/ckeditor5-core/src/command';

class AddNoteCommand extends Command {
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        //const parent = selection.anchor.parent;
        this.isEnabled = true;

        //if (!!parent && parent.hasAttribute('attrTitle')) {
        //    this.value = parent.getAttribute('attrTitle');
        //} else {
        //    this.value = false;
        //} 
        if (!!selection.hasAttribute('attrTitle')) {
            this.value = selection.getAttribute('attrTitle');
        } else {
            this.value = false;
        }
    }
    execute(options) {
        const model = this.editor.model;
        const selection = model.document.selection;
        //const parent = selection.anchor.parent;
        const range = selection.getFirstRange();
        model.change(writer => {
            //writer.setAttribute('attrTitle', options.newValue, parent);
            writer.setAttribute('attrTitle', options.newValue, range);
        });
    }
}
export default AddNoteCommand;