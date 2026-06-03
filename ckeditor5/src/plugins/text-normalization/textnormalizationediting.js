import { Plugin } from '@ckeditor/ckeditor5-core';
import TextNormalizationCommand from './textnormalizationcommand';

export default class TextNormalizationEditing extends Plugin {

    static get pluginName() {
        return 'TextNormalizationEditing';
    }

    init() {
        this.editor.commands.add('textNormalization', new TextNormalizationCommand(this.editor));
    }

}
