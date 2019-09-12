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

    function getNextLine(sourceLines) {
        return sourceLines.shift();
    }

    function blockBuilderFactory(type, endPattern) {
        return function (sourceLines) {
            let captureBlock = captureBlockFactory.getCaptureBlock(type);
            let sourceLine = getNextLine(sourceLines);

            while (!endPattern.test(sourceLine)) {
                captureBlock.addLine(sourceLine);
                sourceLine = getNextLine(sourceLines);
            }

            return captureBlock;
        }

    }

    const buildContextBlock = blockBuilderFactory('context', endContextBlock)
    const buildDirectiveBlock = blockBuilderFactory('directive', endDirectiveBlock);

    function captureCurrentBlock(captureBlock, nodes, definitionLine) {
        if (!captureBlock.isEmpty()) {
            const currentText = captureBlock.getSourceText();
            const type = captureBlock.type;

            nodes.push(nodeFactory.buildNode(type, currentText, definitionLine));
            captureBlock.reset();
        }
    }

    function blockCaptureFactory(captureBlock, nodes) {
        return function (currentLine, sourceLines, extractBlock) {
            captureCurrentBlock(captureBlock, nodes)

            const extractedBlock = extractBlock(sourceLines);
            captureCurrentBlock(extractedBlock, nodes, currentLine);
        }
    }

    function getBlockBuilder(sourceLine) {
        if (startContextBlock.test(sourceLine)) {
            return buildContextBlock;
        } else if (startDirectiveBlock.test(sourceLine)) {
            return buildDirectiveBlock;
        } else {
            return null;
        }
    }

    function buildNodes(sourceLines) {
        let nodes = [];
        let captureBlock = captureBlockFactory.getCaptureBlock('code');

        const captureContextBlocks = blockCaptureFactory(captureBlock, nodes);

        while (sourceLines.length > 0) {
            const sourceLine = getNextLine(sourceLines);
            let buildBlock = getBlockBuilder(sourceLine);

            if (buildBlock !== null) {
                captureContextBlocks(sourceLine, sourceLines, buildBlock);
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