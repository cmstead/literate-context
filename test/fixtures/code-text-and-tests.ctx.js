/* ctx

This document contains tests, source code and contextual
text. The idea is, this is how we would write our tests
and our production code. It would all live together!

ctx */

function add(a, b, ...args) {
    return args.reduce((sum, next) => sum + next, a + b);
}

/* ctx

Next is our test block. All tests would be written
here and then extracted and placed in a test file,
filling a template

ctx */

// ctx this is a one liner in this file too

/* ctx-start[tests] api-reference-name: "codeTextAndTestCase" methods: [add] */

describe("Add behavior", function () {
    /* ctx
    
    Here's some more information that goes with tests
    
    ctx */
    it("sums a and b", function () {
        assert.equal(add(5, 6), 11);
    });

});

/* ctx-end[tests] */