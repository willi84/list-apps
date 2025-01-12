const { detectFragement } = require('./../detect/detect');
const { OK, WARNING, DEBUG, LOG } = require('./../log/log');
const createCommandFunction = (config, scriptPath, date) => {
    const COMMAND = config.LMA_COMMAND;
    const KEY = config.LMA_NAME;
    const TMP_FILE_PATH = config.LMA_TMP_FILE_PATH;
    const params = '"$searchDirectory" "$PWD"';
    const commandToAdd = `
# START: ${KEY}    [added at ${date}]
${COMMAND}(){
    echo "cmd: $PWD  ${COMMAND}"
    # argument director is either $1 or .
    searchDirectory=\${1:-.}
    # ${params}
    node ${scriptPath} "$searchDirectory" "$PWD"
    # if folder er
    if [ -f ${TMP_FILE_PATH} ]; then
            TMP_VARR=$(cat ${TMP_FILE_PATH})
            echo " tmpVAR: $TMP_VARR"
            cd $(cat ${TMP_FILE_PATH})
            rm ${TMP_FILE_PATH}
    else
            echo "No file temporary file '${TMP_FILE_PATH}' for the path found"
    fi
}
# END: ${KEY}`;
    return commandToAdd;
};

// shortcut for logging
const LOG_ = (logs, type, message) => {
    logs.push({ type, message });
};

const updateBashConfiguration = (content, command, KEY) => {
    const logs = [];
    const detected = detectFragement(content, KEY);
    let i = 0;
    let newContent = content;
    const len = detected.length;
    if (len > 1) {
        LOG_(logs, WARNING, `[${KEY}] multiple cmd found [${len}]`);
    }
    if (len > 0) {
        for (const d of detected) {
            i += 1;
            const item = `${KEY}/${i}`;
            if (i === len) {
                // lastd
                newContent = newContent.replace(d.full, command);
                LOG_(logs, OK, `[${item}] old/last cmd replaced`);
            } else {
                newContent = newContent.replace(d.full + '\n', '');
                LOG_(logs, DEBUG, `[${item}] old cmd removed`);
            }
        }
    } else {
        newContent += `\n${command}`;
        LOG_(logs, OK, `[${KEY}] cmd added`);
    }
    return { newContent, logs };
};

const printResult = (logs, validTypes) => {
    for (const log of logs) {
        if (validTypes.indexOf(log.type) > -1) {
            LOG(log.type, log.message);
        }
    }
};
exports.updateBashConfiguration = updateBashConfiguration;
exports.createCommandFunction = createCommandFunction;
exports.printResult = printResult;
exports.LOG_ = LOG_;
