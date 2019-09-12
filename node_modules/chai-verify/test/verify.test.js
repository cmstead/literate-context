const chai = require('chai');
const chaiVerify = require('../chai-verify');

chai.use(chaiVerify);

const assert = chai.assert;
const expect = chai.expect;

describe('Chai-Verify', function () {

    describe('assert.verify', function () {
        it('properly fails when verifying two unmatched values', function () {
            const badValue = null;
            const expected = { foo: 'bar' };

            try {
                assert.verify(badValue, expected);
                throw new Error('Verify must throw');
            } catch (e) {
                const expectedMessage = '\n\nActual and expected values do not match, received values as follows\n===================================================================\n\nActual\n------\nnull\n\nExpected\n--------\n{\n    "foo": "bar"\n}';
                assert.equal(e.message, expectedMessage);
            }
        });
    });

    describe('expect().to.be.verifiedAs()', function () {
        it('properly fails when verifying two unmatched values', function () {
            const badValue = {};
            const expected = { foo: 'bar' };

            try {
                expect(badValue).to.be.verifiedAs(expected);
                throw new Error('verifiedAs must throw');
            } catch (e) {
                const expectedMessage = '\n\nActual and expected values do not match, received values as follows\n===================================================================\n\nActual\n------\n{}\n\nExpected\n--------\n{\n    "foo": "bar"\n}';
                assert.equal(e.message, expectedMessage);
            }
        });
    });

    describe('Utils', function () {
        describe('functionExpectationByName', function () {

            it('returns a function expectation string with provided name', function () {
                const expectationString = chaiVerify.utils.functionExpectationByName('testing');

                assert.equal(expectationString, '[Function: testing]');
            });

            it('returns a function expectation string containing anonymous if no name is provided', function () {
                const expectationString = chaiVerify.utils.functionExpectationByName();

                assert.equal(expectationString, '[Function: anonymous]');
            });

        });

        describe('functionExpectationAsAnonymous', function () {

            it('returns a function expectation string containing anonymous', function () {
                const expectationString = chaiVerify.utils.functionExpectationAsAnonymous();

                assert.equal(expectationString, '[Function: anonymous]');
            });

        });

        describe('functionExpectationAsNamed', function () {

            it('returns a function expectation string with provided name', function () {
                const expectationString = chaiVerify.utils.functionExpectationAsNamed('requiredName');

                assert.equal(expectationString, '[Function: requiredName]');
            });

            it('throws when a name is not provided', function () {
                assert.throws(() => chaiVerify.utils.functionExpectationAsNamed());
            });

            it('throws when a name is not a string', function () {
                assert.throws(() => chaiVerify.utils.functionExpectationAsNamed([]));
            });

        });

        describe('normalizeProperties', function () {
            it('normalizes values in an object with static values as provided by user', function () {
                const normalization = {
                    randomProperty1: 'static value 1',
                    randomProperty2: 'static value 2'
                }

                const objectToNormalize = {
                    staticProperty: 'This is a static value',
                    randomProperty1: Math.random(),
                    randomProperty2: Math.random()
                };

                const expectedOutput = {
                    staticProperty: 'This is a static value',
                    randomProperty1: 'static value 1',
                    randomProperty2: 'static value 2'
                };

                const normalizedObject = chaiVerify.utils.normalizeProperties(objectToNormalize, normalization);

                assert.verify(normalizedObject, expectedOutput);
            });

            it('normalizes values in an object with normalizing function as provided by user', function () {
                const normalization = {
                    randomProperty1: () => 'function output 1',
                    randomProperty2: () => 'function output 2'
                }

                const objectToNormalize = {
                    staticProperty: 'This is a static value',
                    randomProperty1: Math.random(),
                    randomProperty2: Math.random()
                };

                const expectedOutput = {
                    staticProperty: 'This is a static value',
                    randomProperty1: 'function output 1',
                    randomProperty2: 'function output 2'
                };

                const normalizedObject = chaiVerify.utils.normalizeProperties(objectToNormalize, normalization);

                assert.verify(normalizedObject, expectedOutput);
            });

            it('throws an error if value under test is not an object', function () {
                assert.throws(() => chaiVerify.utils.normalizeProperties(null, {}));
            });

            it('does not throw an error if value under test is a function', function () {
                assert.doesNotThrow(() => chaiVerify.utils.normalizeProperties(() => null, {}));
            });

            it('throws an error if normalization properties value is not an object', function () {
                assert.throws(() => chaiVerify.utils.normalizeProperties({}, null));
            });
        });

    });

});