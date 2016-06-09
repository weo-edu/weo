/**
 * Imports
 */

import {Modal, ModalBody, ModalFooter, ModalHeader, Block, Text, Flex} from 'vdux-ui'
import ActivityTileModaled from 'components/ActivityTileModaled'
import {Button, Input, form} from 'vdux-containers'
import {closeModal} from 'reducer/modal'
import ClassSelect from './ClassSelect'
import element from 'vdux/element'
import summon from 'vdux-summon'

/**
 * <AssignModal/>
 */

function render ({props}) {
  const {activity, classes, fields, createClass} = props
  const {value, loaded} = classes
  const selected = fields.selected.value || []

  if (! loaded) return <span/>

  return (
    <Modal onDismiss={closeModal} w='620' bgColor='grey_light'>
      <Flex>
        <Block flex align='center center' py px='l'>
          <ActivityTileModaled activity={activity} />
        </Block>
        <Flex column bg='white' flex boxShadow='-1px 0 1px 0 rgba(0,0,0,0.1)' relative minHeight='400px'>
          <ModalHeader fs='s' h='56px' lh='56px' p='0' bg='off_white' borderBottom='1px solid grey_light'>
            Select Classes to Assign to:
          </ModalHeader>
          <ClassSelect classes={value.items} selected={selected} createClass={createClass} absolute h='calc(100% - 56px)' wide />
        </Flex>
      </Flex>
      <ModalFooter m='0'>
        <Text fs='xxs'>
          <Text pointer underline onClick={closeModal}>cancel</Text>
          <Text mx>or</Text>
        </Text>
        <Button type='submit'>Assign</Button>
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
    newClass: {
      url: '/group/',
      method: 'POST',
      invalidates: ['/user/classes', '/user'],
      body
    }
  }),
  assign: (classId, activityId) => ({
    assigning: {
      url: `/share/${activityId}/assign/`,
      method: 'PUT',
      body: {
        to: [classId]
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
  form(({activity, copyActivity, assign}) => ({
    fields: ['selected'],
    onSubmit: function *({selected}) {
      yield selected.map(function *(classId) {
        if (activity.published) {
          const copy = yield copyActivity(activity._id)
          yield assign(classId, copy._id)
        } else {
          yield assign(classId, activity._id)
        }
      })

      yield closeModal()
    }
  }))({
    render
}))