"use strict";

const chai = require('chai');
const should = chai.should();
const TaserMarkdownReport = require('../lib/taser-markdown-report');

describe('TaserMarkdownReport', function() {
    let markdownReport;

    beforeEach(function() {
        markdownReport = new TaserMarkdownReport();
    });

    describe('api', function() {
        it('should have a generateMarkdown()', function() {
            markdownReport.should.respondTo('generateMarkdown');
        });
    });

    describe('behavior', function() {
        describe('when given a valid taser report', function() {
            let validTaserReport;

            beforeEach(function() {
                validTaserReport = [{
                    problem: 'ds-queue',
                    reports: [{
                        browser: { name: 'PhantomJS' },
                        errors: [],
                        testResults: {
                            passed: [],
                            failed: []
                        }
                    }]
                }];
            });

            it('should generate markdown', function() {
                let report = markdownReport.generateMarkdown(validTaserReport);

                report.should.exist;
            });
        });

        describe('when not given an array of taser report', function() {
            it('should throw an exception', function() {
                should.throw(function() {
                    markdownReport.generateMarkdown({ problem: 'format' });
                });
            });
        });

        describe('when not given anything for taser reports', function() {
            it('should throw an exception', function() {
                should.throw(function() {
                    markdownReport.generateMarkdown();
                });
            });
        });
    });
});