/**
 * Imports
 */

import socket, {subscribe, unsubscribe} from 'middleware/socket'
import {component, element} from 'vdux'
import deepEqual from '@f/deep-equal'
import setProp from '@f/set-prop'
import map from '@f/map'
import has from '@f/has'

/**
 * Live HOC
 */

export default fn => Component => component({
  initialState: ({props}) => map((val, key) => ({
    value: undefined
  }), fn(props)),

  * onCreate ({props, path, actions}) {
    const descriptors = fn(props)

    for (const key in descriptors) {
      if (!descriptors[key]) continue

      yield subscribe({
        ...normalize(descriptors[key]),
        path,
        cb: msg => actions.update(key, msg)
      })
    }
  },

  middleware: typeof window !== 'undefined' && [
    socket
  ],

  render ({props, state, children}) {
    const newProps = map(
      (val, key) => has(key, state)
        ? {...val, value: val.value && state[key].value ? state[key].value : val.value}
        : val,
        props
    )

    return (
      <Component {...newProps}>{children}</Component>
    )
  },

  * onUpdate (prev, next) {
    const pdescs = fn(prev.props)
    const ndescs = fn(next.props)

    for (const key in ndescs) {
      const pdesc = normalize(pdescs[key])
      const ndesc = normalize(ndescs[key])
      if (!ndesc) continue

      if (prev.props[key] && next.props[key] && prev.props[key].value !== next.props[key].value) {
        yield next.actions.change(key, next.props[key].value)
      }

      if (!pdesc || pdesc.url !== ndesc.url || !deepEqual(pdesc.params, ndesc.params)) {
        if (pdesc) {
          yield unsubscribe({...pdesc, path: prev.path})
        }

        yield subscribe({
          ...ndesc,
          path: next.path,
          cb: msg => next.actions.update(key, msg)
        })
      }
    }
  },

  reducer: {
    change: (state, key, value) => ({
      [key]: {
        ...state[key],
        value
      }
    }),
    update: (state, key, msg) => state[key] && ({
      [key]: {
        ...state[key],
        value: applyUpdate(state[key].value, msg)
      }
    })
  },

  * onRemove ({props, path}) {
    const descriptors = fn(props)

    for (const key in descriptors) {
      yield unsubscribe({
        ...normalize(descriptors[key]),
        path
      })
    }
  }
})

/**
 * Helpers
 */

function normalize (descriptor) {
  return typeof descriptor === 'string'
    ? {url: descriptor}
    : descriptor
}

function applyUpdate (prev, {data, verb, params}) {
  switch (verb) {
    case 'change': {
      if (!prev || prev._id) return data

      return {
        ...prev,
        items: prev.items.map(item => item._id === data._id ? data : item)
      }
    }
    case 'diff': {
      if (!prev) throw new Error('Received diff for non-existent item', data, verb, params)
      if (prev._id) return runDiff(prev, data)

      return {
        ...prev,
        items: prev.items.map(item => item._id === params.id ? runDiff(item, data) : item)
      }
    }
    case 'add': {
      if (!prev || prev._id) {
        console.log('prev', prev)
        throw new Error('Cannot add to scalar value')
      }

      // If it's already there, don't do anything
      if (prev.items.some(item => item._id === data._id)) {
        return prev
      }

      return {
        ...prev,
        items: [data, ...prev.items]
      }
    }
    case 'remove': {
      if (!prev || prev._id) throw new Error('Cannot remove from scalar value')

      return {
        ...prev,
        items: prev.items.filter(item => item._id !== data._id)
      }
    }
    default: {
      throw new Error('live: Unrecognized subscription verb (' + verb + ')')
    }
  }
}

function runDiff (prev, diff) {
  return Object
    .keys(diff)
    .reduce((obj, key) => setProp(key, obj, diff[key]), prev)
}
