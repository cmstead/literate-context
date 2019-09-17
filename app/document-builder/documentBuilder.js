function documentBuilder(
    blockTypes,
    documentTextContainerFactory
) {

    const { types, subtypes } = blockTypes;

    function throwOnNestedTests(childDocument) {
        if (childDocument.tests.length > 0) {
            throw new Error('Test directives cannot be nested');
        }
    }

    function buildTestContent(node, documentContent) {
        const childDocument = buildDocumentText(node.children);

        throwOnNestedTests(childDocument)

        documentContent.appendTests(childDocument.code);
        documentContent.appendContext(childDocument.context);

    }

    function buildDocumentText(parsedDocument) {
        const documentContent = documentTextContainerFactory.buildDocumentTextContainer();

        parsedDocument.forEach(function (node) {
            if (node.type === types.code) {
                documentContent.appendCode([node.value])
            } else if (node.type === types.context) {
                documentContent.appendContext([node.value]);
            } else if (node.type === types.directive && node.subtype === subtypes.tests) {
                buildTestContent(node, documentContent)
            }
        });

        return documentContent;
    }

    return {
        buildDocumentText
    };
}

module.exports = documentBuilder;