function documentParser(captureBlockFactory) {

    function getSourceLines(source) {
        return source.split(/\n/);
    }

    const startContextBlock = /^\s*\/\*\s+lctx\s*$/;
    const endContextBlock = /^\s*lctx\s+\*\/\s*$/;

    const startDirectiveBlock = /^\s*\/\* lctx-start [^*]\*\/\s*$/;
    const endDirectiveBlock = /^\s*\/\* lctx-end [^*]\*\/\s*$/;

    function buildNode(type, text) {
        return {
            type: type,
            value: text
        };
    }

    function captureCurrentBlock(captureBlock, nodes) {
        if (!captureBlock.isEmpty()) {
            const currentText = captureBlock.getSourceText();
            const type = captureBlock.type;

            nodes.push(buildNode(type, currentText));
            captureBlock.reset();
        }
    }

    function isContextBlock(captureBlock) {
        return captureBlock.type === 'context';
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

    function buildDirectiveBlock(sourceLines, startLine) {
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