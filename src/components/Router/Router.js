/**
 * Imports
 */

import ActivitiesLayout from 'layouts/ActivitiesLayout'
import ActivityLayout from 'layouts/ActivityLayout'
import SettingsLayout from 'layouts/SettingsLayout'
import ProfileLayout from 'layouts/ProfileLayout'
import SearchLayout from 'layouts/SearchLayout'
import ClassLayout from 'layouts/ClassLayout'
import MainLayout from 'layouts/MainLayout'
import HomeLayout from 'layouts/HomeLayout'
import AppLayout from 'layouts/AppLayout'

import GetStarted from 'pages/GetStarted'

import SearchMyActivities from 'pages/SearchMyActivities'
import SearchActivities from 'pages/SearchActivities'
import SearchPeople from 'pages/SearchPeople'
import SearchBoards from 'pages/SearchBoards'

import ForgotPassword from 'pages/ForgotPassword'
import TeacherSignup from 'pages/TeacherSignup'
import StudentSignup from 'pages/StudentSignup'
import ResetPassword from 'pages/ResetPassword'
import Clever from 'pages/Clever'

import ProfileFollowers from 'pages/ProfileFollowers'
import ProfileFollowing from 'pages/ProfileFollowing'
import ProfileStream from 'pages/ProfileStream'
import ProfileLikes from 'pages/ProfileLikes'

import ActivityDiscussion from 'pages/ActivityDiscussion'
import ActivityProgress from 'pages/ActivityProgress'
import ActivityOverview from 'pages/ActivityOverview'
import ActivityInstance from 'pages/ActivityInstance'
import ActivityPreview from 'pages/ActivityPreview'
import ActivityEdit from 'pages/ActivityEdit'

import ClassGradebook from 'pages/ClassGradebook'
import ClassStudents from 'pages/ClassStudents'
import ClassFeed from 'pages/ClassFeed'

import AccountSettings from 'pages/AccountSettings'
import AccountProfile from 'pages/AccountProfile'
import AccountEmail from 'pages/AccountEmail'

import ActivitiesBoard from 'pages/ActivitiesBoard'
import MyActivities from 'pages/MyActivities'
import AllClasses from 'pages/AllClasses'
import Drafts from 'pages/Drafts'
import Trash from 'pages/Trash'
import Login from 'pages/Login'
import Feed from 'pages/Feed'
import Home from 'pages/Home'

import NotificationsFeed from 'pages/NotificationsFeed'
import Connect from 'pages/Connect'

import Redirect from 'components/Redirect'
import FourOhFour from 'pages/FourOhFour'
import {component, element} from 'vdux'
import enroute from 'enroute'

/**
 * External router
 */

const router = enroute({
  '/': track(
    (params, props) => isLoggedIn(props) ? 'Home Redirect' : 'Home',
    (params, props) => isLoggedIn(props)
      ? <Redirect to='/class/' />
      : <HomeLayout action='login'>
          <Home {...props} />
        </HomeLayout>),
  '/clever(\\?.*)?': track('Clever', (params, props) =>
    <HomeLayout action='signup'>
      <Clever {...props} />
    </HomeLayout>),
  '/login(\\?.*)?': track('Login', (params, props) =>
    <HomeLayout action='signup'>
      <Login {...props} />
    </HomeLayout>),
  '/teacher(\\?.*)?': track('Teacher Signup', (params, props) =>
    <HomeLayout action='login'>
      <TeacherSignup {...props} />
    </HomeLayout>),
  '/student(\\?.*)?': track('Student Signup', (params, props) =>
    <HomeLayout action='login'>
      <StudentSignup {...props} />
    </HomeLayout>),
  '/forgot(\\?.*)?': track('Forgot Password', (params, props) =>
    <HomeLayout action='login'>
      <ForgotPassword {...props} />
    </HomeLayout>),
  '/reset/:token?': track('Reset Password', (params, props) =>
    <HomeLayout action='login'>
      <ResetPassword {...props} {...params} />
    </HomeLayout>),

  //Get Started
  '/get-started': track('Get started', auth('teacher', (params, props) =>
    <AppLayout {...props} {...params}>
      <GetStarted {...props} />
    </AppLayout>)),

  // Home
  '/feed': track('Feed', auth('user', (params, props) =>
    <MainLayout {...props}>
      {
        props.currentUser.userType === 'teacher'
          ? <Feed {...props} />
          : <Redirect to='/class/all' {...props} />
      }
    </MainLayout>)),
  // Class
  '/class/': track('Class Redirect', auth('user', (params, props) =>
    <Redirect to='/class/all' />)),
  '/class/all': track('Class All', auth('user', (params, props) =>
    <MainLayout {...props} {...params}>
      <AllClasses {...props} />
    </MainLayout>)),
  '/class/:groupId': track('Class Feed Redirect', auth('user', (params, props) =>
    <MainLayout {...props} {...params}>
      <ClassLayout {...props} {...params}>
        <Redirect to={`/class/${params.groupId}/feed`} />
      </ClassLayout>
    </MainLayout>)),
  '/class/:groupId/feed': track('Class Feed', auth('user', (params, props) =>
    <MainLayout {...props} {...params}>
      <ClassLayout {...props} {...params}>
        {group => <ClassFeed {...props} group={group} />}
      </ClassLayout>
    </MainLayout>)),
  '/class/:groupId/students': track('Class Students', auth('user', (params, props) =>
    <MainLayout {...props} {...params}>
      <ClassLayout {...props} {...params}>
        {group => <ClassStudents {...props} group={group} />}
      </ClassLayout>
    </MainLayout>)),
  '/class/:groupId/gradebook': track('Class Gradebook', auth('user', (params, props) =>
    <MainLayout {...props} {...params}>
      <ClassLayout {...props} {...params}>
        {group => <ClassGradebook {...props} group={group} />}
      </ClassLayout>
    </MainLayout>)),

  // Search
  '/search/activities/:query?': track('Search Activities', auth('nonstudent', (params, props) =>
    <SearchLayout {...props} {...params}>
      <SearchActivities {...props} {...params} />
    </SearchLayout>)),
  '/search/my-activities/:query?': track('Search My Activities', auth('nonstudent', (params, props) =>
    <SearchLayout {...props} {...params}>
      <SearchMyActivities {...props} {...params} />
    </SearchLayout>)),
  '/search/boards/:query?': track('Search Boards', auth('nonstudent', (params, props) =>
    <SearchLayout {...props} {...params}>
      <SearchBoards {...props} {...params} />
    </SearchLayout>)),
  '/search/people/:query?': track('Search People', auth('nonstudent', (params, props) =>
    <SearchLayout {...props} {...params}>
      <SearchPeople {...props} {...params} />
    </SearchLayout>)),

  // Acount
  '/account/settings': track('Account Settings', auth('user', (params, props) =>
    <SettingsLayout {...props} {...params}>
      <AccountSettings {...props} />
    </SettingsLayout>)),
  '/account/profile': track('Account Profile', auth('user', (params, props) =>
    <SettingsLayout {...props} {...params}>
      <AccountProfile {...props} />
    </SettingsLayout>)),
  '/account/email': track('Account Email', auth('teacher', (params, props) =>
    <SettingsLayout {...props} {...params}>
      <AccountEmail {...props} />
    </SettingsLayout>)),

  // Notifications
  '/notifications': track('Notifications Feed', auth('user', (params, props) =>
    <AppLayout bgColor='red_medium' {...props} {...params}>
      <NotificationsFeed {...props} />
    </AppLayout>)),

  // Connect
  '/connect/:userSearch?': track('Connect', auth('teacher', (params, props) =>
    <AppLayout {...props} {...params}>
      <Connect {...props} {...params} />
    </AppLayout>)),

  // Activity
  '/activity/:activityId': track('Activity Redirect', (params, props) =>
    <ActivityLayout {...props} {...params} redirect>
      {({activity}) => activityRedirect(activity, props)}
    </ActivityLayout>),
  '/activity/:activityId/edit/:intent?': track('Activity Edit', (params, props) =>
    <ActivityLayout isEdit {...props} {...params}>
      {data => <ActivityEdit {...props} {...params} {...data} />}
    </ActivityLayout>),
  '/activity/:activityId/students': track('Activity Progress', (params, props) =>
    <ActivityLayout {...props} {...params}>
      {data => <ActivityProgress {...props} {...params} {...data} />}
    </ActivityLayout>),
  '/activity/:activityId/overview': track('Activity Overview', (params, props) =>
    <ActivityLayout {...props} {...params}>
      {data => <ActivityOverview {...props} {...params} {...data} />}
    </ActivityLayout>),
  '/activity/:activityId/preview': track('Activity Preview', (params, props) =>
    <ActivityLayout {...props} {...params}>
      {data => <ActivityPreview {...props} {...params} {...data} />}
    </ActivityLayout>),
  '/activity/:activityId/discussion': track('Activity Discussion', (params, props) =>
    <ActivityLayout {...props} {...params}>
      {data => <ActivityDiscussion {...props} {...params} {...data} />}
    </ActivityLayout>),
  '/activity/:activityId/instance/:userId': track('Activity Instance', (params, props) =>
    <ActivityLayout {...props} {...params}>
      {data => <ActivityInstance {...props} {...params} {...data} />}
    </ActivityLayout>),

  // Profile
  '/:username/boards': track('Profile Boards', auth('nonstudent', (params, props) =>
    <ProfileLayout {...props} {...params}>
      { user => <Redirect to={`/${user.username}/boards/all`} /> }
    </ProfileLayout>)),
  '/:username/boards/all': track('Profile All Boards', auth('nonstudent', (params, props) =>
    <ProfileLayout {...props} {...params}>
      {user =>
        <ActivitiesLayout {...props} user={user}>
          <MyActivities {...props} user={user} />
        </ActivitiesLayout>
      }
    </ProfileLayout>)),
  '/:username/boards/drafts': track('Profile Drafts', auth('nonstudent', (params, props) =>
    <ProfileLayout {...props} {...params}>
      { user =>
          <ActivitiesLayout {...props} user={user}>
            <Drafts {...props} />
          </ActivitiesLayout>
      }
    </ProfileLayout>)),
  '/:username/boards/trash': track('Profile Trash', auth('nonstudent', (params, props) =>
    <ProfileLayout {...props} {...params}>
      { user =>
          <ActivitiesLayout {...props} user={user}>
            <Trash {...props} />
          </ActivitiesLayout>
      }
    </ProfileLayout>)),
  '/:username/boards/:boardId': track('Profile Board', auth('nonstudent', (params, props) =>
    <ProfileLayout {...props} {...params}>
      { user =>
          <ActivitiesLayout {...props} user={user}>
            <ActivitiesBoard {...params} {...props} />
          </ActivitiesLayout>
      }
    </ProfileLayout>)),
  '/:username/likes': track('Profile Likes', auth('nonstudent', (params, props) =>
    <ProfileLayout {...props} {...params}>
      {user => <ProfileLikes {...props} user={user} />}
    </ProfileLayout>)),
  '/:username/following': track('ProfileFollowing', auth('nonstudent', (params, props) =>
    <ProfileLayout {...props} {...params}>
      {user => <ProfileFollowing {...props} user={user} />}
    </ProfileLayout>)),
  '/:username/followers': track('Profile Followers', auth('nonstudent', (params, props) =>
    <ProfileLayout {...props} {...params}>
      {user => <ProfileFollowers {...props} user={user} />}
    </ProfileLayout>)),
  '/:username/stream': track('Profile Stream', (params, props) =>
    <ProfileLayout {...props} {...params}>
      {user => <ProfileStream {...props} user={user} />}
    </ProfileLayout>),
  '/:username': track('Profile Redirect', (params, props) =>
    <ProfileLayout {...props} {...params}>
      { user => profileRedirect(props, user) }
    </ProfileLayout>),

  // 404
  '*': track('404', (params, props) =>
    <AppLayout {...props} {...params}>
      <FourOhFour />
    </AppLayout>)
})

/**
 * URL Regexes
 */

const activityRe = /^\/activity\//
const activityEditRe = /^\/activity\/[^\/]+\/edit/

/**
 * <Router/>
 */

export default component({
  onCreate ({props, state, context}) {
    const {name, params} = router(props.currentUrl, {...props, ...state})
    return context.page({name, params})
  },

  render ({props, state}) {
    if (!props.currentUrl || !props.ready) return <div>Loading...</div>
    return router(props.currentUrl, {...props, ...state}).route
  },

  reducer: {
    canExit: (state, canExit) => ({canExit}),
    exitDepth: (state, exitDepth) => ({exitDepth})
  },

  * onUpdate (prev, next) {
    const {actions, context} = next

    if (prev.props.currentUrl !== next.props.currentUrl) {
      const {name, params} = router(next.props.currentUrl, {...next.props, ...next.state})
      yield context.page({name, params})

      if (prev.props.currentUrl && !activityRe.test(prev.props.currentUrl) && activityRe.test(next.props.currentUrl)) {
        yield actions.canExit(true)
      }

      if (prev.props.currentUrl && activityRe.test(prev.props.currentUrl) && activityEditRe.test(next.props.currentUrl)) {
        yield actions.exitDepth(2)
      }

      if (prev.props.currentUrl && activityEditRe.test(prev.props.currentUrl) && !activityEditRe.test(next.props.currentUrl)) {
        yield actions.exitDepth(undefined)
      }

      yield () => (document.body.scrollTop = 0)
    }
  }
})

/**
 * Helpers
 */

function auth (type, route) {
  return (params, props) =>
    isAuthorized(type, props)
      ? route(params, props)
      : <Redirect to='/' />
}

function track (name, route) {
  return (params, props) => ({
    name: typeof name === 'function' ? name(params, props) : name,
    params,
    props,
    route: route(params, props)
  })
}

function isAuthorized (type, {currentUser}) {
  switch (type) {
    case 'user':
      return !!currentUser
    case 'student':
      return currentUser.userType === 'student'
    case 'nonstudent':
      return !currentUser || currentUser.userType !== 'student'
    case 'teacher':
      return currentUser.userType === 'teacher'
  }
}

function isLoggedIn (state) {
  return !!state.currentUser
}

function profileRedirect (props, user) {
  const {currentUser} = props
  let subState = 'stream'

  if (currentUser.userType !== 'student') {
    subState = user.userType === 'student' ? 'stream' : 'boards'
  }

  return <Redirect to={`/${user.username}/${subState}`} />
}

function activityRedirect ({published, contexts, _id}, {currentUser}) {
  if (!published) {
    return <Redirect to={`/activity/${_id}/edit`} />
  }

  if (contexts[0].descriptor.id === 'public') {
    return <Redirect to={`/activity/${_id}/preview`} />
  }

  if (currentUser.userType === 'student') {
    return <Redirect to={`/activity/${_id}/instance/${currentUser._id}`} />
  }

  return <Redirect to={`/activity/${_id}/students`} />
}
