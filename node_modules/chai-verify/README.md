# Chai-Verify #

Chai-verify is fast, easy way to perform small to medium object comparisons when you want the readability of Approvals without the overhead.

## Setup ##

Installing chai-verify:

```javascript
npm install chai-verify --save-dev
```

Chai-verify has a peer dependency of the Chai assertion library.  If you don't have chai installed, then install this way instead:

```javascript
npm install chai chai-verify --save-dev
```

## Usage ##

### Setting up for your tests ###

In node, do the following in your test file:

```javascript
const chai = require('chai');
const chaiVerify = require('chai-verify');

chai.use(chaiVerify);
```

For testing in the browser, do the following:

```html
<script src="/path/to/chai"></script>
<script src="/path/to/chai-verify"></script>
```

### Verifying values in your tests ###

Using the assert API, you can do the following:

```javascript
it('verifies with assert', function () {
    const badValue = { bad: 'value' };
    const expected = { foo: 'bar' };
    const message = 'Something went wrong!'

    assert.verify(badValue, expected, message);
});
```

If your data contains random objects, you can also normalize your data before comparing:

```javascript
it('verifies and normalizes with assert', function () {
    const objectWithRandomValue = { foo: Math.random() };
    const normalizationValues = { foo: 0.001 }
    const expected = { foo: 0.001 };

    assert.normalizeAndVerify(objectWithRandomValue, expected, normalizationValues);
});
```

Using the expect API, you can do the following instead:

```javascript
it('verifies with expect', function () {
    const badValue = { bad: 'value' };
    const expected = { foo: 'bar' };
    const message = 'Something went wrong here too!'

    expect(badValue).to.be.verifiedAs(expected, message);
});
```

You can also perform normalization on your data with the expect/BDD syntax:

```javascript
it('verifies and normalizes with assert', function () {
    const objectWithRandomValue = { foo: Math.random() };
    const normalizationValues = { foo: 0.001 }
    const expected = { foo: 0.001 };

    expect(badValue).to.be.normalizedAndVerifiedAs(expected, normalizationValues);
```

Both of the failing cases will output the following information:

```
Actual and expected values do not match, received values as follows
===================================================================

Actual
------
{
    "bad": "value"
}

Expected
--------
{
    "foo": "bar"
}
```

## Utilities ##

Chai-verify comes with a set of utilities which help to simplify the process of testing objects. There are two basic types of utilities: function expectation helpers and value normalization.

### Function Expectation Helpers ###

Before we get started, let's take a look at an example of using `functionExpectationAsNamed` all of the function expectation helpers will work the same way in the context of tests:

```javascript
const objectUnderTest = {
    numberProp: 53,
    functionProp: function namedMethd() {}
};

const functionExpectation = chaiVerify.utils.functionExpectationAsNamed('namedMethod');

const expectedResult = {
    numberProp: 53,
    functionProp: functionExpectation
}

expect(objectUnderTest).to.be.verifiedAs(expectedResult);
```

#### functionExpectationByName ###

Top-level expectation helper, this generates a string to verify the output of the stringification process.  All functions are stringified to `[Function: <function name>]` where `<function name>` is either the name of the function or 'anonymous' if the function has no name.

Usage:

```javascript
const namedFunctionExpectation = chaiVerify.utils.functionExpectationByName('aNamedFunction');

console.log(namedFunctionExpectation); // [Function: aNamedFunction]

const anonymousFunctionExpectation = chaiVerify.utils.functionExpectationByName();

console.log(namedFunctionExpectation); // [Function: anonymous]
```

#### functionExpectationAsNamed ####

Does the same as above, but requires a name property.

```javascript
const namedFunctionExpectation = chaiVerify.utils.functionExpectationAsNamed('aNamedFunction');

console.log(namedFunctionExpectation); // [Function: aNamedFunction]
```

#### functionExpectationAsAnonymous ####

Does the same as above, but only returns anonymous strings.

```javascript
const anonymousFunctionExpectation = chaiVerify.utils.functionExpectationAsAnonymous();

console.log(anonymousFunctionExpectation); // [Function: anonymous]
```

### Value normalization ###

Value normalization is particularly useful in scenarios where generated data is random, or non-deterministic.  This can be situations like random numbers, random strings, dates, etc.

#### normalizeValue ####

Normalize value will normalize a single value according to the expected value provided. A normalizing function may also be used.  See example below:

```javascript
const originalValue = Math.random() * 2;
const normalizationValue = 1.10101;
const normalizedValue = chaiVerify.utils.normalizeValue(originalValue, normalizationValue);

console.log(normalizedValue); // 1.10101

function normalizer(value) {
    return 22.222;
}

const secondNormalizedValue = chaiVerify.utils.normalizeValue(originalValue, normalizer);

console.log(secondNormalizedValue); //22.222
```

#### normalizeValues ####

Normalizes an array values with a normalizing value or function:

```javascript
const originalValues = [1, 2, 3, 4];
const normalizationValue = 1.10101;
const normalizedValue = chaiVerify.utils.normalizeValues(originalValue, normalizationValue);

console.log(normalizedValues); // [1.10101, 1.10101, 1.10101, 1.10101]

function normalizer(value) {
    return 22.222;
}

const secondNormalizedValue = chaiVerify.utils.normalizeValues(originalValues, normalizer);

console.log(secondNormalizedValue); // [22.222, 22.222, 22.222, 22.222]
```

#### normalizeProperties ####

Normalizes specified properties on an object using values or normalizing functions:

```javascript
const originalObject = {
    staticProperty: 'This will not change',
    changeByValue: 1234,
    changeByNormalizer: '5678'
};

const normalizingObject = {
    changeByValue: 4321,
    changeByNormalizer: () => '9999'
};

const normalizedObject = chaiVerify.utils.normalizeProperties(originalObject, normalizingObject);

/* Result:
{
    staticProperty: 'This will not change',
    changeByValue: 4321,
    changeByNormalizer: '9999'
}
*/

```