/**
 * Imports
 */

import {Button, Dropdown, MenuItem, Checkbox, Tooltip} from 'vdux-containers'
import {t, stopPropagation, component, element} from 'vdux'
import mapValues from '@f/map-values'
import grades from '@weo-edu/grades'
import {Block, Icon} from 'vdux-ui'

/**
 * <GradeSelector/>
 */

export default component({
  propTypes: {
    selected: t.Array,
    max: t.maybe(t.Integer)
  },

  render ({props, actions, state}) {
    const {selected, max = Infinity} = props
    const {error} = state

    const selectedList = mapValues(t => t.displayName, selected)
    const gradeList = grades.reduce((arr, {displayName}) =>
      selectedList.indexOf(displayName) !== -1
        ? arr.concat(displayName)
        : arr.concat([])
    , [])

    const text = gradeList.length ? gradeList.join(', ') : 'Grade Selector'
    const btnStyle = gradeList.length ? {'bold': true, color: 'blue'} : {}

    return (
      <Dropdown onClick={stopPropagation} wide btn={<DDBtn {...btnStyle} text={text} />} onClose={actions.setError(null)}>
        {
          grades.map(grade => <Item tag={grade} selected={gradeList} toggle={actions.toggleGrade(gradeList)} error={error === grade.displayName} max={max} />)
        }
      </Dropdown>
    )
  },

  controller: {
    * toggleGrade ({props, actions}, gradeList, grade) {
      const {toggle, max = Infinity} = props

      if (gradeList.indexOf(grade.displayName) === -1 && gradeList.length + 1 > max) {
        yield actions.setError(grade.displayName)
      } else {
        yield actions.setError(null)
        yield toggle(grade)
      }
    }
  },

  reducer: {
    setError: (state, error) => ({error})
  }
})

/**
 * <DDBtn/>
 */

function DDBtn ({props}) {
  const {text, ...rest} = props

  return (
    <Button
      hoverProps={{highlight: 0.02}}
      focusProps={{highlight: 0.02}}
      bgColor='off_white'
      textAlign='left'
      color='text'
      capitalize
      lh='2.8em'
      ellipsis
      fs='xxs'
      wide
      px
      {...rest}>
      <Block flex ellipsis>{text}</Block>
      <Icon fs='s' name='keyboard_arrow_down' />
    </Button>
  )
}

/**
 * <Item/>
 */

function Item ({props}) {
  const {tag, selected, toggle, error, max} = props
  const {displayName} = tag
  const checked = selected.indexOf(displayName) !== -1
  const errorProps = error
    ? {bgColor: 'rgba(red_light, .5)', hoverProps: {}}
    : {}

  return (
    <MenuItem
      onClick={toggle(tag)}
      align='start center'
      {...errorProps}
      p='5px 8px'
      tag='label'
      capitalize
      fs='xs'>
      <Checkbox mr='s' checkProps={{sq: 15}} checked={checked} />
      <Block flex>
        {displayName}
      </Block>
      <Tooltip tooltipProps={{color: 'white', show: error, bgColor: 'red'}} placement='right' message={`You may only select up to ${max} grades.`} />
    </MenuItem>
  )
}
