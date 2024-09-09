"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const xmldom_1 = require("@xmldom/xmldom");
const chai_1 = require("chai");
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const mocha_1 = require("mocha");
const path_1 = __importDefault(require("path"));
const Main_1 = require("../../main/ts/api/Main");
const ESImport_1 = require("./alien/ESImport");
const readFilesRecursively = async (dir, mockFs) => {
    const files = await promises_1.default.readdir(dir, { withFileTypes: true });
    const promises = files.map(async (file) => {
        const filePath = path_1.default.join(dir, file.name);
        if (file.isDirectory()) {
            return readFilesRecursively(filePath, mockFs);
        }
        else {
            const contents = await promises_1.default.readFile(filePath);
            mockFs[filePath] = {
                base: '.',
                path: filePath,
                relative: file.name,
                extname: path_1.default.extname(filePath),
                contents: Buffer.from(contents),
                toString: () => `<File "${filePath}" <Buffer ${contents.toString().substring(0, 50)} ... ${contents.length - 50} more bytes>>`,
            };
        }
    });
    await Promise.all(promises);
};
const runPlugin = async (options, svgs) => {
    const mockFs = {};
    if (!fs_1.default.existsSync('./dist')) {
        fs_1.default.mkdirSync('./dist');
    }
    options.filePaths = svgs.map((svg) => `./${svg.name}.svg`);
    const writePromises = svgs.map((svg) => {
        const tmpPath = `./${svg.name}.svg`;
        return promises_1.default.writeFile(tmpPath, svg.data);
    });
    await Promise.all(writePromises);
    await Main_1.iconPackager(options);
    const outputDir = './dist';
    await readFilesRecursively(outputDir, mockFs);
    return mockFs;
};
(0, mocha_1.describe)('PluginTest', () => {
    const svgs = [
        { name: 'highlight-bg-color', data: '<svg class="tox-icon-highlight-bg-color__color" width="24" height="24"></svg>' },
        { name: 'text-color', data: '<svg class="tox-icon-text-color__color" width="24" height="24"></svg>' },
        { name: 'align-left', data: '<svg width="24" height="24"><g id="a-invalid-id"></g></svg>' },
        { name: 'align-right', data: '<svg width="24" height="24"></svg>' }
    ];
    const validateIcons = (icons) => {
        const hasId = (rawSvg, id) => {
            const dom = new xmldom_1.DOMParser().parseFromString(rawSvg, 'image/svg+xml');
            return !!dom.getElementById(id);
        };
        const hasClass = (rawSvg, id) => {
            const dom = new xmldom_1.DOMParser().parseFromString(rawSvg, 'image/svg+xml');
            return dom.getElementsByClassName(id).length > 0;
        };
        const testColorIcon = (id, className) => {
            chai_1.assert.isTrue(hasClass(icons[id], className), `Should preserve "${className}" class`);
            chai_1.assert.isFalse(hasId(icons[id], className), `Should preserve "${className}" class`);
        };
        chai_1.assert.hasAllKeys(icons, svgs.map((svg) => svg.name), 'Should have all icons');
        testColorIcon('highlight-bg-color', 'tox-icon-highlight-bg-color__color');
        testColorIcon('text-color', 'tox-icon-text-color__color');
        chai_1.assert.isFalse(hasId(icons['align-left'], 'a-invalid-id'), 'Should not preserve "a-invalid-id" id');
    };
    afterEach(async () => {
        await promises_1.default.rm('./dist', { recursive: true, force: true });
        await Promise.all(svgs.map((svg) => promises_1.default.unlink(`./${svg.name}.svg`)));
    });
    it('Should output files on correct paths', () => runPlugin({ name: 'my-icon-pack' }, svgs).then((mockFs) => {
        chai_1.assert.hasAllKeys(mockFs, [
            'dist/icons/my-icon-pack/icons.js',
            'dist/html/icons.html',
            'dist/js/icons.js',
            'dist/js/icons.d.ts'
        ], 'Should output all files on correct paths');
    }));
    it('"js/icons.js" should be a ES6 module with named export "getAll"', () => runPlugin({ name: 'my-icon-pack' }, svgs).then((mockFs) => {
        const file = mockFs['dist/js/icons.js'];
        if (!file) {
            throw new Error('File js/icons.js not found in mockFs');
        }
        const exprt = (0, ESImport_1.importFromString)(file.contents.toString(), file.relative);
        chai_1.assert.isFunction(exprt.getAll, 'Should have named export "getAll"');
        validateIcons(exprt.getAll());
    }));
    it('"icons/my-icon-pack/icons.js" should add an icon pack to tinymce global', () => runPlugin({ name: 'my-icon-pack' }, svgs).then((mockFs) => {
        const file = mockFs['dist/icons/my-icon-pack/icons.js'];
        Object.defineProperty(global, 'tinymce', {
            value: {
                IconManager: {
                    add: (name, iconPack) => {
                        chai_1.assert.strictEqual(name, 'my-icon-pack', 'Should be correct icon pack name');
                        validateIcons(iconPack.icons);
                    }
                }
            }
        });
        (0, ESImport_1.importFromString)(file.contents.toString(), file.relative);
    }));
});
//# sourceMappingURL=PackageTest.js.map