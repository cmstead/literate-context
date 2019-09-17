function documentParser(
    blockTypes,
    captureBlockFactory,
    nodeFactory
) {

    const { types } = blockTypes;

    const startContextBlock = /^\s*\/\*\s+ctx\s*$/;
    const endContextBlock = /^\s*ctx\s+\*\/\s*$/;

    const singleLineContext = /^\s*\/\/\s+ctx\s+(.*)/;

    const startDirectiveBlock = /^\s*\/\* ctx-start\[.*\*\/$/;
    const endDirectiveBlock = /^\s*\/\* ctx-end\[.*\*\/$/;

    function getSourceLines(source) {
        return source.split(/\n/);
    }

    function getNextLine(sourceLines) {
        return sourceLines.shift();
    }

    function buildContextBlock(sourceLines) {
        let captureBlock = captureBlockFactory.getCaptureBlock(types.context);
        let sourceLine = getNextLine(sourceLines);

        while (!endContextBlock.test(sourceLine)) {
            captureBlock.addLine(sourceLine);
            sourceLine = getNextLine(sourceLines);
        }

        return captureBlock;
    }

    function buildDirectiveBlock(sourceLines) {
        const directiveBlock = captureBlockFactory.getCaptureBlock(types.directive);
        let captureBlock = captureBlockFactory.getCaptureBlock(types.code);

        let sourceLine = getNextLine(sourceLines);

        while (!endDirectiveBlock.test(sourceLine)) {

            if (startContextBlock.test(sourceLine)) {
                const contextBlock = buildContextBlock(sourceLines);

                captureCurrentBlock(captureBlock, directiveBlock.children, sourceLine)
                captureCurrentBlock(contextBlock, directiveBlock.children, sourceLine)

                captureBlock = captureBlockFactory.getCaptureBlock(types.code);
            } else {
                captureBlock.addLine(sourceLine);
            }
            sourceLine = getNextLine(sourceLines);
        }

        if (!captureBlock.isEmpty()) {
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

    function captureSingleLineContext(sourceLine, nodes) {
        const tempCaptureBlock = captureBlockFactory.getCaptureBlock(types.context)

        tempCaptureBlock.addLine(sourceLine.replace(singleLineContext, '$1'));

        captureCurrentBlock(tempCaptureBlock, nodes, sourceLine);
    }

    function buildNodes(sourceLines) {
        let nodes = [];
        let captureBlock = captureBlockFactory.getCaptureBlock(types.code);

        const captureContextBlocks = blockCaptureFactory(captureBlock, nodes);

        while (sourceLines.length > 0) {
            const sourceLine = getNextLine(sourceLines);
            let buildBlock = getBlockBuilder(sourceLine);

            if (singleLineContext.test(sourceLine)) {
                captureCurrentBlock(captureBlock, nodes);

                captureSingleLineContext(sourceLine, nodes);
            } else if (buildBlock !== null) {
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