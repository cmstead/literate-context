# Literate Context #

The literate-context library is a tool to convert text into constituent parts of "context," "code," and "tests." Each of these is made available with the documentBuilder API.  The documentParser API generates an AST which can be consumed as high-level document nodes.  Each node represents a chunk of the document rather than small, individual names or operators.

## Setup ##

Install with NPM:

`npm install literate-context --save-dev`

## API ##

### Base API ###
- `documentParser.parse(documentString)` -- takes a string and returns a document AST.
- `documentBuilder.buildDocumentContent(documentAST)` -- takes an AST and returns a `DocumentTextContainer` object.

### Document Text Container API ###

- `documentTextContent.getCodeText()` -- returns all raw code included in original source text
- `documentTextContent.getContextText()` -- returns all content contained in original source text
- `documentTextContent.getTestText()` -- returns all tests contained in original source text

## Document Content API ##

All of the examples below are intended to be used within a source document.

Context information currently only uses C-style block and line comments.  In the future it will be possible to specify comment characters, depending on how experiments go.

### Adding Context Information ###

- Context blocks
    ```javascript
    /* ctx
    All text within this comment block will be captured
    as context information. This could be written into a
    document or discarded depending on the application of
    this library.
    ctx */
    ```
- Context lines
    ```javascript
    // ctx This is a single line of contextual information.
    // ctx Each of these lines will be extracted as context.
    ```

### Raw Code ###

Unless there is another annotation, all plain text in the document is treated as raw code.  This means literate context information can be safely integrated into your existing code without breaking functionality.

### Tests ###

The test implementation is limited to special code which is separated from the raw source code.  Annotations and other configuration metadata may be introduced at a future time.

- start block -- `/* ctx-start[tests] */`
- end block -- `/* ctx-end[tests] */`

Creating in-source tests follows this convention:

```javascript
/* ctx-start[tests] */
suite('Test Example', function () {
    case('Demonstrate how tests can be introduced', function () {
        // test stuff happens here.
    });
});
/* ctx-end[tests] */
```

## Version History ##

**v1.0.0**

Initial Release