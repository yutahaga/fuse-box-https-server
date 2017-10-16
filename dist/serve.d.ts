import { FuseBox } from 'fuse-box';
import { Server, ServerOptions } from './Server';
export declare function serve(fuse: FuseBox, opts?: ServerOptions, fn?: {
    (server: Server): void;
}): void;
