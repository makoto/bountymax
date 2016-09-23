import { combineReducers } from 'redux'
import notifications from './reducers/notifications'
import bounties from './reducers/bounties'
import activities from './reducers/activities'

const rootReducer = combineReducers({
  notifications,
  bounties,
  activities
})

export default rootReducer
