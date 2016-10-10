/**
 * Imports
 */

import css from './css'
import favicon from 'lib/favicon'
import * as katex from 'lib/katex'

const cloudFS = require('cloud-fs')
const client = cloudFS.url('./scripts/weo.js')
const image = cloudFS.url('./simple1200x620.png')

const apiStatic = process.env.API_STATIC

const og = {
  title: 'Your assignments Simplified | WEO',
  image,
  site_name: 'Weo',
  type: 'website',
  description: 'Create and share educational activities with colleagues and students.'
}

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
          <link href="${katex.cssUrl}" rel="stylesheet"/>
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
