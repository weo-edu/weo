/**
 * Imports
 */

import {Modal, ModalHeader, Icon, Block, Checkbox} from 'vdux-ui'
import {Button, Image} from 'vdux-containers'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import resize from 'lib/resize-image'
import getProp from '@f/get-prop'
import summon from 'vdux-summon'
import map from '@f/map'

/**
 * Constants
 */

const {TEMPLATE_BOARD_ID} = process.env
const w = 110
const h = w * 1.25

/**
 * <CreateActivityModal/>
 */

export default summon(props => ({
  templates: `/share?channel=group!${TEMPLATE_BOARD_ID}.board`,
  createBlank: () => ({
    creatingBlank: {
      url: '/share/new',
      method: 'POST'
    }
  }),
  copyTemplate: id => ({
    copyingTemplate: {
      url: `/share/template/${id}`,
      method: 'POST'
    }
  }),
  noTemplates: () => ({
    savingPreference: {
      url: '/preference/messages.templates',
      method: 'PUT',
      body: {
        value: true
      }
    }
  })
}))(component({
  * onCreate ({props, context}) {
    const {currentUser, createBlank} = props
    const hideTemplates = getProp('preferences.messages.templates', currentUser)

    if (hideTemplates) {
      const activity = yield createBlank()
      yield context.closeModal()
      yield context.setUrl(`/activity/${activity._id}/edit/new`)
    }
  },

  render ({props, state, actions, context}) {
    const {templates, currentUser} = props
    const {value, loaded} = templates

    // If this modal is supposed to not be shown, just render
    // a span until we get redirected away from it
    if (getProp('preferences.messages.templates', currentUser)) {
      return <span />
    }

    return (
      <Modal onDismiss={context.closeModal} textAlign='center' w='610'>
        <ModalHeader color='text'>
          Create Activities for your Class
        </ModalHeader>
        <Button onClick={actions.createBlank} my pill bgColor='green' boxShadow='z2' py fs='s' fw='200'>
          Create a New Activity
          <Icon name='keyboard_arrow_right' ml='s' />
        </Button>
        <Block my='l' fs='s' fontStyle='italic' fw='200'>
          or try editing some samples first
        </Block>
        <Block align='center center' pb='s'>
          {
            loaded
              ? map(activity => <TemplateItem activity={activity} copy={actions.copyTemplate(activity._id)} />, value.items)
              : <Block m>
                <Loading show border='1px solid grey_medium' h={h} w={w} />
                <Block py='xs' color='grey_medium' textAlign='left'>
                    Loading ...
                </Block>
              </Block>

          }
        </Block>
        <Block p align='end' fs='xxs'>
          <Checkbox
            checked={state.hideTemplates}
            onChange={actions.setHideTemplates}
            label={'Don\'t show me this again'}
            uiProps={{flexDirection: 'row-reverse'}}
            pointer />
        </Block>
      </Modal>
    )
  },

  controller: {
    * createBlank ({props, state, context}) {
      const {noTemplates, createBlank} = props

      if (state.hideTemplates) yield noTemplates()
      const activity = yield createBlank()
      yield context.closeModal()
      yield context.setUrl(`/activity/${activity._id}/edit/new`)
    },

    * copyTemplate ({props, state, context}, id) {
      const {copyTemplate, noTemplates} = props
      if (state.hideTemplates) yield noTemplates()

      const activity = yield copyTemplate(id)
      yield context.closeModal()
      yield context.setUrl(`/activity/${activity._id}/edit/new`)
    }
  },

  reducer: {
    setHideTemplates: (state, hideTemplates) => ({hideTemplates})
  }
}))

/**
 * <TemplateItem/>
 */

function TemplateItem ({props}) {
  const {activity, copy} = props
  const {displayName, image} = activity

  return (
    <Block
      onClick={copy}
      hide={displayName === 'Announcement'}
      m>
      <Image hoverProps={{borderColor: 'blue_light', boxShadow: '0 0 1px 1px rgba(blue, .3)'}}
        display='block'
        border='1px solid grey_medium'
        src={resize(image.url, 350)}
        pointer
        h={h}
        w={w} />
      <Block py='xs' color='grey_medium' textAlign='left'>
        {displayName}
      </Block>
    </Block>
  )
}
