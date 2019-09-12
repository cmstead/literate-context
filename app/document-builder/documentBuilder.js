function documentBuilder () {
    
    function buildDocumentText(parsedDocument) {
        const documentContent = {
            code: [],
            context: [],
            tests: []
        };

        parsedDocument.forEach(function(node) {
            if(node.type === 'code') {
                documentContent.code.push(node.value);
            } else if(node.type === 'context') {
                documentContent.context.push(node.value);
            } else if(node.type === 'directive' && node.subtype === 'tests') {
                const childDocument = buildDocumentText(node.children);

                documentContent.tests = documentContent.tests.concat(childDocument.code);
                documentContent.context = documentContent.context.concat(childDocument.context);
            }
        });

        return documentContent;
    }

    return {
        buildDocumentText
    };
}

module.exports = documentBuilder;