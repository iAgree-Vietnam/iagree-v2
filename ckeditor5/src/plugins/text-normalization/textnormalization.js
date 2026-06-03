import { Plugin } from '@ckeditor/ckeditor5-core';
import TextNormalizationEditing from './textnormalizationediting';
import TextNormalizationUI from './textnormalizationui';

export default class TextNormalization extends Plugin {

    static get requires() {
        return [TextNormalizationEditing, TextNormalizationUI];
    }

    static get pluginName() {
        return 'TextNormalization';
    }

}
