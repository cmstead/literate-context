function nodeFactory (attributeParser) {
    
    function getSubtype(definitionLine) {
        return definitionLine.replace(/^\/\*.*lctx-start\[([^\]]+)\].*\*\/$/, '$1');
    }

    function buildNode(type, text, definitionLine = '') {
        const subtype = definitionLine !== ''
            ? getSubtype(definitionLine)
            : null;

        const attributes = definitionLine !== ''
            ? attributeParser.parseAttributes(definitionLine)
            : null;

        return {
            type: type,
            subtype: subtype,
            value: text,
            attributes: attributes
        };
    }

    return {
        buildNode
    };
}

module.exports = nodeFactory;