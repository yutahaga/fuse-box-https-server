# fuse-box-https-server

HTTPS Server for FuseBox.

## Install

```sh
yarn add https://github.com/yutahaga/fuse-box-https-server.git -D
```

## Usage


```ts
import { FuseBox } from 'fuse-box'
import { serve } from 'fuse-box-https-server'

const fuse = FuseBox.init({ /* your options */ })

serve(
  fuse,
  {
    port?: number
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
  },
  server => {
    fuse.bundle('app').hmr()
  }
)
```
