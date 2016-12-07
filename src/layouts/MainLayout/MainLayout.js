/**
 * Imports
 */

import FeedWidgets from 'components/FeedWidgets'
import IntroModal from 'modals/IntroModal'
import AppLayout from 'layouts/AppLayout'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <MainLayout/>
 */

export default component({
  * onCreate ({props, context}) {
    const {currentUser} = props
    const {preferences = {}, userType} = currentUser
    const {slideshow = {}} = preferences

    if (!slideshow.done && userType === 'teacher') {
      yield context.openModal(() => <IntroModal currentUser={currentUser} />)
    }
  },

  render ({props, children}) {
    return (
      <AppLayout {...props}>
        <Block align='start' w='col_main' mx='auto' py>
          <FeedWidgets user={props.currentUser} fixed />
          <Block minWidth={230} mr />
          <Block flex>
            { children }
          </Block>
        </Block>
      </AppLayout>
    )
  }
})
