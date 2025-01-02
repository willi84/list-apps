const mock = require('mock-fs');
const app = require('./index');

const FILES_APP_A = {
    'app-a': {
        'file.txt': 'xx',
        'package.json': 'xx',
        'file.json': '{ "xxx": 2}'
    }
};

const FILES_ARCHIVE = {
    archive: {
        'new-archive': {
            2025: {
                foobar: { 'package.json': 'xx' }
            },
            2024: {
                sub: {
                    otherApp: { 'package.json': 'xx' }
                }
            }
        }
    }
};
const FILES_APPS = {
    apps: {
        'app-b': { 'package.json': 'xx' },
        'app-c': {
            'package.json': 'xx'
            // 'sub': { // TODO: stop level
            //   'newApp': { 'package.json': 'xx' },
            // }
        }
    }
};

describe('readFilesRecursively()', () => {
    beforeEach(() => {
        mock.restore();
        mock({
            '.git': {},
            node_modules: {
                'package.json': 'xx'
            },
            ...FILES_APP_A,
            ...FILES_APPS,
            ...FILES_ARCHIVE,
            tmpEmpty: {}
        });
    });
    afterEach(() => {
        mock.restore();
    });
    it('get maximum 6 levels', () => {
        const result = [
            { path: 'app-a/file.json', type: 'file' },
            { path: 'app-a/file.txt', type: 'file' },
            { path: 'app-a/package.json', type: 'file' },
            { path: 'app-a', type: 'folder' },

            // apps
            { path: 'apps/app-b/package.json', type: 'file' },
            { path: 'apps/app-b', type: 'folder' },
            { path: 'apps/app-c/package.json', type: 'file' },
            { path: 'apps/app-c', type: 'folder' },
            { path: 'apps', type: 'folder' },

            // archive
            {
                path: 'archive/new-archive/2024/sub/otherApp/package.json',
                type: 'file'
            },
            { path: 'archive/new-archive/2024/sub/otherApp', type: 'folder' },
            { path: 'archive/new-archive/2024/sub', type: 'folder' },
            { path: 'archive/new-archive/2024', type: 'folder' },
            {
                path: 'archive/new-archive/2025/foobar/package.json',
                type: 'file'
            },
            { path: 'archive/new-archive/2025/foobar', type: 'folder' },
            { path: 'archive/new-archive/2025', type: 'folder' },
            { path: 'archive/new-archive', type: 'folder' },
            { path: 'archive', type: 'folder' },

            // folder
            { path: 'tmpEmpty', type: 'folder' }
        ];
        expect(app.readFilesRecursively('.', 6, [])).toEqual(result);
    });
    it('get maximum 4 levels', () => {
        const result = [
            { path: 'app-a/file.json', type: 'file' },
            { path: 'app-a/file.txt', type: 'file' },
            { path: 'app-a/package.json', type: 'file' },
            { path: 'app-a', type: 'folder' },

            // apps
            { path: 'apps/app-b/package.json', type: 'file' },
            { path: 'apps/app-b', type: 'folder' },
            { path: 'apps/app-c/package.json', type: 'file' },
            { path: 'apps/app-c', type: 'folder' },
            { path: 'apps', type: 'folder' },

            // archive
            // {"path": "archive/new-archive/2024/sub/otherApp/package.json", "type": "file"},
            // {"path": "archive/new-archive/2024/sub/otherApp", "type": "folder"},
            { path: 'archive/new-archive/2024/sub', type: 'folder' },
            { path: 'archive/new-archive/2024', type: 'folder' },
            // {"path": "archive/new-archive/2025/foobar/package.json", "type": "file"},
            { path: 'archive/new-archive/2025/foobar', type: 'folder' },
            { path: 'archive/new-archive/2025', type: 'folder' },
            { path: 'archive/new-archive', type: 'folder' },
            { path: 'archive', type: 'folder' },

            // folder
            { path: 'tmpEmpty', type: 'folder' }
        ];
        expect(app.readFilesRecursively('.', 4, [])).toEqual(result);
    });
});
describe('getAppDirectory()', () => {
    it('should get a list of apps', () => {
        const fileList = [
            { path: 'dev/2022/app-1/package.json', type: 'file' },
            { path: 'dev/2022/app-1/foo.json', type: 'file' },
            { path: 'dev/2023/app-2/file.json', type: 'file' },
            { path: 'dev/2023/app-2/package.json', type: 'file' }
        ];
        const expected = {
            2022: [{ name: 'app-1', path: 'dev/2022/app-1' }],
            2023: [{ name: 'app-2', path: 'dev/2023/app-2' }]
        };
        expect(app.getAppDirectory('dev', fileList)).toEqual(expected);
    });
});
