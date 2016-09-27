/**
 * Imports
 */

import createAction from '@f/create-action'
import {parse, format} from 'url'
import asArray from '@f/as-array'
import overlaps from 'overlaps'
import equal from '@f/equal'

/**
 * Constants
 */

const excluded = ['maxResults', 'pageToken', 'sort']

/**
 * Socket
 */

function middleware ({dispatch, getState}) {
  const subs = {}
  let lastToken = getState().app.auth.token
  let socket = connect(lastToken)

  return next => action => {
    const token = getState().app.auth.token

    if (token !== lastToken) {
      lastToken = token
      socket.disconnect()
      socket = connect(lastToken)
    }

    switch (action.type) {
      case subscribe.type: {
        const {url, params = {}, cb, path} = action.payload
        subs[path] = subs[path] || []
        subs[path].push(action.payload)
        return route(url, 'post', params)
      }
      case unsubscribe.type: {
        const {url, params, path} = action.payload

        if (subs.hasOwnProperty(path)) {
          subs[path] = subs[path].filter(sub => !(sub.url === url && equal(sub.params, params)))
          if (subs[path].length === 0) delete subs[path]
        }

        return route(url, 'delete', params)
      }
      default: {
        return next(action)
      }
    }
  }

  function route (url, method, body) {
    const parsed = parse(url)
    const newUrl = format({
      ...parsed,
      pathname: parsed.pathname + '/subscription'
    })

    return new Promise((resolve, reject) => {
      socket.emit('route', {url: newUrl, body, method}, (headers, body) => {
        headers.isError
          ? reject({headers, body})
          : resolve({headers, body})
      })
    })
  }

  function connect (token) {
    const socket = io.connect(process.env.API_SERVER + '?access_token=' + encodeURIComponent(token), {
      forceNew: true,
      transports: ['polling', 'websocket']
    })

    socket.once('connect', () => socket.on('message', msg => {
      for (const key in subs) {
        subs[key].forEach(({params, cb}) => {
          if (isMatch(params, msg.params)) {
            dispatch(cb(msg))
          }
        })
      }
    }))

    return socket
  }

  function isMatch (subParams, msgParams) {
    return Object.keys(subParams).every(key =>
      excluded.indexOf(key) !== -1
        ? true
        : overlaps(asArray(msgParams[key]), asArray(subParams[key]))
    )
  }
}

/**
 * Actions
 */

const subscribe = createAction('socket: subscribe')
const unsubscribe = createAction('socket: unsubscribe')

/**
 * Exports
 */

export default middleware
export {
  subscribe,
  unsubscribe
}
