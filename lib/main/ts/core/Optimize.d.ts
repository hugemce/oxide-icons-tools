import { OptimizeOptions } from 'svgo';
import { Svg } from './Core';
declare const optimizeSvgs: (svgs: Svg[], svgoOptions: OptimizeOptions) => Promise<Svg[]>;
export { optimizeSvgs };
