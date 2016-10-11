/**
 * Imports
 */

import NewMenuItem from 'components/NewMenuItem'
import {Checkbox} from 'vdux-containers'
import validate from 'lib/validate'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import map from '@f/map'

/**
 * ClassSelect
 */

function render ({props}) {
  const {classes, selected, loading, createClass, ...rest} = props

  return (
    <Block overflowY='auto' {...rest}>
      {
        map(cls => <ClassItem cls={cls} selected={selected.indexOf(cls._id) !== -1} />, classes)
      }
      <NewMenuItem key='newMenuItem' loading={loading} onSubmit={createClass} validate={validate.group} type='Class' />
    </Block>
  )
}

function ClassItem ({props}) {
  const {cls, selected} = props

  return (
    <Checkbox
      name='selected[]'
      value={cls._id}
      checked={selected}
      checkProps={{circle: 25, fs: 'xs', ml: 8, mr: 10}}
      hoverProps={{highlight: 0.03}}
      label={cls.displayName}
      bgColor='white'
      capitalize
      pointer
      p/>
  )
}

/**
 * Exports
 */

export default {
  render
}
