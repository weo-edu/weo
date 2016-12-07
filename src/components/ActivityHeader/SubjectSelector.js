/**
 * Imports
 */

import {Button, Dropdown, MenuItem, Checkbox, Tooltip} from 'vdux-containers'
import {t, stopPropagation, component, element} from 'vdux'
import subjects from '@weo-edu/subjects'
import mapValues from '@f/map-values'
import {Block, Icon} from 'vdux-ui'

/**
 * <SubjectSelector/>
 */

export default component({
  propTypes: {
    selected: t.Array,
    toggle: t.Function,
    max: t.maybe(t.Integer)
  },

  render ({props, state, actions}) {
    const current = state.category
    const {selected} = props
    const {error} = state
    const sbjList = []
    const counts = {}

    const selectedList = mapValues(t => { return t.displayName }, selected)

    mapValues((cat, key) =>
      cat.forEach(({displayName}) => {
        if (selectedList.indexOf(displayName) !== -1) {
          sbjList.push(displayName)
          counts[key] = counts[key] ? ++counts[key] : 1
        }
      }), subjects)

    const text = sbjList.length ? sbjList.join(', ') : 'Subject Selector'
    const btnStyle = sbjList.length ? {'bold': true, color: 'blue'} : {}

    return (
      <Dropdown w={505} left btn={<DDBtn {...btnStyle} text={text} />} onClick={stopPropagation} onClose={actions.setError(null)}>
        <Block align='start' my={-6}>
          <Block flex='35%' borderRight='1px solid grey_light' py={6}>
            {
              Object
                .keys(subjects)
                .map(category => (
                  <Category
                    onClick={actions.setCategory(category)}
                    category={category}
                    current={current}
                    count={counts[category]} />
                ))
            }
          </Block>
          <Block flex py={6}>
            {
              current
                ? subjects[current].map(subject => <Item tag={subject} selected={sbjList} toggle={actions.toggleSubject(sbjList)} error={error === subject.displayName} />)
                : <Block p='8px 16px' fs='xs' color='grey_medium'>
                    Select a Subject Area
                </Block>

            }
          </Block>
        </Block>
      </Dropdown>
    )
  },

  controller: {
    * toggleSubject ({props, actions}, sbjList, subject) {
      const {toggle, max = Infinity} = props

      if (sbjList.indexOf(subject.displayName) === -1 && sbjList.length + 1 > max) {
        yield actions.setError(subject.displayName)
      } else {
        yield actions.setError(null)
        yield toggle(subject)
      }
    }
  },

  reducer: {
    setError: (state, error) => ({error}),
    setCategory: (state, category) => ({category})
  }
})

/**
 * Constants
 */

const highlight = {highlight: 0.02}

/**
 * <DDBtn/>
 */

function DDBtn ({props}) {
  const {text, ...rest} = props

  return (
    <Button
      hoverProps={highlight}
      focusProps={highlight}
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
      <Icon fs='s' name='keyboard_arrow_down' color='text' />
    </Button>
  )
}

/**
 * <Category/>
 */

function Category ({props}) {
  const {current, category, count, ...rest} = props
  const curProps = current === category
    ? {bgColor: 'blue', color: 'white'}
    : {}

  return (
    <MenuItem bold fs='xs' p='3px 6px 3px 12px' align='start center' capitalize {...rest} {...curProps}>
      <Block flex>
        {category}
        <Block tag='span' hide={!count} ml='s' italic fs='xxs'>
          ({count})
        </Block>
      </Block>
      <Icon name='keyboard_arrow_right' fs='s' />
    </MenuItem>
  )
}

/**
 * <Item/>
 */

function Item ({props}) {
  const {tag, selected, toggle, error} = props
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
      <Tooltip tooltipProps={{color: 'white', show: error, bgColor: 'red'}} placement='right' message='3 subjects max' />
    </MenuItem>
  )
}
