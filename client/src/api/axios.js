import axios from 'axios';

const interceptor = (dispatch) => {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        dispatch({ type: "CLEAR_ALL" });
        // console.log(dispatch);
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Do something with response data
        // console.log(response)
        return response;
    }, function (error) {
        console.log(error.response)
        if (error.response.data?.hasError)
            dispatch({ type: "SET_ERROR", payload: { message: error.response.data.errorMessage } });
        else
            dispatch({ type: "SET_ERROR", payload: { message: error.message } });
        return Promise.reject(error);
    });
}

export default { interceptor };