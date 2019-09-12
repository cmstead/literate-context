function documentParser(
    attributeParser,
    captureBlockFactory
) {

    function getSourceLines(source) {
        return source.split(/\n/);
    }

    const startContextBlock = /^\s*\/\*\s+lctx\s*$/;
    const endContextBlock = /^\s*lctx\s+\*\/\s*$/;

    const startDirectiveBlock = /^\s*\/\* lctx-start\[.*\*\/$/;
    const endDirectiveBlock = /^\s*\/\* lctx-end\[.*\*\/$/;

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

    function captureCurrentBlock(captureBlock, nodes, definitionLine) {
        if (!captureBlock.isEmpty()) {
            const currentText = captureBlock.getSourceText();
            const type = captureBlock.type;

            nodes.push(buildNode(type, currentText, definitionLine));
            captureBlock.reset();
        }
    }

    function buildContextBlock(sourceLines) {
        let captureBlock = captureBlockFactory.getCaptureBlock('context');
        let sourceLine = sourceLines.shift();

        while (!endContextBlock.test(sourceLine)) {
            captureBlock.addLine(sourceLine);
            sourceLine = sourceLines.shift();
        }

        return captureBlock;
    }

    function buildDirectiveBlock(sourceLines) {
        let captureBlock = captureBlockFactory.getCaptureBlock('directive');
        let sourceLine = sourceLines.shift();

        while (!endDirectiveBlock.test(sourceLine)) {
            captureBlock.addLine(sourceLine);
            sourceLine = sourceLines.shift();
        }

        return captureBlock;
    }

    function buildNodes(sourceLines) {
        let nodes = [];
        let captureBlock = captureBlockFactory.getCaptureBlock('code');

        while (sourceLines.length > 0) {
            const sourceLine = sourceLines.shift();

            if (startContextBlock.test(sourceLine)) {
                captureCurrentBlock(captureBlock, nodes)

                const contextBlock = buildContextBlock(sourceLines, sourceLine);
                captureCurrentBlock(contextBlock, nodes);
            } else if (startDirectiveBlock.test(sourceLine)) {
                captureCurrentBlock(captureBlock, nodes);

                const directiveBlock = buildDirectiveBlock(sourceLines);
                captureCurrentBlock(directiveBlock, nodes, sourceLine);
            } else {
                captureBlock.addLine(sourceLine);
            }
        }

        captureCurrentBlock(captureBlock, nodes);

        return nodes;
    }

    function parse(source) {
        const sourceLines = getSourceLines(source);

        return buildNodes(sourceLines);
    }

    return {
        parse
    };
}

module.exports = documentParser;