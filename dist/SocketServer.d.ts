import { FuseBox } from 'fuse-box';
import { Server } from 'ws';
export declare class SocketServer {
    server: any;
    fuse: FuseBox;
    static server: SocketServer;
    static entity: Server;
    static createInstance(server: any, fuse: FuseBox): SocketServer;
    static getInstance(): SocketServer;
    static start(server: any, fuse: FuseBox): SocketServer;
    static startSocketServer(host: string, port: number, fuse: FuseBox): SocketServer;
    cursor: any;
    clients: Set<any>;
    constructor(server: any, fuse: FuseBox);
    send(type: string, data: any): void;
    protected onMessage(client: any, type: string, data: any): void;
}
