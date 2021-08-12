import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { getRole } from './../../Utils/apputils';

import './header.css';

export default function Header() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { state } = useContext(AuthContext);
    let user = state.auth.user;
    return (
        <header>
            <div>
                <h2>
                    <label htmlFor="nav-toggle">
                        <span className="las la-bars"></span>
                    </label>
                </h2>
            </div>
            {/* <div className="search-wrapper"><span className="las la-search"></span>
                <input type="search" placeholder="search..." />
            </div> */}
            <div className="user-wrapper">
                <div className="usernrole"><div>{user.name}</div><div style={{ textAlign: 'end' }}><small>({getRole(user.role)})</small></div></div>
                <div><img src={`${PF}/${user.profilePicture !== null ? user.profilePicture : 'noAvatar.png'}`} alt="" /></div>
            </div>
        </header>
    )
}
