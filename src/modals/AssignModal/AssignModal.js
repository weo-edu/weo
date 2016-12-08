/**
 * Imports
 */

import {Toast, Modal, ModalFooter, ModalHeader, Block, Text, Flex} from 'vdux-ui'
import ActivityTileModaled from 'components/ActivityTileModaled'
import {Button, form} from 'vdux-containers'
import ClassSelect from './ClassSelect'
import {component, element} from 'vdux'
import Link from 'components/Link'
import summon from 'vdux-summon'

/**
 * <AssignModal/>
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
  form(({activity, copyActivity, assign, onAssign, classes}, context) => ({
    fields: ['selected'],
    * onSubmit ({selected = [], ...rest}) {
      const chosen = classes.value.items.filter(cls => selected.indexOf(cls._id) !== -1)

      yield chosen.map(function *({_id}, i) {
        if (activity.published || i > 0) {
          const copy = yield copyActivity(activity._id)
          yield assign(_id, copy._id, rest)
        } else {
          yield assign(_id, activity._id, rest)
        }
      })

      yield context.closeModal()

      if (onAssign) yield onAssign(chosen.map(({_id}) => _id))

      yield context.toast(
        <Toast key='a' onDismiss={context.hideToast}>
          {
            chosen.map(({_id, displayName}) => (
              <Block align='space-between center' my>
                <Block ellipsis>
                  Assigned to <Link onClick={context.hideToast} href={`/class/${_id}`} color='blue'>{displayName}</Link>
                </Block>
                <Button onClick={[context.setUrl(`/class/${_id}`), context.hideToast]} bgColor='green'>Go to Class</Button>
              </Block>
            ))
          }
        </Toast>
      )
    }
  }))(component({
    render ({props, context}) {
      const {activity, classes, fields, createClass, creatingClass = {}, assigning = {}, copyingActivity = {}} = props
      const {value, loaded} = classes
      const selected = fields.selected.value || []
      const loading = assigning.loading || copyingActivity.loading

      if (!loaded) return <span />

      return (
        <Modal onDismiss={context.closeModal} w='620' bgColor='grey_light'>
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
              <Text pointer underline onClick={context.closeModal}>cancel</Text>
              <Text mx>or</Text>
            </Text>
            <Button type='submit' busy={loading}>Assign</Button>
          </ModalFooter>
        </Modal>
      )
    }
  })))
