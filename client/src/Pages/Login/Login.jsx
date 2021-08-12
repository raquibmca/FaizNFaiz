import React, { useRef, useContext } from 'react'
import { useHistory } from "react-router";
import { loginCall, clearMessage } from "../../api/userApi";
import './login.css';
import { AuthContext } from './../../Context/AuthContext';
import { onlyNumericField } from '../../Utils/apputils';
import Loader from './../../Components/Common/loader/Loader';

export default function Login() {
    const history = useHistory();
    const username = useRef();
    const password = useRef();
    const { state, dispatch } = useContext(AuthContext);
    const { isFetching } = state.auth;
    const { errorMessage } = state.error;

    const handleClick = (e) => {
        e.preventDefault();
        loginCall(
            { username: username.current.value, password: password.current.value },
            dispatch
        );
    };

    const textChangeHandler = () => {
        clearMessage(dispatch);
    }

    // const registerUser = () => {
    //     history.push("/register");
    // }
    return (
        <div className="loginpanel">
            <div className="loginpanelWrapper">
                <form className="login" onSubmit={handleClick}>
                    <div className="loader-pos">
                        {isFetching && <Loader />}
                    </div>
                    <span className="errMessage">{errorMessage}</span>
                    <input
                        ref={username}
                        className="inputbox"
                        placeholder="Mobile No."
                        type="text"
                        maxLength="10"
                        minLength="10"
                        required
                        disabled={isFetching}
                        onChange={textChangeHandler}
                        onKeyDown={onlyNumericField}
                    />
                    <input
                        ref={password}
                        className="inputbox"
                        placeholder="Password"
                        type="password"
                        required
                        maxLength="15"
                        minLength="6"
                        disabled={isFetching}
                        onChange={textChangeHandler}
                    />
                    <button className="btn btn-primary loginButton" type="submit" disabled={isFetching}>Log In</button>
                    {/* {!isFetching &&
                        <>
                            <span className="loginForgot" onClick={registerUser}>Forgot Password?</span>
                            <span className="loginForgot" onClick={registerUser}>Register</span>
                        </>
                    }
                    {isFetching &&
                        <>
                            <span>Forgot Password?</span>
                            <span>Register</span>
                        </>
                    } */}
                </form>
            </div>
        </div>
    )
}
