"use strict";

const _ = require('lodash');

// TODO: Move validation of taser to a schema validator, or instance of custom class
// TODO: Deeper validation
class TaserMarkdownReport {
    constructor(options) {
        options = options || {};
    }

    generateMarkdown(taserReports) {
        if( !taserReports ) {
            throw new Error('Cannot generate markdown without taser reports');
        }

        if( !(taserReports instanceof Array) ) {
            throw new Error('Expected taser reports to be an Array');
        }

        let markdownReport = [];

        for( let i = 0; i < taserReports.length; i++ ) {
            let problem = taserReports[i].problem;
            let reports = taserReports[i].reports;

            if( reports === undefined ) {
                markdownReport.push(reportError(problem));
                continue;
            }

            markdownReport.push(problemReportHeader(problem));

            for( let j = 0; j < reports.length; j++ ) {
                markdownReport.push(problemReportBody(reports[j]));
            }
        }

        // Each report section returns an array of its content, flatten all content and join with a newline
        return _
            .flattenDeep(markdownReport)
            .join('\n');
    }
}

module.exports = TaserMarkdownReport;

function reportError(problem) {
    return [
        `### 500 (Internal Taser Error)`,
        `There was a fatal error testing ${problem} :sob:`,
        ''
    ];
}

function problemReportHeader(problem) {
    return [
        `## Problem: ${problem}`,
        ''
    ];
}

function problemReportBody(report) {
    return [
        testReportHeader(report),
        testReportErrors(report.errors),
        testReportFailed(report.testResults.failed),
        testReportPassed(report.testResults.passed)
    ];
}

function testReportHeader(report) {
    let numberOfPasses = report.testResults.passed.length;
    let numberOfFailures = report.testResults.failed.length;

    return [
        `> #### summary: ${numberOfPasses} / ${numberOfPasses + numberOfFailures}`,
        ''
    ];
}

function testReportErrors(errors) {
    let content = [];

    if (errors.length) {
        content.push('### Errors:');
        content.push('');

        for( let i = 0; i < errors.length; i++ ) {
            content.push('```');
            content.push(errors[i]);
            content.push('```');
        }

        content.push('');
    }

    return content;
}

function testReportPassed(passedTests) {
    let content = [];

    if (passedTests.length) {
        for( let i = 0; i < passedTests.length; i++ ) {
            let testSuite = passedTests[i].suite.join(' ');
            let testDescription = passedTests[i].description;

            content.push(`**:tada: ${testSuite} ${testDescription}**`);
        }

        content.push('');
    }

    return content;
}

function testReportFailed(failedTests) {
    let content = [];

    if (failedTests.length) {
        for( let i = 0; i < failedTests.length; i++ ) {
            let testSuite = failedTests[i].suite.join(' ');
            let testDescription = failedTests[i].description;

            content.push(`**:x: ${testSuite} ${testDescription}**`);

            for( let j = 0; j < failedTests[i].log.length; j++ ) {
                let failedTestLog = failedTests[i].log[j];

                content.push('```');
                content.push(`${failedTestLog}`);
                content.push('```');
            }

            if( failedTests[i].fn ) {
                content.push('```js');
                content.push(`${failedTests[i].fn}`);
                content.push('```');
            }

            content.push('');
        }
    }

    return content;
}
