"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importFromString = void 0;
const esm_1 = __importDefault(require("esm"));
const esmRequire = (0, esm_1.default)(module);
const importFromString = (content, filename) => {
    const Module = esmRequire('module');
    const m = new Module(filename, module);
    // eslint-disable-next-line no-underscore-dangle
    m._compile(content, filename);
    m.loaded = true;
    return m.exports;
};
exports.importFromString = importFromString;
//# sourceMappingURL=ESImport.js.map