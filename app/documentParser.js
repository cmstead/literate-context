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

    function isContextBlock (captureBlock) {
        return captureBlock.type === 'context';
    }

    function buildNodes(sourceLines) {
        let nodes = [];
        let captureBlock = captureBlockFactory.getCaptureBlock();

        while(sourceLines.length > 0) {
            const sourceLine = sourceLines.shift();

            if (!isContextBlock(captureBlock) && startContextBlock.test(sourceLine)) {
                captureCurrentBlock(captureBlock, nodes)
                captureBlock.setType('context');
            } else if (isContextBlock(captureBlock) && endContextBlock.test(sourceLine)) {
                captureCurrentBlock(captureBlock, nodes)
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