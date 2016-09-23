function reducer (state = [], action) {
  switch(action.type){
    case 'ADD_ACTIVITY':
      return [...state, action.activity]
    default:
      return state
  }
}

export default reducer
