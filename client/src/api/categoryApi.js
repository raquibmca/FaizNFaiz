import axios from "axios"

export const loadItemsCategory = async (dispatch) => {
    dispatch({ type: "CATEGORY_LOADING" });
    try {
        const res = await axios.get(`/category`);
        await dispatch({ type: "CATEGORY_SUCCESS", payload: { result: res.data } });
    } catch (err) {
        dispatch({ type: "CATEGORY_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
};

export const saveBulkCategory = async (data, dispatch) => {
    dispatch({ type: "CATEGORY_LOADING" });
    try {
        await axios.post("/category", data);
        await dispatch({
            type: "CATEGORY_SAVED", payload: { result: data }
        });
        dispatch({ type: "SET_SUCCESS", payload: { message: 'Category Saved Sucessfully' } });
    } catch (err) {
        dispatch({ type: "CATEGORY_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
};

export const deleteItemCategory = async (id, dispatch) => {
    dispatch({ type: "CATEGORY_LOADING" });
    try {
        await axios.delete(`/category/${id}`);
        await dispatch({ type: "CATEGORY_DELETED", payload: { result: id } });
        dispatch({ type: "SET_SUCCESS", payload: { message: 'Category Deleted Sucessfully' } });
    } catch (err) {
        dispatch({ type: "CATEGORY_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
};

export const loadCategoryById = async (id, dispatch) => {
    dispatch({ type: "CATEGORY_LOADING" });
    try {
        // await axios.get(`/category/${id}`);
        await dispatch({ type: "CURRENT_CATEGORY", payload: { result: id } });
    } catch (err) {
        dispatch({ type: "CATEGORY_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
};

export const updateCategory = async (id, data, dispatch) => {
    dispatch({ type: "CATEGORY_LOADING" });
    try {
        await axios.put(`/category/${id}`, data);
        await dispatch({ type: "CATEGORY_UPDATED", payload: { result: data } });
        dispatch({ type: "SET_SUCCESS", payload: { message: 'Category Updated Sucessfully' } });
    } catch (err) {
        dispatch({ type: "CATEGORY_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
};


export const categorygridschema = {
    columns: [
        { name: 'id', text: 'id', type: 'string', render: false },
        { name: 'code', text: 'Code', type: 'string' },
        { name: 'name', text: 'Name', type: 'string' },
    ]
};
