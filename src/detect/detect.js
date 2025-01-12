const detectFragment = (fragment, name) => {
    const result = [];
    // get content between # START: ${name} and # END: ${name}

    // TODO: avoid ${name} x as match
    // TODO: make possible ${name} added at <date>
    const SPACE = '\\s';
    const TERM = `${SPACE}*:${SPACE}*${name}`;
    const regexStart = new RegExp(`(#${SPACE}*START${TERM})+`, 'ig');
    const regexEnd = new RegExp(`(#${SPACE}*END${TERM})+`, 'ig');

    const detectStartTerm = fragment.match(regexStart, 'ig');
    const detectEndTerm = fragment.match(regexEnd, 'ig');
    if (!detectStartTerm || !detectEndTerm) {
        return result;
    }
    const startTerm = detectStartTerm[0];
    const endTerm = detectEndTerm[0];

    // get fragment between startTerm and endTerm (without startTerm in between)
    const regex = new RegExp(
        `${startTerm}([^\\n]*)\\s*([\\s\\S]*?)(?<!${startTerm})${endTerm}\\1`,
        'ig'
    );

    const matches = Array.from(fragment.matchAll(regex));
    for (const m of matches) {
        const matchedTerm = m[0].replace(startTerm, '').replace(endTerm, '');
        result.push({
            content: matchedTerm.trim(),
            full: m[0],
            startTerm,
            endTerm
        });
    }
    return result;
};
exports.detectFragement = detectFragment;
