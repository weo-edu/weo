/**
 * Imports
 */

import AvatarUploadModal from 'modals/AvatarUploadModal'
import {CSSContainer, wrap} from 'vdux-containers'
import {Block, Text, Icon, Flex} from 'vdux-ui'
import {component, element} from 'vdux'

/**
 * AvatarBlock
 */

export default wrap(CSSContainer, {
  hoverProps: {
    hovered: true
  }
})(component({
  render ({props, actions}) {
    const {avatar, hovered, checked} = props
    let url = avatar

    if (avatar === 'upload') {
      return (
        <Flex
          onClick={actions.openUploadModal}
          outline='1px dashed #AAA'
          align='center center'
          outlineOffset='2px'
          bg='grey_light'
          color='#AAA'
          sq='100'
          pointer
          column
          m='10'>
          <Text pb='s' fs='s'>Upload</Text>
          <Icon name='add' />
        </Flex>
      )
    }

    return (
      <Block
        tabindex='-1'
        outline='3px solid transparent'
        outlineColor={hovered || checked ? 'blue' : 'transparent'}
        transition='outline-color .35s'
        outlineOffset='2px'
        relative
        sq='100'
        pointer
        m='10'
        backgroundSize='100%'
        bgImg={url}>
        <Icon
          transition='transform .35s'
          transform={checked ? 'scale(1)' : 'scale(0)'}
          name='check'
          align='center center'
          color='blue'
          bg='white'
          fs='19'
          circle='25'
          absolute
          right
          top
          m='s' />
      </Block>
    )
  },

  controller: {
    * openUploadModal ({props, context}) {
      yield context.openModal(() => <AvatarUploadModal user={props.user} />)
    }
  }
}))
