/**
 * Imports
 */

import {totalPoints} from 'lib/activity-helpers'
import summonChannels from 'lib/summon-channels'
import GradebookHeader from './GradebookHeader'
import datauriDownload from 'datauri-download'
import summonPrefs from 'lib/summon-prefs'
import GradebookNav from './GradebookNav'
import GradebookRow from './GradebookRow'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import findIndex from '@f/find-index'
import {Table, Block} from 'vdux-ui'
import getProp from '@f/get-prop'
import reduce from '@f/reduce'
import toCsv from 'to-csv'
import map from '@f/map'

/**
 * Constants
 */

const pageSize = 5

/**
 * <Gradebook/>
 */

export default summonChannels(({group}) => `group!${group._id}.board`)(summonPrefs()(component({
  initialState: {
    page: 0
  },

  render ({props, actions, state}) {
    const {activities, currentUser, setPref} = props
    const {page} = state
    const {loading, loaded} = activities

    if (!loaded && loading) return <Loading show h='200' />

    const {
      totals, sort, displayPercent, activityList,
      numPages, studentList, usersData, allowExport,
      hasData
    } = deriveData(props)

    return (
      <Block mx='auto' my='l' relative>
        <GradebookNav setPref={setPref} next={actions.next(numPages)} prev={actions.prev(numPages)} exportAll={actions.exportAll} asPercent={displayPercent} page={page} numPages={numPages} hasData={hasData} allowExport={allowExport} />
        <Block boxShadow='card' overflow='auto' relative bg='linear-gradient(to bottom, grey 0px, grey 55px, off_white 55px)'>
          <Table overflow='auto'>
            <GradebookHeader setPref={setPref} activities={curArr(activityList)} exportActivity={actions.exportActivity} totals={totals} sort={sort} allowExport={allowExport} />
            {
              map((student, i) => <GradebookRow
                data={usersData[i]}
                scores={curArr(usersData[i].scores)}
                asPercent={displayPercent}
                student={student}
                odd={i % 2}
                page={page}
                allowExport={allowExport}
                currentUser={currentUser}
                last={studentList.length === (i + 1)} />, studentList)
            }
          </Table>
        </Block>
      </Block>
    )

    function curArr (arr) {
      return arr.slice(page * pageSize, (page + 1) * pageSize)
    }
  },

  controller: {
    exportAll ({props}) {
      const {group} = props
      const {activityList, usersData, studentList, displayPercent} = deriveData(props)

      const headers = ['Id', 'Name', 'Total', ...activityList.map(({displayName}) => displayName)]
      const content = map((user, i) => [
        user.sisId,
        user.displayName,
        usersData[i].percent,
        ...map(score =>
          score.percent === '-'
            ? ''
            : displayPercent ? score.percent : score.points,
          usersData[i].scores
        )
      ], studentList)

      downloadCsv(group.displayName, [headers, ...content])
    },

    exportActivity ({props}, activity) {
      const {activityList, usersData, studentList, displayPercent} = deriveData(props)

      const idx = findIndex(activityList, ({_id}) => _id === activity._id)
      const headers = ['Id', 'Name', 'Grade']
      const content = map((user, i) => {
        const score = usersData[i].scores[idx]

        return [
          user.sisId,
          user.displayName,
          score.percent === '-'
            ? ''
            : displayPercent ? score.percent : score.points
        ]
      }, studentList)

      downloadCsv(activity.displayName, [headers, ...content])
    }
  },

  reducer: {
    next: (state, numPages) => ({
      page: Math.min(state.page + 1, (numPages - 1))
    }),
    prev: state => ({
      page: Math.max(state.page - 1, 0)
    })
  }
})))

/**
 * Helpers
 */

function deriveData (props) {
  const {students, activities, currentUser, prefs} = props
  const {value} = activities

  const totals = []
  const sort = prefs.gradebookSort || {property: 'name.givenName', dir: 1}
  const displayPercent = getProp('gradebook.displayPercent', prefs)
  const activityList = value.items.filter(activity => {
    const total = totalPoints(activity)

    if (total) {
      totals.push(total)
      return true
    }
  })

  const numPages = Math.ceil(activityList.length / pageSize)
  const studentList = students.sort(cmp)
  const {usersData, hasData} = getUsersData(studentList, activityList, totals)
  const allowExport = currentUser.userType === 'teacher'

  return {
    totals,
    sort,
    displayPercent,
    activityList,
    numPages,
    studentList,
    usersData,
    allowExport,
    hasData
  }

  function cmp (a, b) {
    if (!sort) return
    const {property, dir} = sort

    return getProp(property, a).toUpperCase() > getProp(property, b).toUpperCase()
      ? 1 * dir
      : -1 * dir
  }
}

function downloadCsv (filename, data) {
  datauriDownload(filename + '-' + today() + '.csv', 'text/csv;charset=utf-8', toCsv(data))
}

function today () {
  var d = new Date()
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
}


function getUsersData (studentList, activities, totals) {
  let hasData = false
  const usersData = map(user => {
    return reduce((acc, {instances: {total}}, i) => {
      const inst = total.length ? total[0].actors[user._id] : false

      acc.total += totals[i]

      if (!inst || inst.status < 5) {
        acc.scores.push({
          points: '-',
          percent: '-',
          total: totals[i]
        })
        acc.percent = Math.round((acc.points / acc.total) * 100) + '%'
        return acc
      }
      hasData = true
      const points = inst.pointsScaled * totals[i]
      const percent = Math.round(inst.pointsScaled * 100) + '%'

      acc.points += points

      acc.percent = Math.round((acc.points / acc.total) * 100) + '%'
      acc.scores.push({total: totals[i], points, percent})

      return acc
    }, {points: 0, total: 0, scores: []}, activities)
  }, studentList)

  return {usersData, hasData}
}
