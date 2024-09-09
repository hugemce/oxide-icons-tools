import { PluginOptions } from '../Configuration';
export interface Svg {
    readonly name: string;
    readonly data: string;
}
declare const iconPackager: (options: PluginOptions) => Promise<void>;
export { iconPackager };
