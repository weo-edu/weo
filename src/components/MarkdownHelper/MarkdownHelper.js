/**
 * Imports
 */

import {Dropdown, Block, Button, MenuItem} from 'vdux-containers'
import {Icon, Table, TableRow, TableCell, Text} from 'vdux-ui'
import {stopPropagation, component, element} from 'vdux'

/**
 * <MarkdownHelper/>
 */

export default component({
  render ({props, state, actions}) {
    const {menuProps, ...rest} = props
    const tabs = ['emphasis', 'math', 'links', 'tables', 'symbols', 'lists']
    const current = state.tab || 'emphasis'

    return (
      <Dropdown
        btn={<Button tabindex={-1} icon='info' color='text' fs='s' {...rest} />}
        w={732} right mt={8} z={2} {...menuProps}>
        <Block align='start stretch' my={-6} onClick={stopPropagation}>
          <Arrow />
          <Block flex='40%' borderRight='1px solid grey_light' py>
            {
              tabs.map((tab, i) =>
                <MenuItem
                  borderTop={!i ? '1px solid grey_light' : '0px solid transparent'}
                  borderBottom='1px solid grey_light'
                  highlight={tab === current ? 0.03 : 0}
                  onClick={actions.setTab(tab)}
                  borderLeft={tab === current ? '3px solid blue' : '0px solid transparent'}
                  align='space-between center'
                  pl={tab === current ? 12 : 15}
                  capitalize>
                  <Block>{tab}</Block>
                  <Icon name='chevron_right' fs='s' hidden={tab !== current} />
                </MenuItem>
              )
            }
          </Block>
          <Block p flex>
            <Emphasis hide={current !== 'emphasis'} />
            <Math hide={current !== 'math'} />
            <Links hide={current !== 'links'} />
            <Tables hide={current !== 'tables'} />
            <Symbols hide={current !== 'symbols'} />
            <Lists hide={current !== 'lists'} />
          </Block>
        </Block>
      </Dropdown>
    )
  },

  reducer: {
    setTab: (state, tab) => ({tab})
  }
})

/**
 * <Arrow/>
 */

function Arrow () {
  const props = {
    absolute: {bottom: '100%', right: 11},
    border: '10px solid transparent',
    borderTopWidth: 0
  }
  return (
    <span>
      <Block {...props} borderBottomColor='#CCC' />
      <Block {...props} borderBottomColor='white' mb={-1} />
    </span>
  )
}

/**
 * <H/>
 */

function H ({props, children}) {
  return (
    <Block tag='span' bgColor='grey_light' px='4' bold>
      {children}
    </Block>
  )
}

/**
 * <M/>
 */

function M ({children}) {
  return (
    <Block tag='span'>
      <Text color='grey_medium' italic>$$&nbsp;</Text>
      { children }
      <Text color='grey_medium' italic>&nbsp;$$</Text>
    </Block>
  )
}

/**
 * <Row/>
 */

function Row ({props}) {
  const {text, display, ...rest} = props
  const Render = typeof text === 'string' ? <Text>{text}</Text> : text

  return (
    <TableRow borderBottom='1px solid grey_light' {...rest}>
      <TableCell py='s' w='57%' >
        {Render}
      </TableCell>
      <td><Icon name='arrow_forward' fs='xs' mr /></td>
      <TableCell w='43%' class='markdown' innerHTML={display} />
    </TableRow>
  )
}

/**
 * <Emphasis/>
 */

function Emphasis ({props}) {
  return (
    <Block {...props}>
      You can create headers of various sizes by prefixing your text with <H>#</H>'s.  Create bold, italics, or strikethroughs by surrouding text with <H>**</H>, <H>*</H>, or <H>~~</H>.
      <br /><br />
      <Table>
        <Row text='# Header 1' display='<h2>Header 1</h2>' />
        <Row text='## Header 2' display='<h3>Header 2</h3>' />
        <Row text='### Header 3' display='<h4>Header 3</h4>' />
        <Row text='**bold text**' display='<strong>bold text</strong>' />
        <Row text='*italic text*' display='<em>italic text</em>' />
        <Row text='~~strikethrough text~~' display='<del>strikethrough text</del>' />
      </Table>
    </Block>
  )
}

/**
 * <Math/>
 */

function Math ({props}) {
  return (
    <Block {...props}>
      To add equations to your text, wrap the relevant area in
      <br /><H>$$</H> <i>math goes here</i> <H>$$</H>.
      <br /><br />
      <Table >
        <Row text={<Text>What is <M>2 + 2 = ?</M> ?</Text>} display='What is <span class="katex"><span class="katex-inner"><span class="strut" style="height:0.64444em;"></span><span class="strut bottom" style="height:0.72777em;vertical-align:-0.08333em;"></span><span class="base textstyle uncramped"><span class="mord">2</span><span class="mbin">+</span><span class="mord">2</span></span></span></span> ?' />
        <Row text={<M>2^3 = ?</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.8141079999999999em;"></span><span class="strut bottom" style="height:0.8141079999999999em;vertical-align:0em;"></span><span class="base textstyle uncramped"><span class="mord"><span class="mord">2</span><span class="vlist"><span style="top:-0.363em;margin-right:0.05em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle scriptstyle uncramped"><span class="mord">3</span></span></span><span class="baseline-fix"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span>​</span></span></span><span class="mrel">=</span><span class="mclose">?</span></span></span></span>' />
        <Row text={<M>{'\\frac{x}{y}'}</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.695392em;"></span><span class="strut bottom" style="height:1.1764999999999999em;vertical-align:-0.481108em;"></span><span class="base textstyle uncramped"><span class="minner mfrac reset-textstyle textstyle uncramped"><span class="vlist"><span style="top:0.345em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle scriptstyle cramped"><span class="mord scriptstyle cramped"><span class="mord mathit" style="margin-right:0.03588em;">y</span></span></span></span><span style="top:-0.22999999999999998em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle textstyle uncramped frac-line"></span></span><span style="top:-0.394em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle scriptstyle uncramped"><span class="mord scriptstyle uncramped"><span class="mord mathit">x</span></span></span></span><span class="baseline-fix"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span>​</span></span></span></span></span></span>' />
        <Row text={<M>{'\\sqrt{x}'}</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.8002800000000001em;"></span><span class="strut bottom" style="height:1.04em;vertical-align:-0.23972em;"></span><span class="base textstyle uncramped"><span class="sqrt mord"><span class="sqrt-sign" style="top:0.03971999999999998em;"><span class="style-wrap reset-textstyle textstyle uncramped">√</span></span><span class="vlist"><span style="top:0em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:1em;">​</span></span><span class="mord textstyle cramped"><span class="mord mathit">x</span></span></span><span style="top:-0.72028em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:1em;">​</span></span><span class="reset-textstyle textstyle uncramped sqrt-line"></span></span><span class="baseline-fix"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:1em;">​</span></span>​</span></span></span></span></span></span>' />
        <Row text={<M>{'\\sum_{k=1}^n'}</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.75em;"></span><span class="strut bottom" style="height:1.0500099999999999em;vertical-align:-0.30001em;"></span><span class="base textstyle uncramped"><span class="mop"><span class="op-symbol small-op mop" style="top:-0.0000050000000000050004em;">∑</span><span class="vlist"><span style="top:0.30001em;margin-left:0em;margin-right:0.05em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle scriptstyle cramped"><span class="mord scriptstyle cramped"><span class="mord mathit" style="margin-right:0.03148em;">k</span><span class="mrel">=</span><span class="mord">1</span></span></span></span><span style="top:-0.364em;margin-right:0.05em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle scriptstyle uncramped"><span class="mord mathit">n</span></span></span><span class="baseline-fix"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span>​</span></span></span></span></span></span>' />
        <Row text={<M>{'\\prod_{k=1}^n'}</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.75em;"></span><span class="strut bottom" style="height:1.0500099999999999em;vertical-align:-0.30001em;"></span><span class="base textstyle uncramped"><span class="mop"><span class="op-symbol small-op mop" style="top:-0.0000050000000000050004em;">∏</span><span class="vlist"><span style="top:0.30001em;margin-left:0em;margin-right:0.05em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle scriptstyle cramped"><span class="mord scriptstyle cramped"><span class="mord mathit" style="margin-right:0.03148em;">k</span><span class="mrel">=</span><span class="mord">1</span></span></span></span><span style="top:-0.364em;margin-right:0.05em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle scriptstyle uncramped"><span class="mord mathit">n</span></span></span><span class="baseline-fix"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span>​</span></span></span></span></span></span>' />
      </Table>
    </Block>
  )
}

/**
 * <Links/>
 */

function Links ({props}) {
  return (
    <Block {...props}>
      Links in your text will automatically be turned into clickable elements if they include <H>http://</H> or <H>https://</H>.  You can also format your links to make your text more readable.
      <br /><br />
      <Table>
        <Row h={40} text='http://www.weo.io' display='<a href="http://www.weo.io" target="_blank">http://www.weo.io</a>' />
        <Row h={40} text='[Click this link](http://www.weo.io)' display='<a href="http://www.weo.io" target="_blank">Click this link</a>' />
      </Table>
    </Block>
  )
}

/**
 * <Tables/>
 */

function Tables ({props}) {
  return (
    <Block {...props}>
      Use <H>|</H>'s to create tables. <H>:</H>'s can be used to align the content of each column. You must add a blank line between any text and your table. The table must also include a header, which is the first row separated by dashes as shown below.
      <br /><br />
      <Block tag='span' fontFamily='monospace' whiteSpace='pre'>
      | Tables        | Are           | Cool  |           <br />
      | ------------- |:-------------:| -----:|                    <br />
      | col 3 is      | right-aligned | $1600 |           <br />
      | col 2 is      | centered      | $12   |           <br />
      | zebra stripes | are neat      | $1    |                    <br />
      </Block>
      <br /><br />
      <span class='markdown'>
        <Table>
          <tr>
            <th>Tables</th>
            <th align='center'>Are</th>
            <th align='right'>Cool</th>
          </tr>
          <tr>
            <td>col 3 is</td>
            <td align='center'>right-aligned</td>
            <td align='right'>$1600</td>
          </tr>
          <tr>
            <td>col 2 is</td>
            <td align='center'>centered</td>
            <td align='right'>$12</td>
          </tr>
          <tr>
            <td>zebra stripes</td>
            <td align='center'>are neat</td>
            <td align='right'>$1</td>
          </tr>
        </Table>
      </span>
    </Block>
  )
}

/**
 * <Symbols/>
 */

function Symbols ({props}) {
  return (
    <Block {...props}>
      To add mathematical symbols to your text, wrap the relevant area in <H>$$</H> <em>insert symbol here</em> <H>$$</H>.
      <br /><br />
      <Block align='start center'>
        <Table flex='50%' mr='s'>
          <Row text={<M>\$</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.75em;"></span><span class="strut bottom" style="height:0.80556em;vertical-align:-0.05556em;"></span><span class="base textstyle uncramped"><span class="mord">$</span></span></span></span>' />
          <Row text={<M>\leq </M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.63597em;"></span><span class="strut bottom" style="height:0.7719400000000001em;vertical-align:-0.13597em;"></span><span class="base textstyle uncramped"><span class="mrel">≤</span></span></span></span>' />
          <Row text={<M>\geq</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.63597em;"></span><span class="strut bottom" style="height:0.7719400000000001em;vertical-align:-0.13597em;"></span><span class="base textstyle uncramped"><span class="mrel">≥</span></span></span></span>' />
          <Row text={<M>\neq</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0em;"></span><span class="strut bottom" style="height:0em;vertical-align:0em;"></span><span class="base textstyle uncramped"><span class="mrel">≠</span></span></span></span>' />
          <Row text={<M>\approx</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.48312em;"></span><span class="strut bottom" style="height:0.48312em;vertical-align:0em;"></span><span class="base textstyle uncramped"><span class="mrel">≈</span></span></span></span>' />
          <Row text={<M>\pm</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.58333em;"></span><span class="strut bottom" style="height:0.66666em;vertical-align:-0.08333em;"></span><span class="base textstyle uncramped"><span class="mord">±</span></span></span></span>' />
          <Row text={<M>\times</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.58333em;"></span><span class="strut bottom" style="height:0.66666em;vertical-align:-0.08333em;"></span><span class="base textstyle uncramped"><span class="mord">×</span></span></span></span>' />
        </Table>
        <Table flex='50%' ml='s'>
          <Row text={<M>\pi</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.43056em;"></span><span class="strut bottom" style="height:0.43056em;vertical-align:0em;"></span><span class="base textstyle uncramped"><span class="mord mathit" style="margin-right:0.03588em;">π</span></span></span></span>' />
          <Row text={<M>\Sigma</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.68333em;"></span><span class="strut bottom" style="height:0.68333em;vertical-align:0em;"></span><span class="base textstyle uncramped"><span class="mord">Σ</span></span></span></span>' />
          <Row text={<M>\mu</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.43056em;"></span><span class="strut bottom" style="height:0.625em;vertical-align:-0.19444em;"></span><span class="base textstyle uncramped"><span class="mord mathit">μ</span></span></span></span>' />
          <Row text={<M>{'^{\circ}'}</M>} display='​<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.674115em;"></span><span class="strut bottom" style="height:0.674115em;vertical-align:0em;"></span><span class="base textstyle uncramped"><span class="mord"><span></span><span class="vlist"><span style="top:-0.363em;margin-right:0.05em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="reset-textstyle scriptstyle uncramped"><span class="mord scriptstyle uncramped"><span class="mord">∘</span></span></span></span><span class="baseline-fix"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span>​</span></span></span></span></span></span>' />
          <Row text={<M>\infty</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.43056em;"></span><span class="strut bottom" style="height:0.43056em;vertical-align:0em;"></span><span class="base textstyle uncramped"><span class="mord">∞</span></span></span></span>' />
          <Row text={<M>\bar a</M>} display='​<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.56778em;"></span><span class="strut bottom" style="height:0.56778em;vertical-align:0em;"></span><span class="base textstyle uncramped"><span class="mord"><span class="vlist"><span style="top:0em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="mord mathit">a</span></span><span style="top:0em;margin-left:0em;"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span><span class="accent-body"><span>¯</span></span></span><span class="baseline-fix"><span class="fontsize-ensurer reset-size5 size5"><span style="font-size:0em;">​</span></span>​</span></span></span></span></span></span>' />
          <Row text={<M>\div</M>} display='<span class="katex"><span class="katex-inner"><span class="strut" style="height:0.58333em;"></span><span class="strut bottom" style="height:0.66666em;vertical-align:-0.08333em;"></span><span class="base textstyle uncramped"><span class="mord">÷</span></span></span></span>' />
        </Table>
      </Block>
    </Block>
  )
}

/**
 * <Lists/>
 */

function Lists ({props}) {
  return (
    <Block {...props}>
      If you would like to put a list into your text, add a number before each line. Alternatively, you can add <H>-</H>, <H>+</H>, or <H>*</H>. You can also create sub lists by indenting your lists items by at least <H>4 spaces</H>.
      <br /><br />
      <Table>
        <Row text={<Text>1. First step<br />2. Second step<br />3. Final step<br /></Text>} display='<ol><li>First step</li><li>Second step</li><li>Final step</li></ol>' />
        <Row text={<Text>- Milk<br />- Orange Juice<br /></Text>} display='<ul><li>Milk</li><li>Orange juice</li></ul>' />
        <Row text={<Text>- Fruits<br />&nbsp;&nbsp;&nbsp;&nbsp;- Apple<br /></Text>} display='<ul><li>Fruits<ul><li>Apple</li></ul></li></ul>' />
      </Table>
    </Block>
  )
}
