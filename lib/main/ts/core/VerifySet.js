"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySet = void 0;
const chalk_1 = __importDefault(require("chalk"));
const esm_1 = __importDefault(require("esm"));
const fancy_log_1 = __importDefault(require("fancy-log"));
const Configuration_1 = __importDefault(require("../Configuration"));
const esmRequire = (0, esm_1.default)(module);
const difference = (source, toExclude) => source.filter((value) => !toExclude.find((val) => val === value));
const produceDiff = (iconNames, defaultIconNames) => {
    const additional = difference(defaultIconNames, iconNames);
    const omitted = difference(iconNames, defaultIconNames);
    let diff = '';
    if (additional.length) {
        const additionalDiff = additional.reduce((acc, str) => acc + '\n  + ' + str, '');
        diff += chalk_1.default.green(`${additional.length} additional icon${(additional.length > 1 ? 's' : '') + additionalDiff}\n`);
    }
    if (omitted.length) {
        const omittedDiff = omitted.reduce((acc, str) => acc + '\n  - ' + str, '');
        diff += chalk_1.default.red(`${omitted.length} omitted icon${(omitted.length > 1 ? 's' : '') + omittedDiff}`);
    }
    return diff;
};
const verifySet = (svgs, diffIgnore) => {
    /* eslint-disable @typescript-eslint/no-var-requires */
    const pkg = require(Configuration_1.default.defaultIconPackage + '/package.json');
    const defaultIcons = esmRequire(Configuration_1.default.defaultIconPackage).getAll();
    const defaultIconNames = difference(Object.keys(defaultIcons), diffIgnore);
    const iconNames = difference(svgs.map((svg) => svg.name), diffIgnore);
    const diff = produceDiff(defaultIconNames, iconNames);
    if (diff.length) {
        (0, fancy_log_1.default)(`'${chalk_1.default.cyan(Configuration_1.default.pluginName)}' Displaying diff against '${pkg.name}', version: ${pkg.version} \n${diff}`);
    }
};
exports.verifySet = verifySet;
//# sourceMappingURL=VerifySet.js.map