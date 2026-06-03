import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

export default class TextNormalizationUI extends Plugin {

    static get pluginName() {
        return 'TextNormalizationUI';
    }

    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('textNormalization', (locale) => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Chuẩn hóa văn bản',
                withText: true,
                tooltip: true,
            });

            this.listenTo(view, 'execute', () => {
                editor.execute('textNormalization');
                editor.editing.view.focus();
            });

            return view;
        });
    }

}
