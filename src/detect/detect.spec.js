const { detectFragement } = require('./detect');
describe('detectFragement()', () => {
    describe('not detected', () => {
        it('should not detect anything if startTerm is missing', () => {
            const name = 'MY_APP';
            const code = 'console.log();';
            const startTerm = '';
            const endTerm = `# END: ${name}`;
            const input = `${startTerm}
                           ${code}
                           ${endTerm}`;
            const result = detectFragement(input, name);
            const expected = [];
            expect(result).toEqual(expected);
            expect(result.length).toEqual(0);
        });
        it('should not detect anything if endTerm is missing', () => {
            const name = 'MY_APP';
            const code = 'console.log();';
            const startTerm = `# START: ${name}`;
            const endTerm = '';
            const input = `${startTerm}
                           ${code}
                           ${endTerm}`;
            const result = detectFragement(input, name);
            const expected = [];
            expect(result).toEqual(expected);
            expect(result.length).toEqual(0);
        });
    });
    describe('detected', () => {
        it('should detect simple fragment', () => {
            const name = 'MY_APP';
            const content = 'console.log();';
            const startTerm = `# START: ${name}`;
            const endTerm = `# END: ${name}`;
            const input = `${startTerm}
                           ${content}
                           ${endTerm}`;
            const result = detectFragement(input, name);
            const expected = [{ content, startTerm, endTerm, full: input }];
            expect(result).toEqual(expected);
            expect(result.length).toEqual(1);
        });
        it('should detect simple fragment which is empty', () => {
            const name = 'MY_APP';
            const content = '';
            const startTerm = `# START: ${name}`;
            const endTerm = `# END: ${name}`;
            const input = `${startTerm}
                           ${endTerm}`;
            const result = detectFragement(input, name);
            const expected = [{ content, startTerm, endTerm, full: input }];
            expect(result).toEqual(expected);
            expect(result.length).toEqual(1);
        });
        it('should detect simple fragment with missing spaces', () => {
            const name = 'MY_APP';
            const content = 'console.log();';
            const startTerm = `#START: ${name}`;
            const endTerm = `#END: ${name}`;
            const input = `${startTerm}
                           ${content}
                           ${endTerm}`;
            const result = detectFragement(input, name);
            const expected = [{ content, startTerm, endTerm, full: input }];
            expect(result).toEqual(expected);
            console.log(result);
            expect(result.length).toEqual(1);
        });
        xit('should not detect simple fragment with wrong name', () => {
            const name = 'MY_APP';
            const code = 'console.log();';
            const startTerm = `#START: ${name}`;
            const endTerm = `#END: ${name}`;
            const input = `${startTerm}
                           ${code}
                           ${endTerm}`;
            const result = detectFragement(input, name);
            const expected = [];
            expect(result).toEqual(expected);
            expect(result.length).toEqual(1);
        });
    });
    describe('detected complex', () => {
        it('should detect multiple times simple fragment', () => {
            const name = 'MY_APP';
            const code_1 = 'console.log(1);';
            const code_2 = 'console.log(2);';
            const startTerm = `#START: ${name}`;
            const endTerm = `#END: ${name}`;
            const fragment_1 = `${startTerm}
                                ${code_1}
                                ${endTerm}`;
            const fragment_2 = `${startTerm}
                                ${code_2}
                                ${endTerm}`;
            const input = `# other code
                           ${fragment_1}
                           # some code
                           ${fragment_2}
                           # other code`;
            const result = detectFragement(input, name);
            const expected = [
                { content: code_1, startTerm, endTerm, full: fragment_1 },
                { content: code_2, startTerm, endTerm, full: fragment_2 }
            ];
            expect(result).toEqual(expected);
            expect(result.length).toEqual(2);
        });
        it('should detect nothing as its called with wrong name', () => {
            const name = 'MY_APP';
            const code_1 = 'console.log(1);';
            const code_2 = 'console.log(2);';
            const startTerm = `#START: ${name}`;
            const endTerm = `#END: ${name}`;
            const input = `${startTerm}
                           ${code_1}
                           ${endTerm}
                           # some code
                           ${startTerm}
                           ${code_2}
                           ${endTerm}`;
            const result = detectFragement(input, name + 'x'); // detect correct
            const expected = [
                // { content: code_1, startTerm, endTerm },
                // { content: code_2, startTerm, endTerm }
            ];
            expect(result).toEqual(expected);
            expect(result.length).toEqual(0);
        });
    });

    // TODO mulitple detected
    // empty
    // trim
});
