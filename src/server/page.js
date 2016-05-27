/**
 * Imports
 */

const fs = require('fs')
const config = require('lib/config')

/**
 * Read in global styles
 */

const globalStyle = fs.readFileSync(__dirname + '/global.css', 'utf8')

/**
 * Page
 */

function page ({html, state}) {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <base href='/' />

          <meta name='google' content='notranslate' />

          <title>Weo</title>
          <style>
            ${globalStyle}
          </style>
          <link rel=icon href="${config.favicon}">
          <link rel="preload" href="//themes.googleusercontent.com/static/fonts/lato/v7/kcf5uOXucLcbFOydGU24WALUuEpTyoUstqEm5AMlJo4.woff" as="font">
          <link rel="preload" href="//themes.googleusercontent.com/static/fonts/lato/v7/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff" as="font">
          <link rel="preload" href="//themes.googleusercontent.com/static/fonts/lato/v7/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff" as="font">
          <link rel="preload" href="//themes.googleusercontent.com/static/fonts/lato/v7/G2uphNnNqGFMHLRsO_72ngLUuEpTyoUstqEm5AMlJo4.woff" as="font">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <script type='text/javascript' src='${process.env.CLIENT_JS_BUILD}'></script>
          <script type='text/javascript'>
            window.__initialState__ = ${JSON.stringify(state)}
          </script>
        </head>
        <body>${html}</body>
      </html>
    `
}

/**
 * Exports
 */

export default page
