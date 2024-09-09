import * as SVGO from 'svgo';
export interface PluginOptions {
    name: string;
    filePaths?: string[];
    diffDefault?: boolean;
    diffIgnore?: string[];
    svgo?: SVGO.OptimizeOptions;
    licenseHeader?: string;
}
declare const _default: {
    requiredClasses: Record<string, string>;
    pluginName: string;
    getPluginOptions: (overrides: PluginOptions) => Required<PluginOptions>;
    defaultIconPackage: string;
};
export default _default;
