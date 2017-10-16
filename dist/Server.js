"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketServer_1 = require("./SocketServer");
const Utils_1 = require("./Utils");
const HTTPSServer_1 = require("./HTTPSServer");
const realm_utils_1 = require("realm-utils");
const process = require("process");
class Server {
    constructor(fuse) {
        this.fuse = fuse;
    }
    start(opts) {
        opts = opts || {};
        let rootDir = this.fuse.context.output.dir;
        const root = opts.root !== undefined
            ? realm_utils_1.utils.isString(opts.root) ? Utils_1.ensureUserPath(opts.root) : null
            : rootDir;
        const port = opts.port || 4444;
        const host = opts.host !== undefined
            ? realm_utils_1.utils.isString(opts.host) ? opts.host : null
            : null;
        const key = opts.key !== undefined
            ? realm_utils_1.utils.isString(opts.key) ? Utils_1.ensureUserPath(opts.key) : null
            : null;
        const cert = opts.cert !== undefined
            ? realm_utils_1.utils.isString(opts.cert) ? Utils_1.ensureUserPath(opts.cert) : null
            : null;
        const backlog = opts.backlog !== undefined
            ? !isNaN(opts.backlog) ? opts.backlog : 511
            : 511;
        if (opts.hmr !== false && this.fuse.context.useCache === true) {
            setTimeout(() => {
                this.fuse.context.log.echo(`HMR is enabled`);
            }, 1000);
        }
        else {
            setTimeout(() => {
                this.fuse.context.log.echo(`HMR is disabled. Caching should be enabled and {hmr} option should be NOT false`);
            }, 1000);
        }
        this.httpsServer = new HTTPSServer_1.HTTPSServer(this.fuse);
        process.nextTick(() => {
            if (opts.httpsServer === false) {
                SocketServer_1.SocketServer.startSocketServer(host, port, this.fuse);
            }
            else {
                this.httpsServer.launch({
                    root,
                    port,
                    host,
                    key,
                    cert,
                    backlog
                }, opts);
            }
        });
        return this;
    }
}
exports.Server = Server;
