/**
 * Imports
 */

import ClassActivityBadge from 'components/ClassActivityBadge'
import {Button, Dropdown, MenuItem, Tooltip} from 'vdux-containers'
import ActivityLinkModal from 'modals/ActivityLinkModal'
import {Block, Flex, Icon} from 'vdux-ui'
import RedoModal from 'modals/RedoModal'
import {component, element} from 'vdux'

/**
 * Constants
 */

const iconProps = {
  bgColor: 'white',
  activeProps: {bgColor: 'rgba(black, .1)'},
  color: 'text',
  circle: '32',
  fs: 'm'
}

/**
 * <ActivityProgressActions/>
 */

export default component({
  render ({props, actions}) {
    const {activity, settingStatus = {}, selected} = props
    const {loading} = settingStatus
    const disabled = loading || !selected.length

    return (
      <Flex align='space-between center' mb>
        <Block align='start center'>
          <Tooltip message={disabled && 'Select Students To Enable'}>
            <Button busy={loading} disabled={disabled} text='Return' h={32} onClick={actions.doAction('returned')} />
          </Tooltip>
          <Block mx>
            <Dropdown disabled={disabled} btn={<Button disabled={disabled} icon='more_vert' {...iconProps} />} left w={120}>
              <MenuItem align='start center' onClick={actions.doAction('redo')}>
                <Icon name='redo' mr fs='xs' />
                Redo
              </MenuItem>
              <MenuItem align='start center' onClick={actions.doAction('turned_in')}>
                <Icon name='file_download' mr fs='xs' />
                Collect
              </MenuItem>
            </Dropdown>
          </Block>
          <Button icon='link' onClick={actions.openActivityLink} {...iconProps} />
        </Block>
        <Block align='end center'>
          <ClassActivityBadge mt='0' w='175' activity={activity} />
        </Block>
      </Flex>
    )
  },

  controller: {
    * openActivityLink ({props, context}) {
      yield context.openModal(() => <ActivityLinkModal activity={props.activity} />)
    },

    * doAction ({props, context}, status) {
      if (status === 'redo') yield context.openModal(() => <RedoModal instanceIds={props.selected} />)
      else yield props.selected.map(id => props.setStatus(id, status))
    }
  }
})
