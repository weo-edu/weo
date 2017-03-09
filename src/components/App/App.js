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
  currentUser: '/user',
  school: '/school'
}))(live(({currentUser, school}) => ({
  currentUser: {
    url: '/user',
    params: {
      id: currentUser.value && currentUser.value._id
    }
  },
  school: {
    url: '/school',
    params: {
      id: school.value && school.value._id
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
    const {currentUser = {}, school = {}} = props
    const nprops = next.props
    const pprops = prev.props

    if (!state.ready && (!currentUser.loading || currentUser.error) && (!school.loading || school.error)) {
      yield actions.appDidInitialize()
      yield appReady({title: next.props.title})
    }

    if (prev.props.currentUser.loading && !next.props.currentUser.loading) {
      yield context.identify(next.props.currentUser.value)
    }

    if (!nprops.school.loading && pprops.currentUser.value && nprops.currentUser.value && pprops.currentUser.value.school !== nprops.currentUser.value.school) {
      yield next.props.summonInvalidate('/school')
    }
  },

  render ({props, state, context}) {
    const {toast, modal, currentUser, school} = props

    if (currentUser.loading && !currentUser.error) return <span />
    if (!school.loaded && !school.error) return <span />

    return (
      <Block>
        <Block>
          <Transition>{toast}</Transition>
          {modal && modal()}
        </Block>
        <Block z={0}>
          {
            state.ready
              ? <Router {...props} currentUser={currentUser.error ? {} : (currentUser.value || {})} school={school.value} {...state} />
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
