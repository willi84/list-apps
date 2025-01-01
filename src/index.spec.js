import  mock  from 'mock-fs';
describe('Index', () => {
    beforeEach(() => {
        mock.restore();
        PATH = `foo`;
        mock({ 
          'foo': {
            'file.txt': 'xx',
            'package.json': 'xx',
            'file.json': '{ "xxx": 2}',
            'invalidKey.json': `{ xxx: 2, "yyy": "foobar", bla: "blubber", holsten: { "bla": "kosten"}}`,
          },
          'tmpEmpty': {}
          });
      });
      afterEach(() => {
        mock.restore();
        // jest.clearAllMocks();
        // readline.cursorTo(process.stdout, 0);
      });
    it('xxx', () => {
        expect(2).toEqual(2);
    });
});