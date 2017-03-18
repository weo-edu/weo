/**
 * Imports
 */

import IntroSteps, {numSteps} from './IntroSteps'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import IntroForms from './IntroForms'
import {Block, Modal} from 'vdux-ui'

/**
 * Constants
 */

const btnProps = {
  bgColor: 'white',
  color: 'text',
  circle: '40px',
  align: 'center center',
  fs: 'm',
  p: 0,
  boxShadow: 'card'
}

/**
 * <IntroModal/>
 */

export default component({
  initialState: {
    cur: 0,
    counts: {}
  },

  render ({props, state, actions, context}) {
    const {currentUser, school} = props
    const {cur, counts} = state

    return (
      <Modal relative w='670' h='535' overlayProps={{bg: 'rgba(51,51,51,0.96)'}}>
        {
          (cur < numSteps) && <IntroSteps cur={cur} counts={counts} />
        }
        {
          (cur >= numSteps) && <IntroForms cur={cur} currentUser={currentUser} school={school} />
        }
        <Block hide={cur >= numSteps}>
          <Block absolute wide h={btnProps.circle} top bottom m='auto'>
            <Button
              icon='keyboard_arrow_left'
              onClick={actions.prev}
              {...btnProps}
              hide={cur <= 0}
              right='100%'
              absolute
              mr />

            <Button
              icon='keyboard_arrow_right'
              onClick={actions.next}
              {...btnProps}
              left='100%'
              absolute
              ml />
          </Block>
          <Block align='center center' wide absolute top='100%' mt='l'>
            { dots(cur, actions) }
          </Block>
        </Block>
      </Modal>
    )
  },

  reducer: {
    prev: state => {
      const cur = Math.max(state.cur - 1, 0)

      return {
        cur,
        counts: {
          ...state.counts,
          [cur]: (state.counts[cur] || 0) + 1
        }
      }
    },
    next: state => {
      const cur = Math.min(state.cur + 1, numSteps)

      return {
        cur,
        counts: {
          ...state.counts,
          [cur]: (state.counts[cur] || 0) + 1
        }
      }
    },
    go: (state, i) => {
      const cur = i

      return {
        cur,
        counts: {
          ...state.counts,
          [cur]: (state.counts[cur] || 0) + 1
        }
      }
    }
  }
})

/**
 * Helpers
 */

function dots (cur, actions) {
  const arr = Array.apply(null, Array(numSteps))

  return (
    arr.map((_, i) => <Block pointer circle='8' bgColor={cur === i ? 'white' : 'rgba(255,255,255,.5)'} mx='s' onClick={actions.go(i)} />)
  )
}
