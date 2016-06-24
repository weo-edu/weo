/**
 * Imports
 */

import {Table, TableRow, Block, Icon} from 'vdux-ui'
import summonChannels from 'lib/summon-channels'
import GradebookHeader from './GradebookHeader'
import datauriDownload from 'datauri-download'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import GradebookNav from './GradebookNav'
import GradebookRow from './GradebookRow'
import Loading from 'components/Loading'
import findIndex from '@f/find-index'
import element from 'vdux/element'
import getProp from '@f/get-prop'
import reduce from '@f/reduce'
import toCsv from 'to-csv'
import map from '@f/map'

/**
 * Globals
 */

let numPages = 0

/**
 * initialState
 */

function initialState ({props}) {
  const {page} = props

  return {
    page: 0
  }
}

/**
 * <Gradebook/>
 */

function render ({props, local, state}) {
  const {group, students, activities, currentUser} = props
  const {page} = state
  const {value, loading, loaded} = activities
  const asPercent = getProp('preferences.gradebook.displayPercent', currentUser)

  if (!loaded && loading) return <Loading show={true} h='200' />

  const {items: activityList} = value

  const pageSize = 7
  numPages = Math.ceil(activityList.length/ pageSize)
  const sort = getProp('preferences.gradebookSort', currentUser)
    || {dir: 1, property: 'name.givenName'}
  const studentList = students.sort(cmp)

  const totals = map(totalPoints, activityList)
  const usersData = map(user => getUsersData(user._id, activityList, totals), studentList)

  return (
    <Block w='col_main' mx='auto' my='l' relative>
      <GradebookNav next={local(next)} prev={local(prev)} exportAll={exportAll} asPercent={asPercent} page={page} numPages={numPages} />
      <Block boxShadow='card' overflow='auto' relative bg='linear-gradient(to bottom, grey 0px, grey 56px, off_white 56px)'>
        <Table overflow='auto'>
          <GradebookHeader activities={curArr(activityList)} exportActivity={exportActivity} totalPoints={totalPoints} sort={sort}/>
          {
            map((student, i) => <GradebookRow
              data={usersData[i]}
              scores={curArr(usersData[i].scores)}
              asPercent={asPercent}
              student={student}
              odd={i%2}
              page={page}
              currentUser={currentUser}
              last={studentList.length === (i+1)} />, studentList)
          }
        </Table>
      </Block>
    </Block>
  )

  function curArr (arr) {
    return arr.slice(page * pageSize, (page + 1) * pageSize)
  }

  function exportAll () {
    const headers = ['Id', 'Name', 'Total', ...activityList.map(({displayName}) => displayName)]
    const content = map((user, i) => [
      user.sisId,
      user.displayName,
      usersData[i].percent,
      ...map(score =>
        score.percent === '-'
          ? ''
          : asPercent ? score.percent : score.points,
        usersData[i].scores
      )
    ], studentList)

    downloadCsv(group.displayName, [headers, ...content])
  }

  function exportActivity (activity) {
    const idx = findIndex(activityList, ({_id}) => _id === activity._id)
    const headers = ['Id', 'Name', 'Grade']
    const content = map((user, i) => {
      const score = usersData[i].scores[idx]

      return [
        user.sisId,
        user.displayName,
        score.percent === '-'
          ? ''
          : asPercent ? score.percent : score.points
      ]
    }, studentList)

    downloadCsv(activity.displayName, [headers, ...content])
  }

  function cmp (a, b) {
    if(!sort) return
    const prop = sort.property

    return getProp(prop, a).toUpperCase() > getProp(prop, b).toUpperCase()
      ? 1 * sort.dir
      : -1 * sort.dir
  }
}

/**
 * Helpers
 */

function downloadCsv (filename, data) {
  datauriDownload(filename + '-' + today() + '.csv', 'text/csv;charset=utf-8', toCsv(data))
}

function today () {
  var d = new Date()
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
}

function totalPoints (activity) {
  if (!activity._object || !activity._object[0] || !activity._object[0].attachments) return

  return activity._object[0].attachments
    .reduce((total, att) => total +
      (att.objectType === 'question'
        ? att.points.max
        : 0), 0)
}

function getUsersData (id, activities, totals) {
  return reduce((acc, {instances: {total}}, i) => {
    const inst = total.length ? total[0].actors[id] : false

    acc.total += totals[i]

    if (!inst || inst.status < 5) {
      acc.scores.push({
        points: '-',
        percent: '-',
        total: totals[i]
      })
      return acc
    }

    const points = inst.pointsScaled * totals[i]
    const percent = Math.round(inst.pointsScaled * 100) + '%'

    acc.points += points

    acc.percent = Math.round((acc.points / acc.total) * 100) + '%'
    acc.scores.push({total: totals[i], points, percent})

    return acc
  }, {points: 0, total: 0, scores: []}, activities)
}

/**
 * Actions
 */

const next = createAction('<Gradebook />: next')
const prev = createAction('<Gradebook />: prev')

/**
 * Reducer
 */

const reducer = handleActions({
  [next]: state => ({
    ...state,
    page: Math.min(state.page + 1, (numPages - 1))
  }),
  [prev]: state => ({
    ...state,
    page: Math.max(state.page - 1, 0)
  })
})

/**
 * Exports
 */

export default summonChannels(({group}) => `group!${group._id}.board`)({
  initialState,
  render,
  reducer
})
