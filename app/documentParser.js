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



    function buildNodes(sourceLines) {
        let nodes = [];
        let captureBlock = captureBlockFactory.getCaptureBlock('code');

        function captureContextBlocks(sourceLines, extractBlock) {
            captureCurrentBlock(captureBlock, nodes)
    
            const extractedBlock = extractBlock(sourceLines);
            captureCurrentBlock(extractedBlock, nodes);
        }
    

        while (sourceLines.length > 0) {
            const sourceLine = sourceLines.shift();

            if (startContextBlock.test(sourceLine)) {
                captureContextBlocks(sourceLines, buildContextBlock);
            } else if (startDirectiveBlock.test(sourceLine)) {
                captureCurrentBlock(captureBlock, nodes);

                const extractedBlock = buildDirectiveBlock(sourceLines);
                captureCurrentBlock(extractedBlock, nodes, sourceLine);
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