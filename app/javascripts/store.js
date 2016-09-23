import { applyMiddleware, createStore } from 'redux'
import { syncHistory } from 'react-router-redux-params'
import { browserHistory } from 'react-router'

import createLogger from 'redux-logger'
import reduxThunk from 'redux-thunk'

import rootReducer from './rootReducer'

const logger = createLogger()
const middleware = [reduxThunk, logger, syncHistory(browserHistory)]

const store = createStore(rootReducer, {}, applyMiddleware(...middleware))

export default store
