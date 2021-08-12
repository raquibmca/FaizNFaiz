import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { loadUserDashboardData } from '../../../api/dashboard';
import { AuthContext } from '../../../Context/AuthContext';
import './userdashboard.css';
import { formatter } from './../../../Utils/apputils';

export default function Dashboard() {
    const { state, dispatch } = useContext(AuthContext)
    const history = useHistory();
    useEffect(() => {
        loadUserDashboardData(state.auth.user.id, dispatch);
    }, []);

    return (
        <main>
            <div className="cards">
                <div className="card-single">
                    <div>
                        <h4>{state.dashboard.user?.userRefCount}</h4>
                        <span>Used Ref-Code</span>
                    </div>
                    <div><span className="las la-users"></span></div>
                </div>
                <div className="card-single">
                    <div>
                        <h4>{state.dashboard.user?.completeOrderCount}</h4>
                        <span>Completed Order</span>
                    </div>
                    <div><span className="las la-clipboard"></span></div>
                </div>
                <div className="card-single">
                    <div>
                        <h4>{state.dashboard.user?.inprocessOrderCount}</h4>
                        <span>Booked Order</span>
                    </div>
                    <div><span className="las la-project-diagram"></span></div>
                </div>
                <div className="card-single">
                    <div>
                        <h4>{formatter.format(state.dashboard.user?.currentBill)}</h4>
                        <span>Current Bill Amount</span>
                    </div>
                    <div><span className="las la-wallet"></span></div>
                </div>
            </div>
            <div className="dash-nav-links">
                <div className="single-nav-link" onClick={e => history.push("/order/neworder")}>
                    <span>New Order</span>
                    <span className="las la-plus"></span>
                </div>
                <div className="single-nav-link" onClick={e => history.push("/order/orderstatus")}>
                    <span>Order Status</span>
                    <span className="las la-list"></span>
                </div>
                <div className="single-nav-link" onClick={e => history.push("/order/orderhistory")}>
                    <span>Order History</span>
                    <span className="las la-list-alt"></span>
                </div>
                <div className="single-nav-link" onClick={e => history.push("/user/profile")}>
                    <span>Edit Profile</span>
                    <span className="las la-user-edit"></span>
                </div>
                <div className="single-nav-link" onClick={e => history.push("/address/list")}>
                    <span>Manage Address</span>
                    <span className="las la-envelope"></span>
                </div>
                {/* <div className="single-nav-link">
                    <span>Change Password</span>
                    <span className="las la-key"></span>
                </div> */}
            </div>
        </main>
    )
}
