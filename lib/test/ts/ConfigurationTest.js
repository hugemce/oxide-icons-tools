"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const Configuration_1 = __importDefault(require("../../main/ts/Configuration"));
(0, mocha_1.describe)('ConfigurationTest', () => {
    it('should merge new options with default options', () => {
        var _a;
        const options = Configuration_1.default.getPluginOptions({
            name: 'my-icon-pack',
            diffDefault: true,
            svgo: {
                plugins: [{ name: 'removeXMLNS' }]
            }
        });
        // Expect the default plugins to be enabled
        const pluginNames = (_a = options.svgo.plugins) === null || _a === void 0 ? void 0 : _a.map((plugin) => typeof plugin === 'string' ? plugin : plugin.name);
        (0, chai_1.expect)(pluginNames).to.have.members([
            'removeXMLNS',
            'removeTitle',
            'removeAttrs',
            'convertStyleToAttrs',
            'preset-default'
        ]);
        // Expect options to be overridden
        (0, chai_1.expect)(options.name).to.to.equal('my-icon-pack');
        (0, chai_1.expect)(options.diffDefault).to.to.equal(true);
        (0, chai_1.expect)(options.svgo.plugins).to.deep.include({ name: 'removeXMLNS' });
        // Expect default options to exist (just testing a subset)
        (0, chai_1.expect)(options.diffIgnore).to.be.length(0);
        (0, chai_1.expect)(options.svgo.floatPrecision).to.equal(1);
    });
    it('should merge the default plugin overrides', () => {
        var _a, _b;
        const options = Configuration_1.default.getPluginOptions({
            name: 'my-icon-pack',
            diffDefault: true,
            svgo: {
                plugins: [{
                        name: 'preset-default',
                        params: {
                            overrides: {
                                removeViewBox: false
                            }
                        }
                    }]
            }
        });
        const defaults = (_a = options.svgo.plugins) === null || _a === void 0 ? void 0 : _a.find((plugin) => typeof plugin !== 'string' && plugin.name === 'preset-default');
        (0, chai_1.expect)(defaults).to.be.an('object');
        const overrides = (_b = defaults.params) === null || _b === void 0 ? void 0 : _b.overrides;
        (0, chai_1.expect)(overrides).to.have.property('removeViewBox');
    });
});
//# sourceMappingURL=ConfigurationTest.js.map