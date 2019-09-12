function documentParser () {
    
    function parse(source) {
        return {
            type: 'code',
            value: source
        }
    }

    return {
        parse
    };
}

module.exports = documentParser;