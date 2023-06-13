import first from '@ckeditor/ckeditor5-utils/src/first';

export function downcastAttributeToAttribute() {
    return (evt, data, conversionApi) => {
        const {
            item,
            //range,
            //attributeKey,
            //attributeOldValue,
            attributeNewValue
        } = data;
        const {
            //dispatcher,
            mapper,
            //schema,
            consumable,
            writer
        } = conversionApi;
        if (!consumable.consume(item, evt.name)) {
            return;
        }
        const viewElement = mapper.toViewElement(item);
        //const element = viewElement.getChild(0);
        if (!!attributeNewValue) {
            writer.createAttributeElement('mark', { title: attributeValue }, { priority: 5 });
        } else {
            writer.removeAttribute('title', viewElement);
        }
    };
}

export function upcastAttributeToAttribute() {
    return (evt, data, conversionApi) => {
        const {
            viewItem,
            modelCursor,
            //modelRange
        } = data;
        const {
            writer,
            consumable,
            //schema,
            //convertItem,
            //convertChildren,
            getSplitParts,
            //keepEmptyElement,
            //safeInsert,
            //updateConversionResult,
            //splitToAllowedParent
        } = conversionApi;
        if (!consumable.test(viewItem, { attributes: ['title'] })) {
            return;
        }

        const modelElement = writer.createElement('paragraph', { title: "saDASDASDAS" });
        const splitResult = splitToAllowedParent(modelElement, modelCursor);
        if (!splitResult) {
            return;
        }
        writer.insert(modelElement, splitResult.position);
        consumable.consume(viewItem, { name: true });
        const parts = getSplitParts(modelElement);
        modelRange = writer.createRange(
            writer.createPositionBefore(modelElement),
            writer.createPositionAfter(parts[parts.length - 1])
        );
        if (splitResult.cursorParent) {
            modelCursor = writer.createPositionAt(splitResult.cursorParent, 0);
        } else {
            modelCursor = modelRange.end;
        }
    };
}