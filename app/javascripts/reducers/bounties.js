function reducer (state = [], action) {
  switch(action.type){
    case 'SET_BOUNTIES':
      return action.bounties
    default:
      return state
  }
}

export default reducer
