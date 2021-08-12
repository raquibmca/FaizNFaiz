const Category = {
    items: [],
    current: null,
    count: 0,
    isFetching: false,
    isSaved: false,
    sucessMessage: null
}

const CategoryReducer = (state, action) => {
    let result = null;
    switch (action.type) {
        case "CATEGORY_LOADING":
            return {
                ...state,
                isFetching: true,
                isSaved: false,
                sucessMessage: null
            };
        case "CATEGORY_SUCCESS":
            return {
                ...state,
                items: action.payload.result,
                count: action.payload.result.count,
                isFetching: false,
                current: null
            };
        case "CATEGORY_SAVED":
            return {
                ...state,
                items: [...state.items, action.payload.result],
                count: state.items.count,
                isFetching: false,
                current: null,
                isSaved: true,
                sucessMessage: action.payload.sucessMessage

            };
        case "CURRENT_CATEGORY":
            result = state.items.find(data => data.id === action.payload.result);
            return {
                ...state,
                current: result,
                isFetching: false
            };
        case "CATEGORY_DELETED":
            result = state.items.filter(data => data.id !== action.payload.result);
            return {
                ...state,
                items: result,
                isFetching: false,
                current: null,
                isSaved: true,
                sucessMessage: action.payload.sucessMessage
            };
        case "CATEGORY_UPDATED":
            return {
                ...state,
                isFetching: false,
                isSaved: true,
                sucessMessage: action.payload.sucessMessage
                // current: null
            }
        case "CATEGORY_FAILURE":
            return {
                ...state,
                isFetching: false,
                current: null
            };
        default:
            return state;
    }
};

export {
    Category,
    CategoryReducer
}
