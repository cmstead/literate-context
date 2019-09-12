/* lctx

This document contains tests, source code and contextual
text. The idea is, this is how we would write our tests
and our production code. It would all live together!

lctx */

function add(a, b, ...args) {
    return args.reduce((sum, next) => sum + next, a + b);
}

/* lctx

Next is our test block. All tests would be written
here and then extracted and placed in a test file,
filling a template

lctx */

/* lctx-start[tests] api-reference-name: "codeTextAndTestCase" methods: [add] */

describe("Add behavior", function(){
   /* lctx
   
   Here's some more information that goes with tests
   
   lctx */
    it("sums a and b", function(){
        assert.equal(add(5, 6), 11);
    });

});

/* lctx-end[tests] */