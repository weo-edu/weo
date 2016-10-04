/**
 * Imports
 */

import {Dropdown, Button, MenuItem, Tooltip, Toggle} from 'vdux-containers'
import {Block, Icon} from 'vdux-ui'
import summon from 'vdux-summon'
import element from 'vdux/element'

/**
 * Render
 */

function render ({props}) {
  const {page, numPages, asPercent, exportAll, next, prev, setPref, hasData} = props
  const navProps = {
    hoverProps: {highlight: 0.02},
    focusProps: {highlight: 0.02},
    userSelect: 'none',
    bgColor: 'white',
    boxShadow: 'z1',
    color: 'text',
    circle: 36,
    p: 0
  }

  return (
    <Block align='space-between center' relative mb>
      <Block align='start stretch'>
        <Block align='start center'>
          <Button px mr='s' bgColor='blue' onClick={exportAll}>
            Export to CSV
              <Icon name='file_download' fs='xs' ml='s' />
          </Button>
          <Toggle onClick={togglePref} checked={asPercent}
          label='Display as Percentages' />
        </Block>
        <Tooltip
          message='Student scores will only show up after you return their Activities to them'
          tooltipProps={{whiteSpace: 'wrap'}}
          align='center stretch'
          placement='right'
          cursor='default'
          immediate
          hide={hasData}>
          <Block pill bgColor='red' color='white' align='center center' px ml>
            Where are my grades
            <Icon name='help' ml='s' fs='s' />
          </Block>
        </Tooltip>
      </Block>
      <Block align='start center'>
        <Button mr {...navProps} onClick={prev} disabled={page === 0}>
          <Icon name='navigate_before' fs={19} />
        </Button>
        <Button {...navProps} onClick={next} disabled={page+1 === numPages}>
          <Icon name='navigate_next' fs={19} />
        </Button>
      </Block>
    </Block>
  )

  function togglePref () {
    return setPref('gradebook.displayPercent', !asPercent)
  }
}

/**
 * Export
 */

export default {
  render
}
