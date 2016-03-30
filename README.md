Taser Markdown Report
=====================

A Taser report that formats its output in 
[Github flavored markdown](https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown).

## Usage

To use the Markdown Report, simple create a new instance of the class, and then generate a markdown report. This 
requires the caller to have a Taser Report already created as this module only reformats it.

```
const TaserMarkdownReport = require('taser-markdown-report');
const markdownReport = new TaserMarkdownReport();
const taserReport = getTaserReportFromSomewhere();

markdownReport.generateMarkdown(taserReport);
```

## Example report

# :zap: Taser Report :zap:

----

## Problem: ds-queue
**Browser**: PhantomJS
| Type | Count |
| ---- | ----- |
| Errors | 0 |
| Failed | 1 |
| Passed | 4 |

### Passed: 

#### :heavy_check_mark: 0. Queue ⟶ should have an add method, and that method should be a function  
#### :heavy_check_mark: 1. Queue ⟶ should have a remove method, and that method should be a function  
#### :heavy_check_mark: 2. Queue ⟶ should be able to add and then retreive that same item using add/remove  
#### :heavy_check_mark: 3. Queue ⟶ should always remove the earliest item to be added  

### Failed: 

#### :heavy_multiplication_x: 0. Queue ⟶ testDescription  
  * **Log:**
  ```shell


AssertionError: expected false to equal undefined
    at absolute/Users/spidy/.nvm/versions/node/v4.4.0/lib/node_modules/taser/node_modules/chai/chai.js:210
    at assertEqual (absolute/Users/spidy/.nvm/versions/node/v4.4.0/lib/node_modules/taser/node_modules/chai/chai.js:782)
    at absolute/Users/spidy/.nvm/versions/node/v4.4.0/lib/node_modules/taser/node_modules/chai/chai.js:4192
    at absolute/Users/spidy/.nvm/versions/node/v4.4.0/lib/node_modules/taser/node_modules/chai/chai.js:3914
    at base/ds-queue/ds-queue.test.js:30

````  
---------  
