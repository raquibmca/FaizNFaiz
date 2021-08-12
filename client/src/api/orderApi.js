import axios from "axios"


export const saveOrder = async (data, address, dispatch) => {
    dispatch({ type: "ORDER_LOADING" });
    try {
        if (!address)
            dispatch({ type: "SET_ERROR", payload: { message: `You don't have any active address.` } });
        else {
            const response = await axios.post(`/order/`, data);
            // console.log(response.data)
            dispatch({ type: "ORDER_SUCCESS", payload: { result: response.data } });
            dispatch({
                type: "SET_SUCCESS", payload: {
                    message: `Your order with no ${response.data.ordno} generated Sucessfully`
                }
            });
            await dispatch({ type: "REFCODE_CHECK_DONE" });
            return { ordno: response.data.ordno, orderid: response.data.orderid }
        }
    } catch (err) {
        dispatch({ type: "ORDER_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
}

export const getAddressById = async (id, dispatch) => {
    dispatch({ type: "ORDER_LOADING" });
    try {
        const resposne = await axios.get(`/address/byid/${id}`);
        dispatch({ type: "LOAD_ORDER_ADDRESS", payload: { result: resposne.data[0] } });
    } catch (error) {
        dispatch({ type: "ORDER_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const getOrders = async (data, dispatch) => {
    dispatch({ type: "ORDER_LOADING" });
    try {
        const response = await axios.post(`/order/getorder/`, data);
        // console.log(response.data)
        dispatch({ type: "GET_ORDER", payload: { result: response.data } });
    } catch (err) {
        dispatch({ type: "ORDER_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
}

export const getOrderStatus = async (dispatch) => {
    dispatch({ type: "ORDER_LOADING" });
    try {
        const response = await axios.get(`/order/orderstatus/`);
        // console.log(response.data)
        dispatch({ type: "ORDER_STATUS", payload: { result: response.data } });
    } catch (err) {
        dispatch({ type: "ORDER_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
}

export const verifyReferalCode = async (data, id, dispatch) => {
    dispatch({ type: "CLEAR_ERROR" });
    dispatch({ type: "REFCODE_CHECK_LOADING" });
    try {
        const response = await axios.get(`/user/verifyRefcode/${id}/${data.refCodeValue}`);
        if (response.data.hasError) {
            await dispatch({ type: "SET_ERROR", payload: { message: response.data.errorMessage } });
        } else {
            await dispatch({ type: "REFCODE_VALIDATED" });
        }
        return { error: response.data.hasError }
    } catch (err) {
        dispatch({ type: "REFCODE_CHECK_DONE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
}

// export const clearRefCode = async (dispatch) => {
//     dispatch({ type: "REFCODE_CHECK_DONE" });
// }

export const orderItemGridSchema = {
    columns: [
        { name: 'id', text: 'id', type: 'primary', render: false },
        { name: 'itemname', text: 'Item', type: 'string' },
        { name: 'rate', text: 'Rate', type: 'money' },
        { name: 'qty', text: 'Qty', type: 'float' },
        { name: 'amount', text: 'Amount', type: 'money' },
    ]
};