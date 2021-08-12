const Order = {
    current: null,
    orderaddress: null,
    isFetching: false,
    items: [],
    orderStatus: [],
    isCheckRef: false,
    refCode: false
}

const OrderReducer = (state, action) => {
    switch (action.type) {
        case "ORDER_LOADING":
            return {
                ...state,
                isFetching: true,
            };
        case "ORDER_SUCCESS":
            return {
                ...state,
                isFetching: false,
                current: action.payload.result,
            };
        case "LOAD_ORDER_ADDRESS":
            return {
                ...state,
                orderaddress: action.payload.result
            };
        case "GET_ORDER":
            return {
                ...state,
                items: action.payload.result,
                isFetching: false,
            };
        case "ORDER_STATUS":
            return {
                ...state,
                orderStatus: action.payload.result,
                isFetching: false,
            };
        // case "ORDER_UPDATED":
        //     return {
        //         ...state,
        //         isFetching: false,
        //     }
        case "ORDER_FAILURE":
            return {
                ...state,
                isFetching: false,
            };
        case "REFCODE_CHECK_LOADING":
            return {
                ...state,
                isCheckRef: true,
                refCode: false
            };
        case "REFCODE_VALIDATED":
            return {
                ...state,
                isCheckRef: false,
                refCode: true
            };
        case "REFCODE_CHECK_DONE":
            return {
                ...state,
                isCheckRef: false,
                refCode: false
            };
        default:
            return state;
    }
};

export { Order, OrderReducer }
