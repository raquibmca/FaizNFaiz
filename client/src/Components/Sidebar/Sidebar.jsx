import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from './../../Context/AuthContext';
import { logoutCall } from '../../api/userApi';

import './sidebar.css';
import { ROLE_ADMIN, ROLE_USER } from './../../Constant/Role';

export default function Sidebar() {
    const { state, dispatch } = useContext(AuthContext);
    const handleLogout = () => {
        logoutCall(dispatch);
    }

    return (
        <React.Fragment>
            <input type="checkbox" id="nav-toggle" />
            <div className="sidebar">
                {/* <div className="sidebar-brand">
                    <h2><span className="lab la-accusoft"></span><span>Precious Stone</span></h2>
                </div> */}
                <div className="sidebar-menu">
                    <ul>
                        <li><Link to="/dashboard"><span className="las la-home"></span><span>Home</span></Link></li>
                        <li><Link to="/order/neworder"><span className="las la-plus"></span><span>New Order </span></Link></li>
                        {/* <li><Link to="/order/orderstatus"><span className="las la-list"></span><span>Orders Status</span></Link></li> */}
                        <li><Link to="/order/orderhistory"><span className="las la-list-alt"></span><span>Orders History</span></Link></li>
                        {/* <li><Link to="/address/list"><span className="las la-envelope"></span><span>Change/Add Address</span></Link></li> */}
                        {
                            state.auth.user.role === ROLE_ADMIN && <>

                                <li><Link to="/order/status"><span className="las la-tasks"></span><span>Update Order Status</span></Link></li>
                                <li><Link to="/order/track"><span className="las la-route"></span><span>Track Order</span></Link></li>
                                <li><Link to="/managecategory"><span className="las la-object-group"></span><span>Manage Category</span></Link></li>
                                <li><Link to="/manageitems"><span className="las la-stream"></span><span>Manage Items</span></Link></li>
                                <li><Link to="/manageitems/seacrh"><span className="las la-search"></span><span>Search Items</span></Link></li>
                                <li><Link to="/user/manage"><span className="las la-users"></span><span>Manage Users</span></Link></li>
                            </>
                        }
                        {/* <li><Link to="/user/changepassword"><span className="las la-key"></span><span>Change Password</span></Link></li> */}
                        <li><Link to="/user/profile"><span className="las la-user-edit"></span><span>Profile</span></Link></li>
                        <li><a href="/login" onClick={handleLogout}><span className="las la-sign-out-alt"></span><span>Logout</span></a></li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )
}
