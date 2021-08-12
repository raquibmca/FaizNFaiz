import React, { useRef } from 'react'
import { useHistory } from "react-router";
import axios from 'axios';
import { checkavaibility } from '../../api/userApi';
import { useContext } from 'react';
import { AuthContext } from './../../Context/AuthContext';
import Loader from './../../Components/Common/loader/Loader';
import { onlyNumericField } from '../../Utils/apputils';
import { ROLE_USER } from '../../Constant/Role';
import './login.css';

export default function Register() {
    const mobileno = useRef();
    const name = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const history = useHistory();
    const { state, dispatch } = useContext(AuthContext)

    const handleClick = async (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match!");
        } else {
            const user = {
                username: mobileno.current.value,
                name: name.current.value,
                password: password.current.value,
                role: ROLE_USER,
                isActive: 1
            };
            try {
                // if (state.auth.userAvailable) {
                await axios.post("/auth/register", user);
                history.push("/login");
                // } else {
                //     alert('User not availabel')
                // }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const loginForm = () => {
        history.push("/login");
    }

    const checkUserAvaibility = async () => {
        if (mobileno.current.value?.length > 0)
            await checkavaibility(mobileno.current.value, dispatch)
    }

    return (
        <div className="loginpanel">

            <div className="loginpanelWrapper loginpanelWrapperRegister">
                <form className="login" onSubmit={handleClick}>
                    <div className="loader-pos">
                        {state.auth.isFetching && <Loader />}
                        <span className="errMessage">{state.error.errorMessage}</span>
                    </div>
                    <input
                        name="mobileno"
                        placeholder="Mobile Number"
                        required
                        ref={mobileno}
                        className="inputbox"
                        maxLength="10"
                        minLength="10"
                        onChange={onlyNumericField}
                        onBlur={checkUserAvaibility}
                    />
                    <input
                        placeholder="Name"
                        required
                        name="name"
                        ref={name}
                        className="inputbox"
                        type="text"
                        maxLength="50"
                        minLength="2"
                    />
                    <input
                        placeholder="Password"
                        required
                        ref={password}
                        className="inputbox"
                        type="password"
                        maxLength="20"
                        minLength="8"

                    />
                    <input
                        placeholder="Password Again"
                        required
                        ref={passwordAgain}
                        className="inputbox"
                        type="password"
                        maxLength="20"
                        minLength="8"

                    />
                    <button disabled={state.auth.isFetching} className="btn btn-primary loginButton" type="submit">
                        Sign Up
                    </button>
                    <span className="loginForgot" onClick={loginForm} >Log into Account</span>
                </form>
            </div>
        </div>
    )
}
