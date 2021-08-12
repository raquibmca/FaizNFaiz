const User = {
    items: [],
    current: null,
    isFetching: false,
    // loadingAddress: false,
    // address: []
};

const UserReducer = (state, action) => {
    switch (action.type) {
        case "LOADING_USERS":
            return {
                ...state,
                isFetching: true
            };
        // case "LOADING_USERS_ADDRESS":
        //     return {
        //         ...state,
        //         loadingAddress: true
        //     };
        case "LOADED_USERS":
            action.payload.result.map(i => {
                i.isactive = i.isactive == 1 ? true : false;
                i.isrefactive = i.isrefactive == 1 ? true : false;
                i.isblocked = i.isblocked == 1 ? true : false;
            })
            // if (!state.current)
            //     state.current = action.payload.result?.length > 0 ? action.payload.result[0] : null;
            // replaceNullObject(state.current)
            return {
                ...state,
                items: action.payload.result,
                isFetching: false
            };
        // case "LOAD_USER_ADDRESS":
        //     return {
        //         ...state,
        //         address: action.payload.result,
        //         loadingAddress: false
        //     }
        case "CURRENT_USER":
            let cu = state.items.find(f => f.id === action.payload.result)
            // replaceNullObject(cu)
            return {
                ...state,
                current: cu,
                isFetching: false
            };
        case "USERS_FAILED":
            return {
                ...state,
                current: null,
                isFetching: false,
                loadingAddress: false
            };
        case "USERS_DONE":
            return {
                ...state,
                current: null,
                isFetching: false
            };
        // case "LOADING_USERS_ADDRESS_DONE":
        //     return {
        //         ...state,
        //         loadingAddress: false
        //     }
        default:
            return state
    }
}

// const replaceNullObject = (obj) => {
//     console.log(Object.keys(obj))
//     console.log(Object.values(obj))
// }

export { User, UserReducer }