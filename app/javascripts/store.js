import { applyMiddleware, createStore } from 'redux'

import createLogger from 'redux-logger'
import reduxThunk from 'redux-thunk'

import rootReducer from './rootReducer'

const logger = createLogger()
const middleware = [reduxThunk, logger]

const store = createStore(rootReducer, {}, applyMiddleware(...middleware))

export default store
