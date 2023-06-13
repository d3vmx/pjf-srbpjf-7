import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import ClickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';

import AddNoteFormView from './ui/add-note-view';

class AddNoteUI extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }
    static get pluginName() {
        return 'AddNoteUI';
    }
    init() {
        this._registerUpcastDowncast();
        this._createButton();
        this._createForm();
    }
    destroy() {
        super.destroy();
        this._form.destroy();
    }
    _registerUpcastDowncast() {
        const editor = this.editor;
        editor.model.schema.extend('$text', { allowAttributes: 'attrTitle' });
        editor.conversion.for('upcast').elementToAttribute({
            view: {
                name: 'mark',
                attributes: ['title']
            },
            model: {
                key: 'attrTitle',
                value: (viewElement, { writer }) => {
                    let value = viewElement.getAttribute('title');
                    if (value)
                        return value;
                    return null;
                }
            },
            converterPriority: 'low'
        });
        editor.conversion.for('editingDowncast').attributeToElement({
            model: 'attrTitle',
            view: (attributeValue, { writer }) => {
                return writer.createAttributeElement('mark', { title: attributeValue }, { priority: 5 });
            },
            converterPriority: 'low'
        });
        editor.conversion.for('dataDowncast').attributeToElement({
            model: 'attrTitle',
            view: (attributeValue, { writer }) => {
                return writer.createAttributeElement('mark', { title: attributeValue }, { priority: 5 });
            }
        });
    }
    _createButton() {
        const editor = this.editor;
        const t = editor.t;
        const bind = this.bindTemplate;
        editor.ui.componentFactory.add('addNote', locale => {
            const command = editor.commands.get('addNote');
            const view = new ButtonView(locale);
            view.set({
                label: t('Nota'),
                withText: true,
                tooltip: true,
                class: [`add-note-btn-${editor.id}`]
            });
            //const enabled = editor.config.get( 'addNote.enabled' ) || false;
            //if ( !enabled ) {
            //	view.isEnabled = false;
            //} else {
            view.bind('isEnabled').to(command, 'isEnabled');
            //}
            this.listenTo(view, 'execute', () => {
                this._showForm();
            });
            return view;
        });
    }
    _createForm() {
        const editor = this.editor;
        const view = editor.editing.view;
        const viewDocument = view.document;
        this._balloon = this.editor.plugins.get('ContextualBalloon');
        this._form = new AddNoteFormView(editor.locale);
        this._form.render();
        this.listenTo(this._form, 'submit', () => {
            editor.execute('addNote', {
                newValue: this._form.labeledInput.inputView.element.value
            });
            this._hideForm(true);
        });
        this.listenTo(this._form, 'cancel', () => {
            this._hideForm(true);
        });
        this._form.keystrokes.set('Esc', (data, cancel) => {
            this._hideForm(true);
            cancel();
        });
        this.listenTo(editor.ui, 'update', () => {
            if (!viewDocument.selection) {
                this._hideForm(true);
            }
        });
        ClickOutsideHandler({
            emitter: this._form,
            activator: () => this._isVisible,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideForm()
        });
    }
    _showForm() {
        if (this._isVisible) {
            return;
        }
        const editor = this.editor;
        const model = editor.model;
        const selection = model.document.selection;
        const command = editor.commands.get('addNote');
        const labeledInput = this._form.labeledInput;
        if (!this._isInBalloon) {
            const defaultPositions = BalloonPanelView.defaultPositions;
            const target = document.querySelector(`.add-note-btn-${editor.id}`);
            this._balloon.add({
                view: this._form,                
                position: {
                    target: target,
                    positions: [
                        defaultPositions.northArrowSouth,
                        defaultPositions.northArrowSouthWest,
                        defaultPositions.northArrowSouthEast,
                        defaultPositions.southArrowNorth,
                        defaultPositions.southArrowNorthWest,
                        defaultPositions.southArrowNorthEast
                    ]
                }
            });
        }
        labeledInput.inputView.value = labeledInput.inputView.element.value = command.value || '';
        this._form.labeledInput.inputView.select();
    }
    _hideForm(focusEditable) {
        if (!this._isInBalloon) {
            return;
        }
        if (this._form.focusTracker.isFocused) {
            this._form.saveButtonView.focus();
        }
        this._balloon.remove(this._form);
        if (focusEditable) {
            this.editor.editing.view.focus();
        }
    }
    get _isVisible() {
        return this._balloon.visibleView === this._form;
    }
    get _isInBalloon() {
        return this._balloon.hasView(this._form);
    }
}
export default AddNoteUI;