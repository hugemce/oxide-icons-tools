"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyClasses = void 0;
const xmldom_1 = require("@xmldom/xmldom");
const chalk_1 = __importDefault(require("chalk"));
const fancy_log_1 = __importDefault(require("fancy-log"));
const Configuration_1 = __importDefault(require("../Configuration"));
const requiresClass = (svg) => !!Configuration_1.default.requiredClasses[svg.name];
const hasClass = (svg, target) => {
    const domParser = new xmldom_1.DOMParser();
    const domSvg = domParser.parseFromString(svg.data, 'image/svg+xml');
    return domSvg.getElementsByClassName(target).length > 0;
};
const verifyClasses = (svgs) => {
    const missing = [];
    svgs.filter(requiresClass).forEach((svg) => {
        if (!hasClass(svg, Configuration_1.default.requiredClasses[svg.name])) {
            missing.push(`  '${svg.name}' does not have a class equal to '${Configuration_1.default.requiredClasses[svg.name]}'`);
        }
    });
    const numMissing = missing.length;
    if (numMissing > 0) {
        (0, fancy_log_1.default)(`'${chalk_1.default.cyan(Configuration_1.default.pluginName)}' Found ${numMissing} missing ID${(numMissing > 1 ? 's' : '')}. Is this intentional?\n` + missing.join('\n'));
    }
};
exports.verifyClasses = verifyClasses;
//# sourceMappingURL=VerifyClasses.js.map