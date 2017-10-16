import { FuseBox } from 'fuse-box'
import { Server, ServerOptions } from './Server'

export function serve (
  fuse: FuseBox,
  opts?: ServerOptions,
  fn?: { (server: Server): void }
) {
  opts = opts || {}
  opts.host = opts.host || 'dev.localhost'
  opts.port = opts.port || 4444
  fuse.producer.devServerOptions = {
    root: opts.root,
    port: opts.port
  }
  fuse.producer.runner.bottom(() => {
    let server = new Server(fuse)
    server.start(opts)
    if (opts.open) {
      try {
        const opn = require('opn')
        opn(
          typeof opts.open === 'string'
            ? opts.open
            : `https://${opts.host}:${opts.port}`
        )
      } catch (e) {
        fuse.context.log.echoRed(
          'If you want to open the browser, please install "opn" package. "npm install opn --save-dev"'
        )
      }
    }
    if (fn) {
      fn(server)
    }
  })
}
