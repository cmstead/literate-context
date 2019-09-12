const childProcess = require('child_process');
const path = require('path');

const approvalsPath = process.argv[2];
const absolutePath = path.join(
    process.cwd(),
    approvalsPath
);

try{
    childProcess.execSync(`rm ${absolutePath}`);
} catch (e) {
    console.log('Failed to delete files: ' + absolutePath);
    // do nothing
}