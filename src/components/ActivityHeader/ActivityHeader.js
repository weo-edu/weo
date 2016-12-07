/**
 * Imports
 */

import ActivitySettingsModal from 'modals/ActivitySettingsModal'
import {Block as ContainerBlock, Button} from 'vdux-containers'
import CommoncoreBadge from 'components/CommoncoreBadge'
import SubjectSelector from './SubjectSelector'
import LineInput from 'components/LineInput'
import GradeSelector from './GradeSelector'
import {t, component, element} from 'vdux'
import {Block, Text, Icon} from 'vdux-ui'
import findIndex from '@f/find-index'
import map from '@f/map'

/**
 * <ActivityHeader/>
 */

export default component({
  propTypes: {
    editing: t.maybe(t.Boolean),
    open: t.maybe(t.Function),
    editable: t.maybe(t.Boolean),
    activity: t.Object,
    clickableTags: t.maybe(t.Boolean)
  },

  render ({props}) {
    const {editing, open, editable, activity, clickableTags} = props
    const {displayName, originalDescription, tags, commonCore} = activity
    const editableProps = editable
      ? {hoverProps: {bgColor: 'off_white'}, onClick: open}
      : {}

    if (editing) return <EditingHeader {...props} />

    return (
      <ContainerBlock p='12px 24px' {...editableProps}>
        <Block fs='xl' fw='800'>{displayName}</Block>
        <Block mt='s' lighter>{originalDescription}</Block>
        <Block align='start center' mt='xs'>
          {
            map(({displayName}) => <Label text={displayName} clickable={clickableTags} />, tags)
          }
          <CommoncoreBadge hide={!commonCore} placement='right' />
        </Block>
      </ContainerBlock>
    )
  }
})

/**
 * <EditingHeader/>
 */

const EditingHeader = component({
  name: 'EditingHeader',

  propTypes: {
    activity: t.Object,
    open: t.maybe(t.Function),
    onEdit: t.Function
  },

  render: function ({props, actions}) {
    const {activity, open} = props
    const {displayName, originalDescription, tags} = activity

    return (
      <Block bgColor='white' z={2} relative p={24} pt={18} boxShadow='0 0 12px rgba(black, .5)' fs='s' lighter>
        <Block align='start center'>
          <Text textAlign='right' minWidth={100} mr='l'>Title:</Text>
          <LineInput
            fs='s'
            lighter
            autofocus
            onFocus={{selectTarget: true}}
            onInput={actions.editDisplayName}
            defaultValue={displayName} />
        </Block>
        <Block align='start center' mt='s'>
          <Text textAlign='right' minWidth={100} mr='l'>Description:</Text>
          <LineInput
            fs='s'
            lighter
            onInput={actions.editOriginalDescription}
            defaultValue={originalDescription} />
        </Block>
        <Block align='start center' mt={18} relative z={1}>
          <Text textAlign='right' minWidth={100} mr='l'>Label:</Text>
          <Block align='start' flex>
            <Block flex='45%' mr>
              <GradeSelector selected={tags} toggle={actions.toggleTag} max={3} />
            </Block>
            <Block flex='45%' mr>
              <SubjectSelector selected={tags} toggle={actions.toggleTag} max={3} />
            </Block>
          </Block>
        </Block>
        <Block bgColor='off_white' border='1px solid grey_light' borderWidth='1px 0' p m={-24} mt='l' align='end'>
          <Button bgColor='grey' px mr='s' onClick={actions.openActivitySettings}>
            <Icon color='white' fs='s' name='settings' />
          </Button>
          <Btn onClick={open}>Done</Btn>
        </Block>
      </Block>
    )
  },

  controller: {
    * editDisplayName ({props}, value) {
      yield props.onEdit({displayName: value.trim() || 'Untitled Activity'})
    },

    * editOriginalDescription ({props}, value) {
      yield props.onEdit({originalDescription: value})
    },

    * toggleTag ({props}, tag) {
      const {onEdit, activity} = props
      const {tags} = activity

      const newArr = tags.slice()
      const i = findIndex(tags, t => tag.displayName === t.displayName)

      if (i === -1) {
        newArr.push(tag)
      } else {
        newArr.splice(i, 1)
      }

      yield onEdit({tags: newArr})
    },

    * openActivitySettings ({props, context}) {
      const {activity, onEdit} = props
      yield context.openModal(() => <ActivitySettingsModal activity={activity} onEdit={onEdit} />)
    }
  }
})

function Btn ({props, children}) {
  return (
    <Button
      hoverProps={{highlight: 0.025}}
      focusProps={{highlight: 0.025}}
      border='1px solid grey_medium'
      bgColor='off_white'
      color='text'
      px
      {...props}>
      {children}
    </Button>
  )
}

/**
 * <Label/>
 */

function Label ({props, context}) {
  const {text, clickable} = props
  const clickableProps = clickable
    ? {
        onClick: context.setUrl(`/search/activities/${text}`),
        pointer: true,
        hoverProps: {
          bgColor: 'transparent',
          color: 'blue'
        }
      }
    : {}

  return (
    <ContainerBlock
      border='1px solid blue'
      color='white'
      capitalize
      lh='22px'
      bg='blue'
      fs='xxs'
      mr='xs'
      pill
      px
      {...clickableProps}>
      {text}
    </ContainerBlock>
  )
}
