/**
 * Imports
 */

import {wrap, CSSContainer, Button, Dropdown} from 'vdux-containers'
import {TableRow, TableHeader, Icon, Block, Text} from 'vdux-ui'
import {component, element} from 'vdux'
import moment from 'moment'
import map from '@f/map'

/**
 * <GradebookHeader/>
 */

export default component({
  render ({props, actions}) {
    const {activities, sort, totals, ...rest} = props
    const headProps = {
      borderRight: '1px solid text',
      bgColor: 'grey',
      color: 'white',
      p: '16px'
    }

    return (
      <TableRow>
        <NameHeader text='First' prop='name.givenName' {...headProps} setPref={actions.setSort} sort={sort} />
        <NameHeader text='Last' prop='name.familyName' {...headProps} setPref={actions.setSort} sort={sort} />
        <TableHeader {...headProps}>
          Total
        </TableHeader>
        {
          map((activity, i) => <ActivityHeader
            total={totals[i]}
            {...headProps}
            {...rest}
            activity={activity} />, activities)
        }
      </TableRow>
    )
  },

  controller: {
    * setSort ({props}, prop) {
      const {setPref, sort} = props

      yield setPref('gradebookSort', {
        property: prop,
        dir: prop === sort.property ? sort.dir * -1 : 1
      })
    }
  }
})

/**
 * <NameHeader/>
 */

const NameHeader = wrap(CSSContainer, {
  textAlign: 'left',
  hoverProps: {
    hover: true
  }
})({
  render ({props}) {
    const {hover, sort, prop, text, setPref, ...rest} = props

    return (
      <TableHeader pointer onClick={setPref(prop)} {...rest} borderWidth={0}>
        <Block align='start center'>
          <Text underline={hover}>
            {text}
          </Text>
          <Icon
            name={'arrow_drop_' + (sort.dir === 1 ? 'down' : 'up')}
            hidden={sort.property !== prop}
            ml='s'
            fs='s' />
        </Block>
      </TableHeader>
    )
  }
})

/**
 * <ActivityHeader/>
 */

const ActivityHeader = wrap(CSSContainer, {
  hoverProps: {
    showSettings: true
  }
})({
  render ({props, context}) {
    const {activity, showSettings, exportActivity, total, allowExport, ...rest} = props
    const btn = <Icon fs='xs' pointer hide={!showSettings} name='info_outline' absolute top={-16} right={-8} />

    return (
      <TableHeader {...rest} fs='xxs' px maxWidth='90px' minWidth='89px'>
        <Dropdown textAlign='left' lighter fs='xs' btn={btn} z='3' minWidth='150px' maxWidth='220px' px mt={-16} right={-8}>
          <Block bolder align='space-between start'>
            {activity.displayName}
            <Icon name='cancel' fs='xs' mr={-10} mt={-4} pointer />
          </Block>
          <Block color='blue' fs='xxs' fw='600' mt={1}>
            {moment(activity.publishedAt).format('MMM D, YYYY')}
          </Block>
          <Block mt='s' mb>
            Points: {total}
          </Block>
          <Block align='center center'>
            <Button hide={!allowExport} pill px py='s' fs='xxs' bgColor='grey_medium' onClick={exportActivity(activity)}>
              Export to CSV
            </Button>
            <Button px py='s' ml='s' fs='xxs' pill onClick={context.setUrl(`/activity/${activity._id}`)}>
              Go to Activity
            </Button>
          </Block>
        </Dropdown>
        <Block tall wide ellipsis>
          {activity.displayName}
        </Block>
      </TableHeader>
    )
  }
})
