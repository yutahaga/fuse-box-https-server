import { FuseBox } from 'fuse-box';
import { ServerOptions } from './Server';
export interface HTTPSServerOptions {
    port?: number;
    root?: string;
    host?: string;
    key?: string;
    cert?: string;
    backlog?: number;
}
export declare class HTTPSServer {
    private fuse;
    static start(opts: any, fuse: FuseBox): HTTPSServer;
    app: any;
    opts: HTTPSServerOptions;
    constructor(fuse: FuseBox);
    launch(opts: HTTPSServerOptions, userSettings?: ServerOptions): void;
    private setup();
}
