const Item = {
    items: [],
    selected: [],
    current: null,
    count: 0,
    isFetching: false,
    isSaved: false,
    sucessMessage: null,
    searchfilter: null
}

const ItemReducer = (state, action) => {
    let result = null;
    switch (action.type) {
        case "ITEMS_LOADING":
            return {
                ...state,
                isFetching: true,
                isSaved: false,
                sucessMessage: null
            };
        case "ITEMS_SUCCESS":
            return {
                items: action.payload.result,
                isFetching: false,
                count: action.payload.result.length,
                current: null,
                selected: []
            };
        case "ITEMS_SEARCH":
            return {
                ...state,
                isFetching: true,
                searchfilter: action.payload.result
            };
        case "ITEMS_SAVED":
            return {
                ...state,
                items: [...state.items, action.payload.result],
                isFetching: false,
                current: null,
                isSaved: true,
                sucessMessage: action.payload.sucessMessage
            };
        case "CURRENT_ITEMS":
            result = state.items.find(data => data.id === action.payload.result);
            return {
                ...state,
                current: result,
                isFetching: false
            };
        case "ITEMS_DELETED":
            result = state.items.filter(data => data.id !== action.payload.result);
            return {
                ...state,
                items: result,
                isFetching: false,
                current: null,
                isSaved: true,
                sucessMessage: action.payload.sucessMessage
            };
        case "ITEMS_UPDATED":

            return {
                ...state,
                isFetching: false,
                isSaved: true,
                sucessMessage: action.payload.sucessMessage
            };
        case "ITEMS_SELECT_TOGGLE":
            let isItem = state.selected?.indexOf(action.payload.result) > -1;
            return {
                ...state,
                selected: isItem ? state.selected.filter(f => f !== action.payload.result) : [...state.selected, action.payload.result]
            };
        case "ITEMS_FAILURE":
            return {
                ...state,
                isFetching: false,
                current: null
            };
        default:
            return state;
    }
};

export { Item, ItemReducer };
