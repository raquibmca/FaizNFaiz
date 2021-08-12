const Address = {
    address: [],
    current: null,
    count: 0,
    isFetching: false,
}

const AddressReducer = (state, action) => {
    let result = null;
    switch (action.type) {
        case "LOAD_ADDRESS":
            return {
                address: action.payload.result,
                isFetching: false,
                count: action.payload.result.length
            };
        case "PCOCESS_ADDRESS":
            return {
                ...state,
                isFetching: true,
            };
        case "ADDRESS_SUCCESS":
            return {
                ...state,
                address: [...state.address, action.payload.result],
                isFetching: false,
            };
        case "SET_CURRENT_ADDRESS":
            result = state.address.find(data => data.Id === action.payload.result);
            return {
                ...state,
                current: result
            };
        case "SET_ACTIVE_CURRENT_ADDRESS":
            return {
                ...state,
                current: action.payload.result[0]
            }
        case "DELETE_ADDRESS":
            result = state.address.filter(data => data.Id !== action.payload.result);
            return {
                ...state,
                address: result,
                isFetching: false,
            };
        case "ADDRESS_UPDATE":
            return {
                ...state,
                isFetching: false,
            }
        case "ACTIVE_ADDRESS_UPDATE":
            result = state.address.findIndex(data => data.Id === action.payload.result);
            if (result > -1) {
                state.address.map(o => o.isactive = 0);
                state.address[result].isactive = 1;
                state.address.sort((a, b) => b.isactive - a.isactive)
            }
            return {
                ...state,
                isFetching: false,
            }
        case "ADDRESS_FAILURE":
            return {
                ...state,
                isFetching: false,
            };
        default:
            return state;
    }
};

export { Address, AddressReducer }
