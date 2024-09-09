"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluginName = 'gulp-oxide-icons';
const defaultIconPackage = '@tinymce/oxide-icons-default';
const requiredClasses = {
    'highlight-bg-color': 'tox-icon-highlight-bg-color__color',
    'text-color': 'tox-icon-text-color__color'
};
const mergeSvgoPluginConfig = (target, source) => {
    const merged = target.concat(source).reduce((acc, plugin) => {
        var _a, _b, _c;
        if (typeof plugin === 'string') {
            return { ...acc, [plugin]: plugin };
        }
        else if (plugin.name === 'preset-default') {
            // For preset-default we need to do a deep merge to ensure the default overrides are kept
            return {
                ...acc,
                [plugin.name]: {
                    ...plugin,
                    params: {
                        ...((_a = plugin.params) !== null && _a !== void 0 ? _a : {}),
                        overrides: {
                            ...((_c = (_b = plugin.params) === null || _b === void 0 ? void 0 : _b.overrides) !== null && _c !== void 0 ? _c : {})
                        }
                    }
                }
            };
        }
        else {
            return { ...acc, [plugin.name]: plugin };
        }
    }, {});
    return Object.values(merged);
};
const mergeSvgoOptions = (target, source) => ({
    ...target,
    ...source,
    plugins: mergeSvgoPluginConfig(target.plugins || [], source.plugins || [])
});
const getPluginOptions = (overrides) => {
    const defaultSvgoOptions = {
        floatPrecision: 1,
        plugins: [
            'removeTitle',
            'convertStyleToAttrs',
            {
                name: 'removeAttrs',
                params: {
                    attrs: 'fill'
                }
            },
            'removeXMLNS',
            {
                name: 'preset-default',
                params: {}
            },
        ]
    };
    return {
        diffDefault: false,
        diffIgnore: [],
        filePaths: [],
        licenseHeader: '',
        ...overrides,
        svgo: mergeSvgoOptions(defaultSvgoOptions, overrides.svgo || {}),
    };
};
exports.default = {
    requiredClasses,
    pluginName,
    getPluginOptions,
    defaultIconPackage
};
//# sourceMappingURL=Configuration.js.map