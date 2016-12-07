/**
 * Imports
 */

import ActivityDropdownMenu from 'components/ActivityDropdownMenu'
import ActivityCardActions from 'components/ActivityCardActions'
import {t, stopPropagation, component, element} from 'vdux'
import {wrap, CSSContainer} from 'vdux-containers'
import {Flex, Block, Card} from 'vdux-ui'
import BgImg from 'components/BgImg'
import Meta from './Meta'

/**
 * <ActivityRow/>
 */

export default wrap(CSSContainer, {
  hoverProps: {hover: true}
})(component({
  propTypes: {
    activity: t.Object,
    currentUser: t.Object,
    options: t.maybe(t.Object),
    showClass: t.maybe(t.Boolean)
  },

  render ({props, context}) {
    const {
      hover, activity, metaUi: MetaUi = Meta, ddMenu,
      badgeUi: BadgeUi = Badge, currentUser, options, showClass
    } = props
    const {image, displayName, description, _id: id} = activity

    return (
      <Card h={132} wide mt={0} borderBottom='rgba(52, 52, 52, 0.08)' cursor='pointer' onClick={context.setUrl(`/activity/${id}`)}>
        <Flex tall align='start start'>
          <Flex p='m' tall column align='space-between' flex='49%'>
            <Block fs='s' fw='200' ellipsis>{displayName}</Block>
            <Block fs='xs' lh='20px' maxHeight='40px' overflow='hidden' fw='200' color='text'>{description}</Block>
            <MetaUi activity={activity} currentUser={currentUser} showClass={showClass} />
          </Flex>
          <Block flex='22%' mr>
            {
            image && image.url &&
              <BgImg
                backgroundPosition='center center'
                img={image.url}
                thumb={350}
                backgroundSize='cover'
                overflow='hidden'
                boxShadow='card'
                wide
                h='108px'
                relative
                rounded
                my='m' />
          }
          </Block>
          <Flex column flex='28%' pl align='space-between' tall>
            {
              props.badgeUi &&
                <Flex flex align='end start'>
                  <BadgeUi activity={activity} currentUser={currentUser} />
                </Flex>
            }
            {
              options && hover &&
                <Flex align='end center'>
                  <ActivityCardActions {...options} align='end center' wide activity={activity} user={currentUser} />
                  {
                    ddMenu &&
                      <Block mr ml='-6' onClick={stopPropagation}>
                        <ActivityDropdownMenu activity={activity} />
                      </Block>
                  }
                </Flex>
            }
          </Flex>
        </Flex>
      </Card>
    )
  }
}))

/**
 * <Badge/>
 */

function Badge () {
  return <span />
}
