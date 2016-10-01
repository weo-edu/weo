/**
 * Imports
 */

import {Toast, Modal, ModalBody, ModalFooter, ModalHeader, Block, Text, Flex} from 'vdux-ui'
import ActivityTileModaled from 'components/ActivityTileModaled'
import {Button, Input, form} from 'vdux-containers'
import {toast, hideToast} from 'reducer/toast'
import {setUrl, back} from 'redux-effects-location'
import {closeModal} from 'reducer/modal'
import ClassSelect from './ClassSelect'
import Link from 'components/Link'
import element from 'vdux/element'
import summon from 'vdux-summon'

/**
 * <AssignModal/>
 */

function render ({props}) {
  const {activity, classes, fields, createClass, creatingClass = {}, assigning = {}, copyingActivity = {}} = props
  const {value, loaded} = classes
  const selected = fields.selected.value || []
  const loading = assigning.loading || copyingActivity.loading

  if (! loaded) return <span/>

  return (
    <Modal onDismiss={closeModal} w='620' bgColor='grey_light'>
      <Flex>
        <Block flex align='center center' py px='l'>
          <ActivityTileModaled activity={activity} intent='assign' />
        </Block>
        <Flex column bg='white' flex boxShadow='-1px 0 1px 0 rgba(0,0,0,0.1)' relative minHeight='400px'>
          <ModalHeader fs='s' h='56px' lh='56px' p='0' bg='off_white' borderBottom='1px solid grey_light'>
            Select Classes to Assign to:
          </ModalHeader>
          <ClassSelect loading={creatingClass.loading} classes={value.items} selected={selected} createClass={createClass} absolute h='calc(100% - 56px)' top={56} wide />
        </Flex>
      </Flex>
      <ModalFooter m='0'>
        <Text fs='xxs'>
          <Text pointer underline onClick={closeModal}>cancel</Text>
          <Text mx>or</Text>
        </Text>
        <Button type='submit' busy={loading}>Assign</Button>
      </ModalFooter>
    </Modal>
  )
}

/**
 * Exports
 */

export default summon(props => ({
  classes: '/user/classes',
  createClass: body => ({
    creatingClass: {
      url: '/group/',
      method: 'POST',
      invalidates: '/user/classes',
      body
    }
  }),
  assign: (classId, activityId, rest) => ({
    assigning: {
      url: `/share/${activityId}/assign/`,
      method: 'PUT',
      serialize: true,
      body: {
        to: [classId],
        ...rest
      }
    }
  }),
  copyActivity: activityId => ({
    copyingActivity: {
      url: `/share/${activityId}/copy`,
      method: 'POST'
    }
  })
}))(
  form(({activity, copyActivity, assign, onAssign, classes}) => ({
    fields: ['selected'],
    onSubmit: function *({selected, ...rest}) {
      const chosen = classes.value.items.filter(cls => selected.indexOf(cls._id) !== -1)

      yield chosen.map(function *({_id}, i) {
        if (activity.published || i > 0) {
          const copy = yield copyActivity(activity._id)
          yield assign(_id, copy._id, rest)
        } else {
          yield assign(_id, activity._id, rest)
        }
      })

      yield closeModal()

      if (onAssign) yield onAssign(chosen.map(({_id}) => _id))

      yield toast(
        <Toast key='a' onDismiss={hideToast}>
          {
            chosen.map(({_id, displayName}) => (
              <Block align='space-between center' my>
                <Block ellipsis>
                  Assigned to <Link onClick={hideToast} href={`/class/${_id}`} color='blue'>{displayName}</Link>
                </Block>
                <Button onClick={[() => setUrl(`/class/${_id}`), hideToast]} bgColor='green'>Go to Class</Button>
              </Block>
            ))
          }
        </Toast>
      )
    }
  }))({
    render
}))
