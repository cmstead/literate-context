const fs = require('fs');
const path = require('path');

function documentReaderFactory(baseDir) {
    return function (relativeFilePath) {
        const filePath = path.join(baseDir, relativeFilePath);
        return fs.readFileSync(filePath, { encoding: 'utf8' });
    }
}

module.exports = documentReaderFactory;