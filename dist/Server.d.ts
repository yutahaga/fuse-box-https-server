import { SocketServer } from './SocketServer';
import { HTTPSServer } from './HTTPSServer';
import { FuseBox } from 'fuse-box';
export declare type HotReloadEmitter = (server: Server, sourceChangedInfo: any) => any;
export declare type SourceChangedEvent = {
    type: 'js' | 'css' | 'css-file' | 'hosted-css';
    content?: string;
    path: string;
    dependants?: any;
};
export interface ServerOptions {
    port?: number;
    root?: string;
    host?: string;
    key?: string;
    cert?: string;
    backlog?: number;
    emitter?: HotReloadEmitter;
    httpsServer?: boolean;
    socketURI?: string;
    hmr?: boolean;
    open?: boolean | string;
    proxy?: {
        [key: string]: {
            target: string;
            changeOrigin?: boolean;
            pathRewrite: {
                [key: string]: string;
            };
            router: {
                [key: string]: string;
            };
        };
    };
}
export declare class Server {
    private fuse;
    httpsServer: HTTPSServer;
    socketServer: SocketServer;
    constructor(fuse: FuseBox);
    start(opts?: ServerOptions): Server;
}
