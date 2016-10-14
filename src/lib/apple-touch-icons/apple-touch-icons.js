/**
 * Imports
 */

const cloudFS = require('cloud-fs')
const iphone = cloudFS.url('./touch-icon-iphone.png')
const ipad = cloudFS.url('./touch-icon-ipad.png')
const iphoneRetina = cloudFS.url('./touch-icon-iphone-retina.png')
const ipadRetina = cloudFS.url('./touch-icon-ipad-retina.png')

/**
 * Exports
 */

export {
  iphone,
  ipad,
  iphoneRetina,
  ipadRetina
}