/**
 * Imports
 */

import ObjectControls from 'components/ObjectControls'
import ActivityMedia from 'components/ActivityMedia'
import {t, component, element} from 'vdux'
import MediaModal from 'modals/MediaModal'
import Resizer from 'components/Resizer'
import {Button} from 'vdux-containers'
import Figure from 'components/Figure'
import {Block} from 'vdux-ui'

/**
 * <EditingMedia/>
 */

export default component({
  propTypes: {
    onEdit: t.Function,
    object: t.Object
  },

  render ({props, actions}) {
    const {object} = props

    return (
      <Block>
        {
          object.objectType === 'image'
            ? <ImageEdit {...props} {...actions} />
            : <ActivityMedia {...props} editing={false} preview />
        }
        <ObjectControls {...props} >
          <Button
            onClick={actions.openMediaModal}
            uppercase
            bgColor='grey'
            mr='l'
            px>
            Change {object.objectType === 'rich' ? 'Media' : object.objectType}
          </Button>
          {
              object.objectType === 'image' &&
              <Block align='start center'>
                <AlignIcon {...props} {...actions} justify='left' />
                <AlignIcon {...props} {...actions} justify='center' mx />
                <AlignIcon {...props} {...actions} justify='right' />
              </Block>
            }
        </ObjectControls>
      </Block>
    )
  },

  controller: {
    * updateObject ({props}, newObj) {
      yield props.onEdit({...props.object, ...newObj})
    },

    * updateZoom ({actions}, zoom) {
      yield actions.updateObject({zoom})
    },

    * openMediaModal ({props, context, actions}) {
      const {object} = props
      yield context.openModal(() => <MediaModal onAccept={actions.updateObject} type={object.objectType} />)
    }
  }
})

/**
 * Constants
 */

const hoverProps = {color: 'text'}

/**
 * <AlignIcon/>
 */

function AlignIcon ({props}) {
  const {justify, object, updateObject, ...rest} = props
  const selected = justify === (object.justify || 'center')

  return (
    <Button
      onClick={updateObject({justify})}
      color={selected ? 'text' : 'grey_medium'}
      icon={`format_align_${justify}`}
      hoverProps={hoverProps}
      fs={24}
      {...rest} />
  )
}

/**
 * <ImageEdit/>
 */

function ImageEdit ({props}) {
  const {object, updateZoom, ...rest} = props
  const {image = {}, justify = 'center'} = object

  return (
    <Block textAlign={justify} {...rest}>
      <Resizer onEnd={updateZoom} object={object}>
        <Figure {...image} wide display='block' m={0} />
      </Resizer>
    </Block>
  )
}
