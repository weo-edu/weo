/**
 * Imports
 */

import NewMenuItem from 'components/NewMenuItem'
import {Checkbox} from 'vdux-containers'
import {component, element} from 'vdux'
import validate from 'lib/validate'
import {Block} from 'vdux-ui'
import map from '@f/map'

/**
 * <ClassSelect/>
 */

export default component({
  render ({props}) {
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
})

/**
 * Constants
 */

const checkProps = {circle: 25, fs: 'xs', ml: 8, mr: 10}
const hoverProps = {highlight: 0.03}

/**
 * <ClassItem/>
 */

function ClassItem ({props}) {
  const {cls, selected} = props

  return (
    <Checkbox
      name='selected[]'
      value={cls._id}
      checked={selected}
      checkProps={checkProps}
      hoverProps={hoverProps}
      label={cls.displayName}
      bgColor='white'
      capitalize
      pointer
      p />
  )
}
