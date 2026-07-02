import fs from 'fs/promises';
import path from 'path';
import xlsx from 'xlsx';

const jsonFile = path.resolve('playwright-results.json');
const outputFile = path.resolve('QA', 'testexecutionreport.xlsx');

const testCaseMapping = {
  'admin login': { id: 'TC001', name: 'Admin Login', notes: 'Logged in successfully' },
  'user login': { id: 'TC002', name: 'User Login', notes: 'Redirected to dashboard' },
  'search product': { id: 'TC003', name: 'Search Product', notes: 'Search returned matching products' },
  'add product to cart': { id: 'TC004', name: 'Add to Cart', notes: 'Product added to cart' },
  'checkout': { id: 'TC005', name: 'Checkout', notes: 'Order confirmation not displayed' },
};

function formatResultStatus(status) {
  if (!status) return 'Unknown';
  return status === 'passed' ? 'Pass' : status === 'failed' ? 'Fail' : status.charAt(0).toUpperCase() + status.slice(1);
}

function flattenSuites(node, parentTitles = []) {
  const rows = [];
  const currentTitles = node.title ? [...parentTitles, node.title] : parentTitles;
  const fullSuiteTitle = currentTitles.join(' > ');

  if (node.tests?.length) {
    for (const test of node.tests) {
      const result = test.results?.[test.results.length - 1] ?? {};
      const normalizedTitle = test.title?.trim().toLowerCase();
      const info = normalizedTitle ? testCaseMapping[normalizedTitle] : undefined;
      const noteFromResult = result.errors?.length ? result.errors.join(' ') : '';
      rows.push({
        'Test Case ID': info?.id ?? '',
        'Test Case': info?.name ?? test.title,
        'Result': formatResultStatus(result.status),
        'Notes': info?.notes ?? noteFromResult,
        'Suite Path': fullSuiteTitle,
        'Test Name': test.title,
        'Status': result.status ?? 'unknown',
        'Duration (ms)': result.duration ?? '',
        'Retries': result.retry ?? test.retry ?? 0,
        'Worker': result.workerIndex ?? '',
        'Error Message': (result.errors?.join(' ') || result.error?.message || '').trim().replace(/\r?\n/g, ' '),
        'Location': test.location ? `${path.basename(test.location.file)}:${test.location.line}` : '',
        'Attachments': result.attachments?.map((attachment) => attachment.name).join('; ') ?? '',
      });
    }
  }

  if (node.specs?.length) {
    for (const spec of node.specs) {
      rows.push(...flattenSuites(spec, currentTitles));
    }
  }

  if (node.suites?.length) {
    for (const child of node.suites) {
      rows.push(...flattenSuites(child, currentTitles));
    }
  }

  return rows;
}

async function main() {
  try {
    const raw = await fs.readFile(jsonFile, 'utf8');
    const json = JSON.parse(raw);

    const rows = flattenSuites(json);
    if (!rows.length) {
      console.error('No test records were found in', jsonFile);
      process.exit(1);
    }

    const headers = [
      'Test Case ID',
      'Test Case',
      'Result',
      'Notes',
      'Suite Path',
      'Test Name',
      'Status',
      'Duration (ms)',
      'Retries',
      'Worker',
      'Error Message',
      'Location',
      'Attachments',
    ];

    const worksheet = xlsx.utils.json_to_sheet(rows, { header: headers });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'TestExecutionReport');

    const tempFile = path.resolve('QA', 'Test Execution Report.tmp.xlsx');
    const data = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    await fs.writeFile(tempFile, data);

    try {
      await fs.rm(outputFile, { force: true });
    } catch (removeError) {
      if (removeError.code !== 'ENOENT' && removeError.code !== 'EBUSY') {
        throw removeError;
      }
    }

    try {
      await fs.rename(tempFile, outputFile);
    } catch (renameError) {
      if (renameError.code === 'EBUSY') {
        console.error(`Failed to write the report because the file is open or locked: ${outputFile}`);
        console.error('Close the file in Excel or another program and rerun the report generator.');
        process.exit(1);
      }
      throw renameError;
    }

    console.log(`Test execution report created: ${outputFile}`);
  } catch (error) {
    console.error('Failed to create test execution report:', error);
    process.exit(1);
  }
}

main();
