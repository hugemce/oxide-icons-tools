"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFiles = void 0;
const path_1 = __importDefault(require("path"));
const IconGetter_1 = require("../templates/IconGetter");
const IconProvider_1 = require("../templates/IconProvider");
const IconsHtml_1 = require("../templates/IconsHtml");
const populateTemplates = (svgs, name) => [
    {
        path: 'js/icons.js',
        contents: (0, IconGetter_1.populateGetter)(svgs)
    },
    {
        path: 'js/icons.d.ts',
        contents: (0, IconGetter_1.populateGetterDeclarations)(svgs)
    },
    {
        path: 'html/icons.html',
        contents: (0, IconsHtml_1.populateIconsHtml)(svgs)
    },
    {
        path: `icons/${name}/icons.js`,
        contents: (0, IconProvider_1.populateIconProvider)(svgs, name)
    }
];
const createFiles = (svgs, name) => populateTemplates(svgs, name).map((data) => ({
    base: '.',
    path: data.path,
    relative: path_1.default.relative('.', data.path),
    extname: path_1.default.extname(data.path),
    contents: Buffer.from(data.contents),
    toString: () => `<File "${data.path}" <Buffer ${data.contents.toString().substring(0, 50)} ... ${data.contents.length - 50} more bytes>>`
}));
exports.createFiles = createFiles;
//# sourceMappingURL=CreateFiles.js.map