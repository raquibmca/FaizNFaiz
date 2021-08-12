import axios from "axios";
// import { JSONObject } from "../Utils/apputils";

export const loadAddress = async (id, dispatch) => {
    dispatch({ type: "PCOCESS_ADDRESS" });
    try {
        const resposne = await axios.get(`/address/${id}`);
        dispatch({ type: "LOAD_ADDRESS", payload: { result: resposne.data } });
    } catch (error) {
        dispatch({ type: "ADDRESS_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const deleteAddress = async (id, dispatch) => {
    dispatch({ type: "PCOCESS_ADDRESS" });
    try {
        await axios.delete(`/address/${id}`);
        dispatch({ type: "DELETE_ADDRESS", payload: { result: id } });
    } catch (error) {
        dispatch({ type: "ADDRESS_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const addAddress = async (data, id, dispatch) => {
    // let data1 = JSONObject(data);
    await dispatch({ type: "PCOCESS_ADDRESS" });
    try {
        const response = await axios.post(`/address/${id}`, data);
        await dispatch({ type: "ADDRESS_SUCCESS", payload: { result: response.data } });
        return true;
    } catch (error) {
        await dispatch({ type: "ADDRESS_FAILURE" });
        // await dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const updateAddress = async (data, id, dispatch) => {
    // let data1 = JSONObject(data);
    dispatch({ type: "PCOCESS_ADDRESS" });
    try {
        const resposne = await axios.put(`/address/${id}`, data);
        await dispatch({ type: "ADDRESS_UPDATE", payload: { result: resposne.data } });
        return true;
    } catch (error) {
        await dispatch({ type: "ADDRESS_FAILURE" });
        // await dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const setDefaultAddress = async (id, userid, dispatch) => {
    // dispatch({ type: "PCOCESS_ADDRESS" });
    try {
        await axios.put(`/address/setactive/${id}`, { userid: userid });
        await dispatch({ type: "ACTIVE_ADDRESS_UPDATE", payload: { result: id } });
    } catch (error) {
        dispatch({ type: "ADDRESS_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const getDefaultAddress = async (id, dispatch) => {
    // dispatch({ type: "PCOCESS_ADDRESS" });
    try {
        // let response = await axios.get(`/address/activeaddress/22`);
        let response = await axios.get(`/address/activeaddress/${id}`);
        if (response.data?.length === 0)
            dispatch({ type: "SET_ERROR", payload: { message: `You don't have any active address.` } });
        else
            await dispatch({ type: "SET_ACTIVE_CURRENT_ADDRESS", payload: { result: response.data } });
    } catch (error) {
        dispatch({ type: "ADDRESS_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const setCurrentAddress = async (id, dispatch) => {
    await dispatch({ type: "SET_CURRENT_ADDRESS", payload: { result: id } });
}