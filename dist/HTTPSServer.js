"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const spdy = require("spdy");
const express = require("express");
const SocketServer_1 = require("./SocketServer");
const Utils_1 = require("./Utils");
class HTTPSServer {
    constructor(fuse) {
        this.fuse = fuse;
        this.app = express();
    }
    static start(opts, fuse) {
        let server = new HTTPSServer(fuse);
        server.launch(opts);
        return server;
    }
    launch(opts, userSettings) {
        this.opts = opts || {};
        const port = this.opts.port || 4444;
        const host = this.opts.host || 'dev.localhost';
        const key = fs.readFileSync(this.opts.key || '../keys/dev.localhost.key');
        const cert = fs.readFileSync(this.opts.cert || '../keys/dev.localhost.cert');
        const backlog = this.opts.backlog || 511;
        const ssl = {
            ssl: { key, cert }
        };
        let server = spdy.createServer({ key, cert }, this.app);
        this.entity = server;
        SocketServer_1.SocketServer.createInstance(server, this.fuse);
        this.setup();
        if (userSettings && userSettings.proxy) {
            let proxyInstance;
            try {
                proxyInstance = require('http-proxy-middleware');
            }
            catch (e) { }
            if (proxyInstance) {
                for (let uPath in userSettings.proxy) {
                    const proxyOpts = Object.assign({}, userSettings.proxy[uPath], ssl);
                    this.app.use(uPath, proxyInstance(proxyOpts));
                }
            }
            else {
                this.fuse.context.log.echoWarning('You are using development proxy but "http-proxy-middleware" was not installed');
            }
        }
        setTimeout(() => {
            const packageInfo = Utils_1.getFuseBoxInfo();
            server.listen(port, '0.0.0.0', backlog, () => {
                const msg = `
-----------------------------------------------------------------
Development server running https://${host}:${port} @ ${packageInfo.version}
-----------------------------------------------------------------
`;
                console.log(msg);
            });
        }, 10);
    }
    setup() {
        if (this.opts.root) {
            this.app.use('/', express.static(this.opts.root));
            if (!this.fuse.context.inlineSourceMaps &&
                process.env.NODE_ENV !== 'production') {
                this.fuse.context.log.echoInfo(`You have chosen not to inline source maps`);
                this.fuse.context.log.echoInfo('You source code is exposed at src/');
                this.fuse.context.log.echoWarning('Make sure you are not using dev server for production!');
                this.app.use(this.fuse.context.sourceMapsRoot, express.static(this.fuse.context.homeDir));
            }
        }
    }
}
exports.HTTPSServer = HTTPSServer;
