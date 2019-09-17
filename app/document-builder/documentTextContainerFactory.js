function documentTextContainerFactory () {
    
    function DocumentTextContainer () {
        this.code = [];
        this.context = [];
        this.tests = [];
    }

    DocumentTextContainer.prototype = {
        appendLines: function (key, lines) {
            this[key] = this[key].concat(lines);
        },

        appendCode: function(codeLines) {
            this.appendLines('code', codeLines);
        },
        appendContext: function(contextLines) {
            this.appendLines('context', contextLines);
        },
        appendTests: function(testLines) {
            this.appendLines('tests', testLines);
        },

        getText: function(key) {
            return this[key].join('\n');
        },

        getCodeText: function () {
            return this.getText('code');
        },
        getContextText: function() {
            return this.getText('context');
        },
        getTestText: function() {
            return this.getText('tests');
        }
    };

    function buildDocumentTextContainer() {
        return new DocumentTextContainer();
    }

    return {
        buildDocumentTextContainer
    };
}

module.exports = documentTextContainerFactory;