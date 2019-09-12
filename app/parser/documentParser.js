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

    function buildDirectiveBlock(sourceLines) {
        const directiveBlock = captureBlockFactory.getCaptureBlock('directive');
        let captureBlock = captureBlockFactory.getCaptureBlock('code');

        let sourceLine = getNextLine(sourceLines);

        while (!endDirectiveBlock.test(sourceLine)) {

            if (startContextBlock.test(sourceLine)) {
                const contextBlock = buildContextBlock(sourceLines);

                captureCurrentBlock(captureBlock, directiveBlock.children, sourceLine)
                captureCurrentBlock(contextBlock, directiveBlock.children, sourceLine)

                captureBlock = captureBlockFactory.getCaptureBlock('code');
            } else {
                captureBlock.addLine(sourceLine);
            }
            sourceLine = getNextLine(sourceLines);
        }

        if(!captureBlock.isEmpty()) {
            captureCurrentBlock(captureBlock, directiveBlock.children, sourceLine)
        }

        return directiveBlock;
    }

    function buildNodeFromCapture(captureBlock, definitionLine) {
        const children = captureBlock.children;
        const currentText = captureBlock.getSourceText();
        const type = captureBlock.type;

        return nodeFactory.buildNode(type, currentText, children, definitionLine);
    }

    function captureCurrentBlock(captureBlock, nodes, definitionLine) {
        if (!captureBlock.isEmpty()) {
            const captureNode = buildNodeFromCapture(captureBlock, definitionLine);

            nodes.push(captureNode);
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