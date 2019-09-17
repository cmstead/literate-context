const container = require('./container');

module.exports = {
    parser: container.build('documentParser'),
    builder: container.build('documentBuilder')
};