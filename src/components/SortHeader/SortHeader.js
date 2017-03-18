/**
 * Imports
 */

import {Block, Icon, Text, TableHeader} from 'vdux-ui'
import {wrap, CSSContainer} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * <SortHeader/>: Sortable table headers
 */

export default wrap(CSSContainer, {
  hoverProps: {
    hover: true
  }
})({
  render ({props}) {
    const {hover, sort, prop, text, setSort, ...rest} = props

    return (
      <TableHeader pointer={sort} onClick={setSort(sort, prop)} {...rest} borderWidth={0}>
        <Block align='start center'>
          <Text underline={sort && hover}>
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
