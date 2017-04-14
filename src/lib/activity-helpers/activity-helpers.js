/**
 * Imports
 */

import getProp from '@f/get-prop'
import index from '@f/index'

/**
 * Activity Helpers
 */

function questionIcon (question) {
  if (typeof question === 'string') {
    return typeIcon(question)
  } else if (question.poll) {
    return typeIcon('poll')
  } else {
    return typeIcon(question.attachments[0].objectType)
  }
}

function questionDisplay (question) {
  if (typeof question === 'string') {
    return typeDisplay(question)
  } else if (question.poll) {
    return typeDisplay('poll')
  } else {
    return typeDisplay(question.attachments[0].objectType)
  }
}

function typeIcon (type) {
  switch (type) {
    case 'poll':
      return 'equalizer'
    case 'choice':
      return 'done_all'
    case 'shortAnswer':
      return 'edit'
    case 'text':
      return 'message'
    default:
      return 'help'
  }
}

function typeDisplay (type) {
  switch (type) {
    case 'poll':
      return 'Poll'
    case 'choice':
      return 'Multiple Choice'
    case 'shortAnswer':
      return 'Short Answer'
    case 'text':
      return 'Free Response'
  }
}

function totalPoints (activity) {
  if (!activity._object || !activity._object[0] || !activity._object[0].attachments) return

  return activity._object[0].attachments
    .reduce((total, att) => total +
      (att.objectType === 'question' && !att.poll
        ? parseFloat(att.points.max, 10)
        : 0), 0)
}

function totalScore (activity) {
  if (!activity._object || !activity._object[0] || !activity._object[0].attachments) return

  const total = activity._object[0].attachments
    .reduce((total, {objectType, poll, points}) => total +
      (objectType === 'question' && !poll && points.scaled
          ? points.scaled * points.max
          : 0), 0)
  return Math.round(total * 100) / 100
}

function activitySort (sort) {
  const prop = sort.property
  const normalize = prop === 'points' || prop === 'percent'
    ? val => parseFloat(val)
    : val => (val || '').toString().toUpperCase()
  return (a, b) => {
    if (!sort) return
    const prop1 = normalize(getProp(prop, a))
    const prop2 = normalize(getProp(prop, b).toString())
    const bool = prop1 === prop2
      ? a.displayName.toUpperCase() > b.displayName.toUpperCase()
      : prop1 > prop2

    return bool ? 1 * sort.dir : -1 * sort.dir
  }
}

function getOverviewQuestions (attachments, instances) {
  const questions = []
  const attList = [].concat(attachments)
  attList.forEach((attachment, i) => {
    if (attachment.objectType === 'question') {
      const length = questions.push({
        total: 0,
        numAnswered: 0,
        responses: [],
        ...attachment
      })
      instances.forEach(instance => {
        if (instance.status >= 4 || attachment.poll) {
          const {actor, _object} = instance
          const question = _object[0].attachments[i]
          const {points, response} = question
          const total = points ? points.scaled * points.max : 0
          questions[length - 1].total += (total || 0)
          questions[length - 1].numAnswered++
          questions[length - 1].responses.push({actor, response})
        }
      })
    }
  })
  return questions
}

function combineInstancesAndStudents (activity, students, instances) {
  const studentToInstance = index(inst => inst.actor.id, instances)
  const {instances: {total = []}} = activity
  const {actors} = total[0] || {}
  const totalPts = totalPoints(activity)

  if (!actors) return []

  return students.map(student => {
    const actor = actors[student._id]
    const pointsScaled = actor ? actor.pointsScaled : 0
    const instance = studentToInstance[student._id] || {}

    return {
      total: totalPts,
      displayName: instance.actor && instance.actor.displayName,
      instanceId: instance._id,
      familyName: student.name.familyName,
      givenName: student.name.givenName,
      percent: Math.round(pointsScaled * 100) + '%',
      turnedInAt: actor ? actor.turnedInAt : 0,
      status: actor ? actor.status : 1,
      points: pointsScaled * totalPts,
      userId: student._id,
      name: student.name
    }
  })
}

function constructInstance (activity, instance) {
  const resps = instance.responses || {}

  return {
    ...instance,
    max_score: activity._object[0].attachments.reduce((acc, obj) => obj.points && obj.points.max ? acc + obj.points.max : acc, 0),
    hideOnTurnIn: activity.hideOnTurnIn,
    discussion: activity.discussion,
    textToSpeech: activity.textToSpeech,
    displayName: activity.displayName,
    _object: activity._object
      .map(obj => {
        return {
          ...obj,
          attachments: obj.attachments
            .map(sub => sub.objectType !== 'question' ? sub : {
              ...sub,
              response: (resps[sub._id] || {}).response,
              points: {
                ...(sub.points || {}),
                scaled: (resps[sub._id] || {}).score
              }
            })
        }
      })
  }
}

const statusMap = {
  unopened: 1,
  opened: 2,
  turnedIn: 3,
  graded: 4,
  returned: 5
}

/**
 * Exports
 */

export {
  activitySort,
  questionIcon,
  questionDisplay,
  totalPoints,
  totalScore,
  statusMap,
  getOverviewQuestions,
  combineInstancesAndStudents,
  constructInstance
}
