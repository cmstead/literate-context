'use strict';

const signet = require('signet')();

signet.alias('optional', 'variant<undefined, _>');
signet.alias('either', 'variant<_, _>');

const approvalsOptions = {
    reporter: 'either<string, approvalsReporter>',
    lineEnding: 'optional<string>',
    appendEOL: 'optional<boolean>',
    EOL: 'optional<string>',
    errorOnStaleApprovedFiles: 'optional<boolean>',
    shouldIgnoreStaleApprovedFile: 'optional<function<string => boolean>>',
    stripBOM: 'optional<boolean>',
    failOnLineEndingDifferences: 'optional<boolean>'
};

const approvalsReporter = {
    name: 'optional<string>',
    canReportOn: 'function<receivedFilePath:string => boolean>',
    report: 'function<approvedPath:string, receivedPath:string => *>'
};

signet.defineDuckType('approvalsOptions', approvalsOptions);
signet.defineDuckType('approvalsReporter', approvalsReporter);

const either = (type) => (defaultValue, actualValue) => {
    return signet.isTypeOf(type)(actualValue) ? actualValue : defaultValue;
}

const eitherString = either('string');
const eitherBoolean = either('boolean');
const always = (value) => () => value;

const buildApprovalsConfig = signet.enforce(
    'approvalsOptions => approvalsConfig:object',
    function buildApprovalsConfig(options) {
        return {
            reporters: [options.reporter],
            normalizeLineEndingsTo: eitherString(require('os').EOL, options.lineEnding),
            appendEOL: eitherBoolean(true, options.appendEOL),
            EOL: eitherString(require('os').EOL, options.EOL),
            errorOnStaleApprovedFiles: eitherBoolean(true, options.errorOnStaleApprovedFiles),
            shouldIgnoreStaleApprovedFile: either('function')(always(false), options.shouldIgnoreStaleApprovedFile),
            stripBOM: eitherBoolean(false, options.stripBOM),
            forceApproveAll: false,
            failOnLineEndingDifferences: eitherBoolean(true, options.failOnLineEndingDifferences)
        };
    }
);

module.exports = {
    buildApprovalsConfig: buildApprovalsConfig,
    getApprovalsOptionsDefinition: () => approvalsOptions,
    getApprovalsReporterDefinition: () => approvalsReporter
};