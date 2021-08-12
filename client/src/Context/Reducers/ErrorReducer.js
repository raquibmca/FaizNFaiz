const Error = {
    hasError: false,
    errorMessage: null,
    isSuccess: false,
    successMessage: null,
    isWarning: false,
    warningMessage: null,
    isInfo: false,
    infoMessage: null
}


const ErrorReducer = (state, action) => {
    switch (action.type) {
        case "CLEAR_ALL":
            return {
                hasError: false,
                errorMessage: null,
                isSuccess: false,
                successMessage: null,
                isWarning: false,
                warningMessage: null,
                isInfo: false,
                infoMessage: null
            }
        case "SET_ERROR":
            console.log(action.payload)
            return {
                hasError: true,
                errorMessage: action.payload.message
            };
        case "CLEAR_ERROR":
            return {
                hasError: false,
                errorMessage: null
            };
        case "SET_SUCCESS":
            return {
                isSuccess: true,
                successMessage: action.payload.message
            };
        case "CLEAR_SUCCESS":
            return {
                isSuccess: false,
                successMessage: null
            };
        case "SET_WARNING":
            return {
                isWarning: true,
                warningMessage: action.payload.message
            };
        case "CLEAR_WARNING":
            return {
                isWarning: false,
                warningMessage: null
            };
        case "SET_INFO":
            return {
                isInfo: true,
                infoMessage: action.payload.message
            };
        case "CLEAR_INFO":
            return {
                isInfo: false,
                infoMessage: null
            };
        default:
            return state;
    }
};

export { Error, ErrorReducer }
