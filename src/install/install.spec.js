const { OK, WARNING, DEBUG } = require('../log/log');
const {
    createCommandFunction,
    updateBashConfiguration,
    printResult
} = require('./install');
const TEST_KEY = 'MY_APP';
const OTHER_COMMAND = 'alias aa="node /path/to/myApp.js"';
const TEST_COMMAND = `#START: ${TEST_KEY}
echo "hello new command"
#END: ${TEST_KEY}`;
const TEST_OLD_COMMAND = `#START: ${TEST_KEY}
echo "old command"
#END: ${TEST_KEY}`;

describe('createCommandFunction()', () => {
    it('should return a command string', () => {
        const KEY = 'MY_APP';
        const date = '2021-09-01 12:00:00';
        const config = {
            LMA_COMMAND: 'myApp',
            LMA_NAME: KEY,
            LMA_TMP_FILE_PATH: '/tmp/myApp.tmp'
        };
        const scriptPath = '/path/to/myApp.js';
        const params = '"$searchDirectory" "$PWD"';
        const expected = `
# START: ${KEY}    [added at ${date}]
${config.LMA_COMMAND}(){
    echo "cmd: $PWD  ${config.LMA_COMMAND}"
    # argument director is either $1 or .
    searchDirectory=\${1:-.}
    # ${params}
    node ${scriptPath} "$searchDirectory" "$PWD"
    # if folder er
    if [ -f ${config.LMA_TMP_FILE_PATH} ]; then
            TMP_VARR=$(cat ${config.LMA_TMP_FILE_PATH})
            echo " tmpVAR: $TMP_VARR"
            cd $(cat ${config.LMA_TMP_FILE_PATH})
            rm ${config.LMA_TMP_FILE_PATH}
    else
            echo "No file temporary file '${config.LMA_TMP_FILE_PATH}' for the path found"
    fi
}
# END: ${KEY}`;
        const result = createCommandFunction(config, scriptPath, date);
        console.log(result);
        expect(result).toEqual(expected);
    });
});
describe('updateBashFile()', () => {
    it('should do update nothing by default', () => {
        const content = '';
        const command = '';
        const expected = {
            newContent: '\n', // TODO: fix
            logs: [{ type: OK, message: '[MY_APP] cmd added' }]
        };
        const result = updateBashConfiguration(content, command, TEST_KEY);
        expect(result).toEqual(expected);
    });
    it('should add new command if not exists', () => {
        const content = 'alias aa="node /path/to/myApp.js"';
        const expected = {
            newContent: `${content}
${TEST_COMMAND}`,
            logs: [{ type: OK, message: '[MY_APP] cmd added' }]
        };
        const result = updateBashConfiguration(content, TEST_COMMAND, TEST_KEY);
        expect(result).toEqual(expected);
    });
    it('should update old command', () => {
        const oldCommand = TEST_OLD_COMMAND;
        const content = `${OTHER_COMMAND}
${oldCommand}`;
        const expected = {
            newContent: `${OTHER_COMMAND}
${TEST_COMMAND}`,
            logs: [{ type: OK, message: '[MY_APP/1] old/last cmd replaced' }]
        };
        const result = updateBashConfiguration(content, TEST_COMMAND, TEST_KEY);
        expect(result).toEqual(expected);
    });
    it('should remove all old command and add new command', () => {
        const oldCommand = TEST_OLD_COMMAND;
        const content = `${OTHER_COMMAND}
${oldCommand}
${oldCommand}`;
        const expected = {
            newContent: `${OTHER_COMMAND}
${TEST_COMMAND}`,
            logs: [
                { type: WARNING, message: '[MY_APP] multiple cmd found [2]' },
                { type: DEBUG, message: '[MY_APP/1] old cmd removed' },
                { type: OK, message: '[MY_APP/2] old/last cmd replaced' }
            ]
        };
        const result = updateBashConfiguration(content, TEST_COMMAND, TEST_KEY);
        expect(result).toEqual(expected);
    });
});
describe('printResult()', () => {
    it('should print valid logs', () => {
        const logs = [
            { type: OK, message: 'ok' },
            { type: WARNING, message: 'warning' },
            { type: DEBUG, message: 'debug' }
        ];
        const validTypes = [OK, WARNING];
        const expected = ['ok', 'warning'];
        const spy = jest.spyOn(console, 'log').mockImplementation();
        printResult(logs, validTypes);
        expect(console.log).toHaveBeenCalledTimes(2);
        const actualLogs = console.log.mock.calls;
        expect(actualLogs[0][0].indexOf(expected[0]) !== -1).toEqual(true);
        expect(actualLogs[1][0].indexOf(expected[1]) !== -1).toEqual(true);
        spy.mockRestore();
    });
});
