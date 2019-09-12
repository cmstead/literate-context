function documentParser() {

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

    function captureCurrentBlock(type, currentBlock, nodes) {
        if (currentBlock.length > 0) {
            const currentText = currentBlock.join('\n');

            nodes.push(buildNode(type, currentText));
        }
    }

    function buildNodes(sourceLines) {
        let isContextBlock = false;
        let isDirectiveBlock = false;
        let directiveData = null;
        let nodes = [];
        let currentBlock = [];

        for (let i = 0; i < sourceLines.length; i++) {
            const sourceLine = sourceLines[i];

            if (!isContextBlock && startContextBlock.test(sourceLine)) {
                captureCurrentBlock('code', currentBlock, nodes)

                isContextBlock = true;
                currentBlock = [];
            } else if (isContextBlock && endContextBlock.test(sourceLine)) {
                captureCurrentBlock('context', currentBlock, nodes)

                isContextBlock = false;
                currentBlock = [];
            } else if(!isContextBlock && !isDirectiveBlock && startDirectiveBlock.test(sourceLine)) {
                captureCurrentBlock('code', currentBlock, nodes)

                isDirectiveBlock = true;
                currentBlock = [];
            } else if(!isContextBlock && isDirectiveBlock && endDirectiveBlock.test(sourceLine)) {
                captureCurrentBlock('directive', currentBlock, nodes)

                isDirectiveBlock = false;
                currentBlock = [];
            } 
            else {
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