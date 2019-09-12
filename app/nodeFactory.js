function nodeFactory(attributeParser) {

    const subtypePattern = /^\/\*.*lctx-start\[([^\]]+)\].*\*\/$/;

    function getSubtype(definitionLine) {
        return definitionLine.replace(subtypePattern, '$1');
    }

    function buildNode(type, text, definitionLine = '') {
        const subtype = subtypePattern.test(definitionLine)
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