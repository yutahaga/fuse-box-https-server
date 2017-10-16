import * as path from 'path'
import * as fsExtra from 'fs-extra'
import * as appRoot from 'app-root-path'

const PROJECT_ROOT =
  process.env.FUSEBOX_DIST_ROOT || path.join(__dirname, '../../../')
const userFuseDir = appRoot.path

export function getFuseBoxInfo () {
  return require(path.join(PROJECT_ROOT, 'package.json'))
}

/**
 * Does two things:
 * - If a relative path is given,
 *  it is assumed to be relative to appRoot and is then made absolute
 * - Ensures that the directory containing the userPath exits (creates it if needed)
 */
export function ensureUserPath (userPath: string) {
  if (!path.isAbsolute(userPath)) {
    userPath = path.join(userFuseDir, userPath)
  }
  userPath = path.normalize(userPath)
  let dir = path.dirname(userPath)

  fsExtra.ensureDirSync(dir)
  return userPath
}
