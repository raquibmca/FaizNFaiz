import AuthReducer from './Reducers/AuthReducer';

const combineReducers = reducers => {
    return (state, action) => {
        return Object.keys(reducers).reduce(
            (acc, prop) => {
                return ({
                    ...acc,
                    ...reducers[prop]({ [prop]: acc[prop] }, action),
                })
            },
            state
        )
    }
}

const rootReducer = combineReducers({
    AuthReducer
})

export { rootReducer }