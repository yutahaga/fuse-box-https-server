import * as fs from 'fs'
import * as https from 'https'
import * as express from 'express'
import { FuseBox } from 'fuse-box'
import { SocketServer } from './SocketServer'
import { getFuseBoxInfo } from './Utils'
import { ServerOptions } from './Server'

export interface HTTPSServerOptions {
  /** Defaults to 4444 if not specified */
  port?: number

  /**
     * If specfied this is the folder served from express.static
     * It can be an absolute path or relative to `appRootPath`
     **/
  root?: string

  host?: string
  key?: string
  cert?: string
  backlog?: number
}

export class HTTPSServer {
  public static start (opts: any, fuse: FuseBox): HTTPSServer {
    let server: HTTPSServer = new HTTPSServer(fuse)
    server.launch(opts)
    return server
  }

  public app: any
  public opts: HTTPSServerOptions

  constructor (private fuse: FuseBox) {
    this.app = express()
  }

  // @TODO: should add .stop()
  public launch (opts: HTTPSServerOptions, userSettings?: ServerOptions): void {
    this.opts = opts || {}
    const port = this.opts.port || 4444
    const host = this.opts.host || 'dev.localhost'
    const key = fs.readFileSync(this.opts.key || '../keys/dev.localhost.key')
    const cert = fs.readFileSync(this.opts.cert || '../keys/dev.localhost.cert')
    const backlog = this.opts.backlog || 511
    let server = https.createServer({ key, cert })
    SocketServer.createInstance(server, this.fuse)
    this.setup()

    if (userSettings && userSettings.proxy) {
      let proxyInstance
      try {
        proxyInstance = require('http-proxy-middleware')
      } catch (e) {}
      if (proxyInstance) {
        for (let uPath in userSettings.proxy) {
          this.app.use(uPath, proxyInstance(userSettings.proxy[uPath]))
        }
      } else {
        this.fuse.context.log.echoWarning(
          'You are using development proxy but "http-proxy-middleware" was not installed'
        )
      }
    }

    server.on('request', this.app)
    setTimeout(() => {
      const packageInfo = getFuseBoxInfo()
      server.listen(port, host, backlog, () => {
        const msg = `
-----------------------------------------------------------------
Development server running https://${host}:${port} @ ${packageInfo.version}
-----------------------------------------------------------------
`
        console.log(msg)
        // this.spinner = new Spinner(msg);
        // this.spinner.start()
      })
    }, 10)
  }

  private setup (): void {
    if (this.opts.root) {
      this.app.use('/', express.static(this.opts.root))
      if (
        !this.fuse.context.inlineSourceMaps &&
        process.env.NODE_ENV !== 'production'
      ) {
        this.fuse.context.log.echoInfo(
          `You have chosen not to inline source maps`
        )
        this.fuse.context.log.echoInfo('You source code is exposed at src/')
        this.fuse.context.log.echoWarning(
          'Make sure you are not using dev server for production!'
        )
        this.app.use(
          this.fuse.context.sourceMapsRoot,
          express.static(this.fuse.context.homeDir)
        )
      }
    }
  }
}
