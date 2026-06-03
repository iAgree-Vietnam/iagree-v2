import { Command } from '@ckeditor/ckeditor5-core';
import { first } from '@ckeditor/ckeditor5-utils';
import _ from 'lodash';

// noinspection JSUnresolvedVariable, JSUnresolvedFunction
export default class TextNormalizationCommand extends Command {

    value = null;

    refresh() {
        this.isEnabled = true;
    }

    execute() {
        const model = editor.model;
        const schema = model.schema;

        const allAttributes = [];
        const removeAttributes = ['fontSize', 'fontFamily', 'fontColor'];

        model.change(writer => {
            for (const item of this._getFormattingItems(model, schema)) {
                const itemRange = writer.createRangeOn(item);
                for (const attributeName of this._getFormattingAttributes(item, schema)) {
                    allAttributes.push(attributeName);
                    if (!removeAttributes.includes(attributeName)) continue;

                    writer.removeAttribute(attributeName, itemRange);
                }
            }
        });

        if (_.isFunction(window.textNormalization)) window.textNormalization(this.editor, first);
    }

    * _getFormattingItems(model, schema) {
        const rootName = _.first(model.document.getRootNames());
        const allRange = model.createRangeIn(model.document.getRoot(rootName));

        const itemHasRemovableFormatting = (item) => !!first(this._getFormattingAttributes(item, schema));

        for (const item of allRange.getItems()) {
            if (!schema.isBlock(item) && itemHasRemovableFormatting(item)) {
                yield item;
            }
        }
    }

    * _getFormattingAttributes(item, schema) {
        for (const [attributeName] of item.getAttributes()) {
            const attributeProperties = schema.getAttributeProperties(attributeName);

            if (attributeProperties && attributeProperties.isFormatting) {
                yield attributeName;
            }
        }
    }

}


