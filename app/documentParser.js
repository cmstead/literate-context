function documentParser(
    captureBlockFactory,
    nodeFactory
) {

    const startContextBlock = /^\s*\/\*\s+lctx\s*$/;
    const endContextBlock = /^\s*lctx\s+\*\/\s*$/;

    const startDirectiveBlock = /^\s*\/\* lctx-start\[.*\*\/$/;
    const endDirectiveBlock = /^\s*\/\* lctx-end\[.*\*\/$/;

    function getSourceLines(source) {
        return source.split(/\n/);
    }

    function captureCurrentBlock(captureBlock, nodes, definitionLine) {
        if (!captureBlock.isEmpty()) {
            const currentText = captureBlock.getSourceText();
            const type = captureBlock.type;

            nodes.push(nodeFactory.buildNode(type, currentText, definitionLine));
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

    function blockCaptureFactory(captureBlock, nodes) {
        return function (currentLine, sourceLines, extractBlock) {
            captureCurrentBlock(captureBlock, nodes)

            const extractedBlock = extractBlock(sourceLines);
            captureCurrentBlock(extractedBlock, nodes, currentLine);
        }
    }

    function buildNodes(sourceLines) {
        let nodes = [];
        let captureBlock = captureBlockFactory.getCaptureBlock('code');

        const captureContextBlocks = blockCaptureFactory(captureBlock, nodes);

        while (sourceLines.length > 0) {
            const sourceLine = sourceLines.shift();

            if (startContextBlock.test(sourceLine)) {
                captureContextBlocks(sourceLine, sourceLines, buildContextBlock);
            } else if (startDirectiveBlock.test(sourceLine)) {
                captureContextBlocks(sourceLine, sourceLines, buildDirectiveBlock);
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