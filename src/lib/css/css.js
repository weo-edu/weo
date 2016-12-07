/**
 * Imports
 */

const fs = require('fs')
const path = require('path')

/**
 * Css
 */

const cropperCss = fs.readFileSync(path.join(__dirname, 'cropper.css'), 'utf8')
const globalCss = fs.readFileSync(path.join(__dirname, 'global.css'), 'utf8')

/**
 * Exports
 */

export default [
  cropperCss,
  globalCss
]
