import { SocketServer } from './SocketServer'
import { ensureUserPath } from './Utils'
import { HTTPSServer } from './HTTPSServer'
import { FuseBox } from 'fuse-box'
import { utils } from 'realm-utils'
import * as process from 'process'

export type HotReloadEmitter = (server: Server, sourceChangedInfo: any) => any

export type SourceChangedEvent = {
  type: 'js' | 'css' | 'css-file' | 'hosted-css'
  content?: string
  path: string
  dependants?: any
}

export interface ServerOptions {
  /** Defaults to 4444 if not specified */
  port?: number

  /**
     * - If false nothing is served.
     * - If string specified this is the folder served from express.static
     *      It can be an absolute path or relative to `appRootPath`
     **/
  root?: string

  host?: string
  key?: string
  cert?: string
  backlog?: number

  emitter?: HotReloadEmitter
  httpsServer?: boolean
  socketURI?: string
  hmr?: boolean
  open?: boolean | string
  proxy?: {
    [key: string]: {
      target: string
      changeOrigin?: boolean
      pathRewrite: { [key: string]: string }
      router: { [key: string]: string }
    }
  }
}

/**
 * Wrapper around the static + socket servers
 */
export class Server {
  public httpsServer: HTTPSServer
  public socketServer: SocketServer
  constructor (private fuse: FuseBox) {}

  /**
     * Starts the server
  str the default bundle arithmetic string
     */
  public start (opts?: ServerOptions): Server {
    opts = opts || {}

    let rootDir = this.fuse.context.output.dir

    const root: string =
      opts.root !== undefined
        ? utils.isString(opts.root) ? ensureUserPath(opts.root as string) : null
        : rootDir
    const port = opts.port || 4444
    const host: string =
      opts.host !== undefined
        ? utils.isString(opts.host) ? opts.host : null
        : null
    const key: string =
      opts.key !== undefined
        ? utils.isString(opts.key) ? ensureUserPath(opts.key as string) : null
        : null
    const cert: string =
      opts.cert !== undefined
        ? utils.isString(opts.cert) ? ensureUserPath(opts.cert as string) : null
        : null
    const backlog: number =
      opts.backlog !== undefined
        ? !isNaN(opts.backlog) ? opts.backlog : 511
        : 511
    if (opts.hmr !== false && this.fuse.context.useCache === true) {
      setTimeout(() => {
        this.fuse.context.log.echo(`HMR is enabled`)
      }, 1000)
    } else {
      setTimeout(() => {
        this.fuse.context.log.echo(
          `HMR is disabled. Caching should be enabled and {hmr} option should be NOT false`
        )
      }, 1000)
    }

    this.httpsServer = new HTTPSServer(this.fuse)

    process.nextTick(() => {
      if (opts.httpsServer === false) {
        SocketServer.startSocketServer(port, this.fuse)
      } else {
        this.httpsServer.launch(
          {
            root,
            port,
            host,
            key,
            cert,
            backlog
          },
          opts
        )
      }
    })
    return this
  }
}
