const container = require('../container');
const prettyJson = require('./utils/prettyJson');
const documentReaderFactory = require('./utils/documentReaderFactory');

const documentReader = documentReaderFactory(__dirname);

require('./utils/approvalsConfig')();

describe("Document Builder", function () {
    let childContainer;
    let documentParser;
    let documentBuilder;

    beforeEach(function () {
        childContainer = container.new();
        documentParser = childContainer.build('documentParser');
        documentBuilder = childContainer.build('documentBuilder');
    });

    it("builds a code-only document from a code-only tree", function () {
        const source = documentReader('./fixtures/code-only.ctx.js');
        const parsedDocument = documentParser.parse(source);

        const documentContent = documentBuilder.buildDocumentText(parsedDocument);

        this.verify(prettyJson(documentContent));
    });

    it("builds a document with code and context nodes", function () {
        const source = documentReader('./fixtures/code-and-text.ctx.js');
        const parsedDocument = documentParser.parse(source);

        const documentContent = documentBuilder.buildDocumentText(parsedDocument);

        this.verify(prettyJson(documentContent));
    });

    it("builds a document with code, context, and test nodes", function () {
        const source = documentReader('./fixtures/code-text-and-tests.ctx.js');
        const parsedDocument = documentParser.parse(source);

        const documentContent = documentBuilder.buildDocumentText(parsedDocument);

        this.verify(prettyJson(documentContent));
    });
});