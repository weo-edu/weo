/**
 * Imports
 */

import {Button, CSSContainer, wrap} from 'vdux-containers'
import ClassSettingsModal from 'modals/ClassSettingsModal'
import {Icon, Block, Card, Text, MenuItem} from 'vdux-ui'
import {stopPropagation, component, element} from 'vdux'
import CreateClassModal from 'modals/CreateClassModal'
import JoinClassModal from 'modals/JoinClassModal'
import RoundedInput from 'components/RoundedInput'
import Link from 'components/Link'
import summon from 'vdux-summon'

/**
 * Constants
 */

const itemCurrentProps = {borderLeftColor: 'blue', highlight: 0.03, color: 'text'}
const itemActiveProps = {opacity: 0.7}
const itemHoverProps = {opacity: 1}
const allClasses = {_id: 'all', displayName: 'All Classes'}
const alignLeft = {textAlign: 'left'}

/**
 * <ClassesWidget/>
 */

export default summon(() => ({
  classes: '/user/classes'
}))(component({
  render ({props, context, state, actions}) {
    const {classes, user} = props
    const {value, loaded} = classes
    const clsLength = loaded && value.items.length
    const {userType, drafts = {}} = user
    const items = drafts.canonicalTotal || {}
    const offset = userType === 'teacher'
      ? items ? '318px' : '270px'
      : '150px'

    return (
      <Card {...props}>
        <Block p uppercase boxShadow='0 2px 1px rgba(grey,0.1)' z='1' relative align='space-between center'>
          <Block>Classes</Block>
          <RoundedInput type='search' onInput={actions.setFilter} placeholder='Filter…' py='s' px={10} m='-6px 0' bgColor='#FDFDFD' inputProps={alignLeft} w={120} hide={clsLength < 7} />
        </Block>
        <Block maxHeight={`calc(100vh - ${offset})`} overflow='auto' border='1px solid rgba(grey,0.05)' borderWidth='1px 0'>
          {[
            !state.filter && <Item cls={allClasses} />,
            loaded && value.items.filter(search(state.filter)).sort(cmp).map(item => <Item cls={item} hasSettings={userType === 'teacher'} />),
            user.userType === 'student'
              ? <AddClassItem Modal={JoinClassModal} text='Join Class' />
              : <AddClassItem Modal={CreateClassModal} text='New Class' />
          ]}
        </Block>
        <Block boxShadow='0 -2px 1px rgba(grey,0.1)' z='1' relative p />
      </Card>
    )
  },

  reducer: {
    setFilter: (state, filter) => ({filter})
  }
}))

/**
 * <Item/>
 */

const Item = wrap(CSSContainer, {
  hoverProps: {showIcon: true}
})(component({
  render ({props, actions}) {
    const {cls, hasSettings, showIcon} = props
    const {_id, displayName} = cls

    return (
      <Link
        currentProps={itemCurrentProps}
        borderLeft='3px solid transparent'
        href={`/class/${_id}`}
        align='start center'
        ui={MenuItem}
        color='grey_medium'
        hoverProps={{color: 'text'}}
        p>
        <Block circle='25px' lh='25px' mr textAlign='center' bg='green' color='white' uppercase>{displayName[0]}</Block>
        <Text capitalize flex bolder>{displayName}</Text>
        <Block onClick={stopPropagation} align='end center'>
          <Button
            onClick={actions.classSettings}
            activeProps={itemActiveProps}
            hoverProps={itemHoverProps}
            hide={!(hasSettings && showIcon)}
            icon='settings'
            opacity={0.7}
            color='text'
            fs='xs' />
        </Block>
      </Link>
    )
  },

  controller: {
    * classSettings ({context, props}) {
      yield context.openModal(() => <ClassSettingsModal group={props.cls} />)
    }
  }
}))

/**
 * <AddClassItem/>
 */

const AddClassItem = component({
  render ({props, actions}) {
    const {text} = props

    return (
      <Link ui={MenuItem} hoverProps={{color: 'text'}} onClick={actions.openModal} py='m' color='grey_medium' bolder display='flex' align='start center'>
        <Icon name='add' fs='s' mr='m' sq='25' textAlign='center' bolder />
        {text}
      </Link>
    )
  },

  controller: {
    * openModal ({props, context}) {
      const {Modal} = props
      yield context.openModal(() => <Modal />)
    }
  }
})

/**
 * Helpers
 */

function cmp (a, b) {
  return a.displayName.toUpperCase() > b.displayName.toUpperCase()
    ? 1
    : -1
}

function search (text = '') {
  text = text.toUpperCase()
  return cls => !text
    ? true
    : cls.displayName.toUpperCase().indexOf(text) !== -1
}
