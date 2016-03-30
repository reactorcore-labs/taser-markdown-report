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

        let markdownReport = [
            reportHeader()
        ];

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

function reportHeader() {
    return [
        '# :zap: Taser Report :zap:',
        ''
    ];
}

function reportError(problem) {
    return [
        `###: :x: Error testing ${problem}`,
        '#### Please review the problem and submit a new pull request',
        '(hint: your function might be returning `null` or `undefined`'
    ];
}

function problemReportHeader(problem) {
    return [
        '',
        '----',
        '',
        `## Problem: ${problem}`
    ];
}

function problemReportBody(report) {
    return [
        testReportHeader(report),
        testReportErrors(report.errors),
        testReportPassed(report.testResults.passed),
        testReportFailed(report.testResults.failed)
    ];
}

function testReportHeader(report) {
    let contextName = report.browser.name;
    let numberOfErrors = report.errors.length;
    let numberOfPasses = report.testResults.passed.length;
    let numberOfFailures = report.testResults.failed.length;

    return [
        `**Browser**: ${contextName}`,
        '',
        '| Type | Count |',
        '| ---- | ----- |',
        `| Errors | ${numberOfErrors} |`,
        `| Failed | ${numberOfFailures} |`,
        `| Passed | ${numberOfPasses} |`,
        ''
    ];
}

function testReportErrors(errors) {
    let content = [];

    if (errors.length) {
        content.push('');
        content.push('### Errors: ');
        content.push('');

        for( let i = 0; i < errors.length; i++ ) {
            content.push(`1. \`${errors[i]}\`  `);
        }
    }

    return content;
}

function testReportPassed(passedTests) {
    let content = [];

    if (passedTests.length) {
        content.push('');
        content.push('### Passed: ');
        content.push('');

        for( let i = 0; i < passedTests.length; i++ ) {
            let testSuite = passedTests[i].suite.join(' ⟶ ');
            let testDescription = passedTests[i].description;

            content.push(`#### :heavy_check_mark: ${i}. ${testSuite} ⟶ ${testDescription}  `);
        }
    }

    return content;
}

function testReportFailed(failedTests) {
    let content = [];

    if (failedTests.length) {
        content.push('');
        content.push('### Failed: ');
        content.push('');

        for( let i = 0; i < failedTests.length; i++ ) {
            let testSuite = failedTests[i].suite.join(' ⟶ ');
            let testDescription = failedTests[i].description;

            content.push(`#### :heavy_multiplication_x: ${i}. ${testSuite} ⟶ testDescription  `);

            if( failedTests[i].fn ) {
                content.push('  * **Test:**');
                content.push('  ```javascript');
                content.push('');
                content.push('')
                content.push(`${failedTests[i].fn}`);
                content.push('');
                content.push('````  ');
            }

            for( let j = 0; j < failedTests[i].log.length; j++ ) {
                let failedTestLog = failedTests[i].log[j];

                content.push('  * **Log:**');
                content.push('  ```shell');
                content.push('');
                content.push('');
                content.push(`${failedTestLog}`);
                content.push('');
                content.push('````  ');
            }

            content.push('---------  ');
            content.push('');
        }
    }

    return content;
}
