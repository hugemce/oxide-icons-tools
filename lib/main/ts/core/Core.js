"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconPackager = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const plugin_error_1 = __importDefault(require("plugin-error"));
const Configuration_1 = __importDefault(require("../Configuration"));
const CreateFiles_1 = require("./CreateFiles");
const Optimize_1 = require("./Optimize");
const VerifyClasses_1 = require("./VerifyClasses");
const VerifySet_1 = require("./VerifySet");
const bufferFiles = async (filePaths) => {
    const svgs = [];
    const promises = filePaths.map(async (filePath) => {
        const name = path_1.default.basename(filePath, path_1.default.extname(filePath));
        const data = await promises_1.default.readFile(filePath, 'utf8');
        return { name, data };
    });
    const results = await Promise.all(promises);
    svgs.push(...results);
    return svgs;
};
const transform = async (svgs, rawOptions) => {
    const options = Configuration_1.default.getPluginOptions(rawOptions);
    const optimizedSvgs = (typeof rawOptions.svgo === 'boolean' && rawOptions.svgo === false)
        ? svgs
        : await (0, Optimize_1.optimizeSvgs)(svgs, options.svgo);
    (0, VerifyClasses_1.verifyClasses)(optimizedSvgs);
    if (options.diffDefault) {
        (0, VerifySet_1.verifySet)(optimizedSvgs, options.diffIgnore);
    }
    const filesToWrite = (0, CreateFiles_1.createFiles)(optimizedSvgs, options.name);
    const writePromises = filesToWrite.map(async (file) => {
        if (!file.path || !Buffer.isBuffer(file.contents)) {
            // eslint-disable-next-line no-console
            console.error('Unexpected file object:', file);
            return;
        }
        const outputDir = './dist';
        const fullPath = `${outputDir}/${file.relative}`;
        const dirName = path_1.default.dirname(fullPath);
        // Ensure the directory exists
        if (!fs_1.default.existsSync(dirName)) {
            fs_1.default.mkdirSync(dirName, { recursive: true });
        }
        return promises_1.default.writeFile(fullPath, file.extname === '.js' && options.licenseHeader !== '' && options.licenseHeader
            ? `${options.licenseHeader}\n${file.contents}`
            : file.contents);
    });
    await Promise.all(writePromises);
};
const iconPackager = async (options) => {
    var _a;
    try {
        const svgs = await bufferFiles((_a = options.filePaths) !== null && _a !== void 0 ? _a : []);
        await transform(svgs, options);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new plugin_error_1.default(Configuration_1.default.pluginName, err.message);
        }
        throw new plugin_error_1.default(Configuration_1.default.pluginName, 'Unknown error occurred');
    }
};
exports.iconPackager = iconPackager;
//# sourceMappingURL=Core.js.map