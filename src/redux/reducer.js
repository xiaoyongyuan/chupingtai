const initialState = {
    num: 0,
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD':
            let num = state.num +1
            return {
                num
            }
        default:
            return initialState
    }
}
export default reducer