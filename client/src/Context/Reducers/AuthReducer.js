import jwt from 'jwt-decode';
import { decrypt } from '../../Utils/cipher';
import jsonwebtoken from 'jsonwebtoken';


const Auth = {
    user: localStorage.getItem("token") !== null ? jwt(localStorage.getItem("token")) : null,
    token: localStorage.getItem("token") || null,
    isFetching: false,
    isLogout: false,
    orderCharges: localStorage.getItem("ordercharge") !== null ? JSON.parse(decrypt(localStorage.getItem("ordercharge"))) : null,
    userAvailable: null
};

const AuthReducer = (state, action) => {
    let newuser = null;
    switch (action.type) {
        case "LOGIN_START":
            console.log('LOGIN_START')
            return {
                ...state,
                user: null,
                isFetching: true,
                userAvailable: null
            };
        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isFetching: false,
                orderCharges: action.payload.orderCharges
            };
        case "LOGIN_FAILURE":
            return {
                ...state,
                user: null,
                token: null,
                isFetching: false,
            };
        case "LOGOUT_USER":
            localStorage.removeItem("token");
            localStorage.removeItem("ordercharge")
            return {
                ...state,
                isLogout: true,
                user: null,
                token: null,
                isFetching: false,
            };
        case "UPDATETING_USER":
            return {
                ...state,
                isFetching: true,
                userAvailable: null,
            }
        case "USER_UPDATED":
            newuser = {
                ...state.user,
                dateofbirth: action.payload.dateofbirth,
                email: action.payload.email,
                gender: action.payload.gender,
                questionhint: action.payload.questionhint,
                userhint: action.payload.userhint,
                name: action.payload.name
            };
            updateUserToken(newuser);
            return {
                ...state,
                user: newuser,
                isFetching: false,
                userAvailable: null,
            };
        case "UPDATING_PROFILE":
            let newuser = { ...state.user, profilePicture: action.payload.result }
            // console.log(newuser)
            updateUserToken(newuser);
            return {
                ...state,
                user: newuser,
                isFetching: false
            };
        case "RESET_FETCH":
            return {
                ...state,
                isFetching: false,
                userAvailable: null
            };
        case "USER_AVAIABILITY":
            return {
                ...state,
                userAvailable: !action.payload.result,
                isFetching: false
            };
        default:
            return state;
    }
};

const updateUserToken = async (user) => {
    const token = await jsonwebtoken.sign(user, //process.env.TOKEN_SECERET_KEY);
        "61bf7c3737b24be44b2f60401e8025d459a22d87a19b8173c98f2bd4fc48fe4ffd94fc6589b775c93643758097ddf50e86c5397657aa2faabc108a92f46f65b4"
    );
    await localStorage.setItem("token", token)
}

export { Auth, AuthReducer };
