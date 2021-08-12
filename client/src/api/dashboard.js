import axios from "axios"

export const loadAdminDashboardData = async (id, dispatch) => {
    dispatch({ type: "DASHBOARD_LOADING" });
    try {
        const res = await axios.get(`/dashboard/${id}`);
        await dispatch({ type: "ADMIN_DASHBOARD_DATA", payload: { result: res.data } });
    } catch (err) {
        dispatch({ type: "DASHBOARD_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
};

export const loadUserDashboardData = async (id, dispatch) => {
    dispatch({ type: "DASHBOARD_LOADING" });
    try {
        const res = await axios.get(`/dashboard/${id}`);
        await dispatch({ type: "USER_DASHBOARD_DATA", payload: { result: res.data } });
    } catch (err) {
        dispatch({ type: "DASHBOARD_FAILURE" });
        // dispatch({ type: "SET_ERROR", payload: { message: err.message } });
    }
};


