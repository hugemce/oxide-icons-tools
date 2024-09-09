/// <reference types="node" />
import { Svg } from './Core';
export interface Template {
    readonly base: string;
    readonly path: string;
    readonly relative: string;
    readonly extname: string;
    readonly contents: Buffer;
    readonly toString: () => string;
}
declare const createFiles: (svgs: Svg[], name: string) => Template[];
export { createFiles };
