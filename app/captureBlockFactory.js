function captureBlockFactory () {
    
    function CaptureBlock() {
        this.block = [];
        this.type = 'code';
    }

    CaptureBlock.prototype = {
        addLine: function(sourceLine) {
            this.block.push(sourceLine);
        },

        setType: function(type) {
            this.type = type;
        },

        reset: function() {
            this.block = [];
            this.type = 'code'
        },

        getSourceText: function() {
            return this.block.join('\n');
        },

        isEmpty: function() {
            return this.block.length === 0;
        }
    };

    function getCaptureBlock() {
        return new CaptureBlock();
    }

    return {
        getCaptureBlock
    };
}

module.exports = captureBlockFactory;