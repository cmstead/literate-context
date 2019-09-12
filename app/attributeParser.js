function attributeParser () {

    const attributePattern = /([^\s]+:\s+"[^"]+")|([^\s]+:\s+\[[^\]]+\])/g;
    const stringPattern = /^"([^"]+)"$/;
    const arrayPattern = /^\[([^\]]+)\]$/;

    function parseString(attributeValue) {
        return attributeValue.replace(stringPattern, '$1');
    }

    function parseArray(attributeValue) {
        return attributeValue
            .replace(arrayPattern, '$1')
            .split(/,\s*/ig);
    }

    function parseValue(attributeValue) {
        const isStringValue = stringPattern.test(attributeValue);
        const parse = isStringValue ? parseString : parseArray;

        return parse(attributeValue);
    }

    function parseAttributes(definitionLine) {
        return definitionLine
            .match(attributePattern)
            .map(attribute => {
                const [key, value] = attribute.split(': ');

                return [key, parseValue(value)];
            })
            .reduce(function (attributeMap, [key, value]) {
                attributeMap[key] = value;

                return attributeMap;
            }, {});
    }

    return {
        parseAttributes
    };
}

module.exports = attributeParser;