/**
 * Imports
 */

import {appReady, component, element, t} from 'vdux'
import Transition from 'vdux-transition'
import Router from 'components/Router'
import Loading from 'pages/Loading'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'
import live from 'lib/live'

/**
 * <App/>
 */

export default summon(() => ({
  currentUser: '/user'
}))(live(({currentUser}) => ({
  currentUser: {
    url: '/user',
    clear: true,
    params: {
      id: currentUser.value && currentUser.value._id
    }
  }
}))(component({
  onCreate ({props, context}) {
    if (!props.currentUser.loading) {
      return context.identify(props.currentUser.value)
    }
  },

  * onUpdate (prev, next) {
    const {props, actions, state, context} = next
    const {currentUser = {}} = props

    if (!state.ready && (!currentUser.loading || currentUser.error)) {
      yield actions.appDidInitialize()
      yield appReady({title: next.props.title})
    }

    if (prev.props.currentUser.loading && !next.props.currentUser.loading) {
      yield context.identify(next.props.currentUser.value)
    }
  },

  render ({props, state, context}) {
    const {toast, modal, currentUser} = props
    if (currentUser.loading && !currentUser.error) return <span />

    return (
      <Block>
        <Block>
          <Transition>{toast}</Transition>
          {modal && modal()}
        </Block>
        <Block z={0}>
          {
            state.ready
              ? <Router {...props} currentUser={currentUser.error ? null : currentUser.value} {...state} />
              : <Loading />
          }
        </Block>
      </Block>
    )
  },

  reducer: {
    appDidInitialize: () => ({ready: true})
  }
})))
