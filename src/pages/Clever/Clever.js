/**
 * Imports
 */

import Loading from 'components/Loading'
import {component, element} from 'vdux'
import summon from 'vdux-summon'
import {Block} from 'vdux-ui'
import qs from 'querystring'

/**
 * <Clever/>
 */

export default summon(() => ({
  login: (provider, body) => ({
    loggingIn: {
      url: '/auth/login/' + provider,
      method: 'PUT',
      body
    }
  })
}))(component({
  * onCreate ({context, props}) {
    const {url, login} = props
    const [, str] = context.currentUrl.split('?')
    const params = qs.parse(str)

    // XXX Slight hack to avoid doing this on the server
    if (typeof window !== 'undefined') {
      params.redirectUri = window.location.origin + '/clever'

      const user = yield login('clever', params)
      yield context.postLogin(user)
    }
  },

  render ({props}) {
    return (
      <Block wide tall align='center center'>
        <Loading />
      </Block>
    )
  }
}))
