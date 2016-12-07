/**
 * Imports
 */
import {Button, Dropdown, MenuItem} from 'vdux-containers'
import ActivityLinkModal from 'modals/ActivityLinkModal'
import WeoIcon from 'components/WeoIcon'
import {component, element} from 'vdux'
import {Block, Icon} from 'vdux-ui'
import qs from 'qs'

/**
 * <ShareDropdown/>
 */

export default component({
  render ({props, actions}) {
    const {btn: Btn = DDButton, activity, ...rest} = props
    const data = {
      url: window.location.href,
      media: (activity.image && activity.image.url),
      title: activity.displayName,
      description: activity.description
    }

    return (
      <Dropdown w={120} z={2} btn={<Btn {...rest} />}>
        <ShareItem onClick={actions.shareFacebook(data)} weoIcon='facebook' />
        <ShareItem onClick={actions.shareTwitter(data)} weoIcon='twitter' />
        <ShareItem onClick={actions.sharePinterest(data)} weoIcon='pinterest' />
        <ShareItem icon='link' onClick={actions.openLinkModal} />
      </Dropdown>
    )
  },

  controller: {
    * openLinkModal ({context, props}) {
      yield context.openModal(() => <ActivityLinkModal activity={props.activity} />)
    },

    shareFacebook (data) {
      const url = 'https://www.facebook.com/dialog/feed?' + qs.stringify({
        app_id: 1662916197276541,
        display: 'popup',
        redirect_uri: 'http://www.weo.io/#closewindow',
        link: data.url,
        picture: data.media,
        name: data.title,
        description: data.description
      })
      window.open(url, 'facebook', 'width=550,height=300')
    },

    shareTwitter (data) {
      const url = 'http://twitter.com/share?' + qs.stringify({
        text: 'Check out this awesome lesson on Weo:',
        url: data.url,
        media: data.media,
        image: data.media,
        picture: data.media,
        count: 'none'
      })
      window.open(url, 'twitter', 'width=550,height=300')
    },

    sharePinterest (data) {
      const url = 'http://www.pinterest.com/pin/create/button?' + qs.stringify({
        url: data.url,
        media: data.media,
        description: data.description
      })
      window.open(url, 'pinterest', 'width=750,height=675')
    }
  }
})

/**
 * <DDButton/>
 */

function DDButton ({props}) {
  return (
    <Button icon='share' {...props} />
  )
}

/**
 * <ShareItem/>
 */

function ShareItem ({props}) {
  const {icon, weoIcon, ...rest} = props

  return (
    <MenuItem align='start center' {...rest}>
      { icon && <Icon fs='s' name={icon} mr='s' /> }
      { weoIcon && <WeoIcon fs='s' name={weoIcon} mr='s' /> }
      <Block capitalize>{icon || weoIcon}</Block>
    </MenuItem>
  )
}
