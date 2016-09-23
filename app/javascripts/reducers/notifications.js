
function reducer (state = {}, action) {
  switch(action.type){
    case 'ADD_NOTIFICATION':
      return action.notification
    default:
      return state
  }
}

export default reducer
