"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fsExtra = require("fs-extra");
const appRoot = require("app-root-path");
const PROJECT_ROOT = process.env.FUSEBOX_DIST_ROOT || path.join(__dirname, '../../../');
const userFuseDir = appRoot.path;
function getFuseBoxInfo() {
    return require(path.join(PROJECT_ROOT, 'package.json'));
}
exports.getFuseBoxInfo = getFuseBoxInfo;
function ensureUserPath(userPath) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(userFuseDir, userPath);
    }
    userPath = path.normalize(userPath);
    let dir = path.dirname(userPath);
    fsExtra.ensureDirSync(dir);
    return userPath;
}
exports.ensureUserPath = ensureUserPath;
