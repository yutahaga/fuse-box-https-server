"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./Server");
function serve(fuse, opts, fn) {
    opts = opts || {};
    opts.host = opts.host || 'dev.localhost';
    opts.port = opts.port || 4444;
    fuse.producer.devServerOptions = {
        root: opts.root,
        port: opts.port
    };
    fuse.producer.runner.bottom(() => {
        let server = new Server_1.Server(fuse);
        server.start(opts);
        if (opts.open) {
            try {
                const opn = require('opn');
                opn(typeof opts.open === 'string'
                    ? opts.open
                    : `https://${opts.host}:${opts.port}`);
            }
            catch (e) {
                fuse.context.log.echoRed('If you want to open the browser, please install "opn" package. "npm install opn --save-dev"');
            }
        }
        if (fn) {
            fn(server);
        }
    });
}
exports.serve = serve;
