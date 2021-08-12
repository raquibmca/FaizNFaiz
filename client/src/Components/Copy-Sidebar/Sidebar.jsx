import React from 'react'
import './sidebar.css';

export default function Sidebar() {
    return (
        <React.Fragment>
            <input type="checkbox" id="nav-toggle" />
            <div className="sidebar">
                <div className="sidebar-brand">
                    <h2><span className="lab la-accusoft"></span><span>Precious Stone</span></h2>
                </div>
                <div className="sidebar-menu">
                    <ul>
                        <li><a href="" className="active"><span className="las la-igloo"></span><span>Dashboard</span></a></li>
                        <li><a href=""><span className="las la-users"></span><span>Customers</span></a></li>
                        <li><a href=""><span className="las la-clipboard-list"></span><span>Projects</span></a></li>
                        <li><a href=""><span className="las la-dolly"></span><span>Orders</span></a></li>
                        <li><a href=""><span className="las la-receipt"></span><span>Inventory</span></a></li>
                        <li><a href=""><span className="las la-user-circle"></span><span>Accounts</span></a></li>
                        <li><a href=""><span className="las la-tasks"></span><span>Tasks</span></a></li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )
}
