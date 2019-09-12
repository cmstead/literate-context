function prettyJson(obj) {
    return typeof obj === 'undefined'
        ? 'undefined'
        : JSON.stringify(obj, null, 4);
}

module.exports = prettyJson;