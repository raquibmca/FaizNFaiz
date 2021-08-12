import axios from "axios"
import jwt from 'jwt-decode';

export const loginCall = async (userCredential, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post("/auth/login", userCredential);
        let user = jwt(res.data.token);
        dispatch({
            type: "LOGIN_SUCCESS", payload: {
                user: user,
                token: res.data.token,
                orderCharges: res.data.otherDetail
            }
        });

    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE" });
        if (err.response.data.hasError)
            dispatch({ type: "SET_ERROR", payload: { message: err.response.data.errorMessage } });
    }
};

export const checkavaibility = async (username, dispatch) => {
    dispatch({ type: "UPDATETING_USER" });
    try {
        const res = await axios.get(`/user/isavailable/${username}`);
        await dispatch({ type: "USER_AVAIABILITY", payload: res.data });
    } catch (error) {
        dispatch({ type: "RESET_FETCH" });
        // dispatch({ type: "SET_ERROR", payload: { message: 'User with this number already exist.' } });
    }
};

export const logoutCall = async (dispatch) => {
    await dispatch({ type: "LOGOUT_USER" });
};

export const clearMessage = async (dispatch) => {
    await dispatch({ type: "CLEAR_MESSAGE" });
};

export const updatePassword = async (data, dispatch) => {
    dispatch({ type: "UPDATETING_PASSWORD" });
    try {
        const res = await axios.put(`/user/changepassword/${data.userid}`, data);
        if (res.data.hasError) {
            dispatch({ type: "SET_ERROR", payload: { message: res.data.errorMessage } });
            return false;
        }
        else {
            // dispatch({ type: "PASSWORD_UPDATED", payload: res.data });
            dispatch({ type: "SET_SUCCESS", payload: { message: 'Password Changed Sucessfully' } });
            return true;
        }
    } catch (error) {
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const updateUser = async (id, data, dispatch) => {
    dispatch({ type: "UPDATETING_USER" });
    try {
        const res = await axios.put(`/user/${id}`, data);
        await dispatch({ type: "USER_UPDATED", payload: res.data });
        dispatch({ type: "SET_SUCCESS", payload: { message: 'User Detail Updated Sucessfully' } });
        return true;
    } catch (error) {
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const updateProfilePicture = async (id, file, dispatch) => {
    console.log(id, file)
    dispatch({ type: "UPDATETING_USER" });
    try {
        let formData = new FormData();
        formData.append("images", file);
        const res = await axios.post(`/user/upload/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        if (res.data) {
            await axios.put(`/user/updateprofile/${id}`, { filename: res.data.filename });
            await dispatch({ type: "UPDATING_PROFILE", payload: { result: res.data.filename } });
            await dispatch({ type: "SET_SUCCESS", payload: { message: 'Profile Picture Updated Sucessfully' } });
            dispatch({ type: "CLEAR_SUCCESS" })
        }
        await dispatch({ type: "RESET_FETCH" })
    } catch (error) {
        await dispatch({ type: "RESET_FETCH" })
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const removeProfilePicture = async (id, dispatch) => {
    dispatch({ type: "UPDATETING_USER" });
    try {
        await axios.put(`/user/updateprofile/${id}`, { filename: null });
        await dispatch({ type: "UPDATING_PROFILE", payload: { result: null } });
        dispatch({ type: "SET_SUCCESS", payload: { message: 'Profile Picture Removed' } });
    } catch (error) {
        await dispatch({ type: "RESET_FETCH" })
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const loadUsers = async (dispatch) => {
    dispatch({ type: "LOADING_USERS" });
    try {
        let response = await axios.get(`/user/getAll/`);
        await dispatch({ type: "LOADED_USERS", payload: { result: response.data } });
    } catch (error) {
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const setCurrentUser = async (id, dispatch) => {
    dispatch({ type: "LOADING_USERS" });
    try {
        // let response = await axios.get(`/user/getAll/`);
        await dispatch({ type: "CURRENT_USER", payload: { result: id } });
    } catch (error) {
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const updateUserFlags = async (id, data, dispatch) => {
    dispatch({ type: "LOADING_USERS" });
    try {
        await axios.put(`/user/block/${id}`, data);
        await dispatch({ type: "USERS_DONE" });
        dispatch({ type: "SET_SUCCESS", payload: { message: 'User Settings Updated Sucessfully' } });
    } catch (error) {
        // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
    }
}

export const loadAddress = async (id) => {
    try {
        const resposne = await axios.get(`/address/${id}`);
        return resposne.data;
    } catch (error) {
    }
}

export const loadUserActivity = async (id) => {
    try {
        const resposne = await axios.get(`/user/activity/${id}`);
        return resposne.data;
    } catch (error) {
    }
}

// export const blockUserReferal = async (id, userId, dispatch) => {
//     dispatch({ type: "LOADING_USERS" });
//     try {
//         let response = await axios.put(`/user/blockreferal/${id}`, userId);
//         await dispatch({ type: "USERS_DONE" });
//     } catch (error) {
//         // dispatch({ type: "SET_ERROR", payload: { message: error.message } });
//     }
// }

export const userGridSchema = {
    columns: [
        { name: 'id', text: 'id', type: 'primary', render: false },
        { name: 'profilepicture', text: 'Picture', type: 'image' },
        { name: 'username', text: 'User Name', type: 'string' },
        { name: 'name', text: 'Name', type: 'string' },
        { name: 'gender', text: 'Gender', type: 'string' },
        { name: 'email', text: 'Email', type: 'string', render: false },
        { name: 'dob', text: 'Birth Date', type: 'date', render: false },
        { name: 'joindate', text: 'Joined On', type: 'date', render: false },
        { name: 'lastlogin', text: 'Last Login', type: 'date', render: false }
    ]
}


export const userActivityGridSchema = {
    columns: [
        { name: 'type', text: 'Activity Type', type: 'string' },
        { name: 'remarks', text: 'Comment', type: 'string' },
        { name: 'createdat', text: 'Updated On', type: 'datetime' },
        { name: 'name', text: 'Updated By', type: 'string' }
    ]
}


