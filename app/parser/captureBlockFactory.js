function captureBlockFactory () {
    
    function CaptureBlock(type) {
        this.block = [];
        this.type = type;
    }

    CaptureBlock.prototype = {
        addLine: function(sourceLine) {
            this.block.push(sourceLine);
        },

        reset: function() {
            this.block = [];
        },

        getSourceText: function() {
            return this.block.join('\n');
        },

        isEmpty: function() {
            return this.block.length === 0;
        }
    };

    function getCaptureBlock(type) {
        return new CaptureBlock(type);
    }

    return {
        getCaptureBlock
    };
}

module.exports = captureBlockFactory;