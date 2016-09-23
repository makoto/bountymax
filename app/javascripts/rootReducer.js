import { combineReducers } from 'redux'
import notifications from './reducers/notifications'
import bounties from './reducers/bounties'

const rootReducer = combineReducers({
  notifications,
  bounties
})

export default rootReducer
