function documentParser() {

    function getSourceLines(source) {
        return source.split(/\n/);
    }

    const startContextBlock = /^(\s|\r)*\/\*\s+lctx(\s|\r)*$/;
    const endContextBlock = /^(\s|\r)*lctx\s+\*\/(\s|\r)*$/;

    function buildNode(type, text) {
        return {
            type: type,
            value: text
        };
    }

    function captureCurrentBlock(type, currentBlock, nodes) {
        if (currentBlock.length > 0) {
            const currentText = currentBlock.join('\n');

            nodes.push(buildNode(type, currentText));
        }
    }

    function buildNodes(sourceLines) {
        let isContextBlock = false;
        let nodes = [];
        let currentBlock = [];

        for (let i = 0; i < sourceLines.length; i++) {
            const sourceLine = sourceLines[i];

            console.log(sourceLine);
            console.log(startContextBlock.test(sourceLine));

            if (!isContextBlock && startContextBlock.test(sourceLine)) {
                captureCurrentBlock('code', currentBlock, nodes)

                isContextBlock = true;
                currentBlock = [];
            } else if (isContextBlock && endContextBlock.test(sourceLine)) {
                captureCurrentBlock('context', currentBlock, nodes)

                isContextBlock = false;
                currentBlock = [];
            } else {
                currentBlock.push(sourceLine);
            }
        }

        captureCurrentBlock('code', currentBlock, nodes)

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