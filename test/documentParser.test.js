// const { assert } = require('chai');

const container = require('../container');
const prettyJson = require('./utils/prettyJson');
const documentReaderFactory = require('./utils/documentReaderFactory');

const documentReader = documentReaderFactory(__dirname);

require('./utils/approvalsConfig')();

describe("Document Parser", function () {
    let childContainer;

    beforeEach(function () {
        childContainer = container.new();
    });

    it("parses a code-only document into code nodes", function () {
        const source = documentReader('./fixtures/code-only.js');
        const documentParser = childContainer.build('documentParser');

        const parsedDocument = documentParser.parse(source);

        this.verify(prettyJson(parsedDocument));
    });

    it("parses a document with code and context blocks", function () {
        const source = documentReader('./fixtures/code-and-text.js');
        const documentParser = childContainer.build('documentParser');

        const parsedDocument = documentParser.parse(source);

        this.verify(prettyJson(parsedDocument));
    });
});