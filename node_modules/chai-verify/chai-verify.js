(function (verifyFactory) {
    if (typeof module !== 'undefined' && module.exports !== 'undefined') {
        module.exports = verifyFactory
    } else {
        chai.use(verifyFactory);
        window.chaiVerify = {
            utils: verifyFactory.utils
        };
    }

})(
    (function () {
        function isTypeOf(type) {
            return function (value) {
                return typeof value === type;
            }
        }

        const isFunction = isTypeOf('function');
        const isObject = isTypeOf('object');
        const isString = isTypeOf('string');

        function functionExpectationByName(name = 'anonymous') {
            return `[Function: ${name}]`;
        }

        function functionExpectationAsAnonymous() {
            return functionExpectationByName('anonymous');
        }

        function functionExpectationAsNamed(name) {
            if (!isString(name)) {
                throw new Error('functionExpectationAsNamed requires function name to be a string');
            }

            return functionExpectationByName(name);
        }

        function normalizeValue(value, normalization) {
            return isFunction(normalization)
                ? normalization(value)
                : normalization;
        }

        function normalizeValues(values, normalization) {
            return values.map(value => normalizeValue(value, normalization));
        }

        function normalizeProperties(valueUnderTest, randomProperties) {
            if ((!isObject(valueUnderTest) && !isFunction(valueUnderTest)) || valueUnderTest === null) {
                throw new Error(`normalizeRandomValues expects valueUnderTest to be an object, but received ${valueUnderTest} of type ${typeof valueUnderTest}`);
            }

            if (!isObject(randomProperties) || randomProperties === null) {
                throw new Error(`normalizeRandomValues expects randomProperties to be an object, but got ${randomProperties} of type ${typeof randomProperties}`);
            }

            Object
                .keys(randomProperties)
                .forEach(function (key) {
                    const originalValue = valueUnderTest[key];
                    const normalization = randomProperties[key];
                    const normalizedValue = normalizeValue(originalValue, normalization);

                    valueUnderTest[key] = normalizedValue;
                });

            return valueUnderTest;
        }

        function verifyFactory(chai) {

            function handleFunctionProperties(key, value) {
                if (isFunction(value)) {
                    const functionName = Boolean(value.name)
                        ? value.name
                        : 'anonymous';

                    return functionExpectationByName(functionName);
                }

                return value;
            }

            function prettyJson(value) {
                return typeof value === 'undefined'
                    ? 'undefined'
                    : JSON.stringify(value, handleFunctionProperties, 4);
            }

            function errorBuilder(actualString, expectedString) {
                return [
                    '\n',
                    'Actual and expected values do not match, received values as follows',
                    '===================================================================',
                    '',
                    'Actual',
                    '------',
                    actualString,
                    '',
                    'Expected',
                    '--------',
                    expectedString
                ].join('\n');
            }

            function verify(actual, expected, userMessage) {
                const actualString = prettyJson(actual);
                const expectedString = prettyJson(expected);
                const errorMessage = errorBuilder(actualString, expectedString);
                const errorOutput = Boolean(userMessage)
                    ? userMessage
                    : errorMessage;

                chai.assert(
                    actualString === expectedString,
                    errorOutput,
                    errorMessage,
                    expected,
                    actual
                );
            }

            function normalizeAndVerify(
                actual,
                expected,
                normalizationProperties,
                userMessage
            ) {
                const normalizedValueUnderTest = normalizeProperties(actual, normalizationProperties);

                verify(normalizedValueUnderTest, expected, userMessage);
            }

            Object.defineProperty(chai.assert, 'verify', {
                writable: false,
                value: verify
            });

            Object.defineProperty(chai.assert, 'normalizeAndVerify', {
                writable: false,
                value: normalizeAndVerify
            });

            chai.Assertion.addChainableMethod('verifiedAs', function (expected, userMessage) {
                verify(this._obj, expected, userMessage);
            });

            chai.Assertion.addChainableMethod('normalizedAndVerifiedAs', function (expected, normalizationProperties, userMessage) {
                normalizeAndVerify(this._obj, expected, normalizationProperties, userMessage);
            });

        }

        verifyFactory.utils = {
            functionExpectationByName,
            functionExpectationAsNamed,
            functionExpectationAsAnonymous,
            normalizeProperties,
            normalizeValue,
            normalizeValues
        };

        return verifyFactory;
    })()
);