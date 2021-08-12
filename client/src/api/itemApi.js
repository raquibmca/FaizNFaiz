import axios from "axios"

export const loadItems = async (dispatch) => {
    dispatch({ type: "ITEMS_LOADING" });
    try {
        const res = await axios.get("/item");
        await dispatch({ type: "ITEMS_SUCCESS", payload: { result: res.data } });
        return res.data;
    } catch (err) {
        dispatch({ type: "ITEMS_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
};

export const toggleSelectItem = async (id, dispatch) => {
    dispatch({ type: "ITEMS_LOADING" });
    try {
        await dispatch({ type: "ITEMS_SELECT_TOGGLE", payload: { result: id } });
    } catch (err) {
        dispatch({ type: "ITEMS_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
};

// export const deselectItem = async (id, dispatch) => {
//     dispatch({ type: "ITEMS_LOADING" });
//     try {
//         await dispatch({ type: "ITEMS_DESELECT", payload: { result: id } });
//     } catch (err) {
//         dispatch({ type: "ITEMS_FAILURE" });
//         // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
//     }
// };


// export const loadItemsById = async (id, dispatch) => {
//     dispatch({ type: "ITEMS_LOADING" });
//     try {
//         await dispatch({ type: "CURRENT_ITEMS", payload: { result: id } });
//     } catch (err) {
//         dispatch({ type: "ITEMS_FAILURE" });
//         // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
//     }
// };

// export const saveBulkItem = async (data, dispatch) => {
//     dispatch({ type: "ITEMS_LOADING" });
//     try {
//         await axios.post("/item", data);
//         await dispatch({
//             type: "ITEMS_SAVED", payload: { result: data }
//         });
//         dispatch({ type: "SET_SUCCESS", payload: { message: 'Items Saved Sucessfully' } });
//     } catch (err) {
//         dispatch({ type: "ITEMS_FAILURE" });
//         // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
//     }
// };

// export const deleteItem = async (data, dispatch) => {
//     dispatch({ type: "ITEMS_LOADING" });
//     try {
//         await axios.delete(`/item/${data.id}`);
//         await dispatch({ type: "ITEMS_DELETED", payload: { result: data.id } });
//         dispatch({ type: "SET_SUCCESS", payload: { message: `Items (${data.name}) Deleted Sucessfully` } });

//     } catch (err) {
//         dispatch({ type: "ITEMS_FAILURE" });
//         // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
//     }
// };

// export const updateItem = async (id, data, dispatch) => {
//     dispatch({ type: "ITEMS_LOADING" });
//     try {
//         await axios.put(`/item/${id}`, data);
//         await dispatch({ type: "ITEMS_UPDATED", payload: { result: data, id: id } });
//         dispatch({ type: "SET_SUCCESS", payload: { message: 'Items Updated Sucessfully' } });
//     } catch (err) {
//         dispatch({ type: "ITEMS_FAILURE" });
//         // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
//     }
// };

// export const searchItems = async (data, dispatch) => {
//     dispatch({ type: "ITEMS_SEARCH", payload: { result: data } });
//     try {
//         let res = await axios.post(`/item/search`, data);
//         await dispatch({ type: "ITEMS_SUCCESS", payload: { result: res.data } });
//         // dispatch({ type: "SET_SUCCESS", payload: { message: 'Items Updated Sucessfully' } });
//     } catch (err) {
//         dispatch({ type: "ITEMS_FAILURE" });
//         // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
//     }
// };

// // export const getItemByCategory = async (id, dispatch) => {
// //     dispatch({ type: "ITEMS_LOADING" });
// //     try {
// //         let res = await axios.put(`/item/${id}`);
// //         await dispatch({ type: "ITEMS_UPDATED", payload: { result: res.data } });
// //     } catch (err) {
// //         dispatch({ type: "ITEMS_FAILURE" });
// //         dispatch({ type: "SET_ERROR", payload: { message: err.message } });
// //     }
// // };


// export const itemgridschema = {
//     columns: [
//         { name: 'id', text: 'id', type: 'string', render: false },
//         { name: 'categoryname', text: 'Category', type: 'string' },
//         { name: 'itemcode', text: 'Code', type: 'string' },
//         { name: 'itemname', text: 'Name', type: 'string' },
//         { name: 'rate', text: 'Rate', type: 'money' },
//     ]
// };
