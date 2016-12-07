/**
 * Imports
 */

import * as touchIcons from 'lib/apple-touch-icons'
import * as katex from 'lib/katex'
import favicon from 'lib/favicon'
import og from 'lib/open-graph'
import fonts from 'lib/fonts'
import css from 'lib/css'

/**
 * Assets
 */

const cloudFS = require('cloud-fs')
const client = cloudFS.url('./scripts/weo.js')

/**
 * Config
 */

const apiStatic = process.env.API_STATIC

/**
 * Page
 */

function page ({html, state, title}) {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <base href='/' />

          <!-- Meta -->
          <meta name='google' value='notranslate' />
          <meta name='description' content='${og.description}' />
          <meta name='fragment' content='!' />
          <meta name='pinterest' content='nohover' />
          <link rel='apple-touch-icon' href='${touchIcons.iphone}'>
          <link rel='apple-touch-icon' sizes='76x76' href='${touchIcons.ipad}'>
          <link rel='apple-touch-icon' sizes='120x120' href='${touchIcons.iphoneRetina}'>
          <link rel='apple-touch-icon' sizes='152x152' href='${touchIcons.ipadRetina}'>


          <!-- Open Graph -->
          <meta property ='og:site_name' content='${og.site_name}' />
          <meta property='og:description' content='${og.description}' />
          <meta property='og:image' content='${og.image}' />
          <meta property='og:title' content='${og.title}' />
          <meta property='og:type' content='${og.type}' />

          <title>${title || 'Weo'}</title>
          ${
            css.map(str => `<style>${str}</style>`).join('')
          }
          <link rel=icon href="${favicon}"/>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <link href="${katex.cssUrl}" rel="stylesheet" />
          <link href="${fonts}" rel="stylesheet" />
          <script type='text/javascript'>
            window.__initialState__ = ${JSON.stringify(state)}
          </script>
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
          <script type='text/javascript' src='${apiStatic + '/socket.io/socket.io.js'}'></script>
          <script type='text/javascript' src='${client}'></script>
        </head>
        <body>${html}</body>
      </html>
    `
}

/**
 * Exports
 */

export default page
