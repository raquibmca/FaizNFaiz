import React, { useContext, useEffect } from 'react'
import { loadAdminDashboardData } from '../../../api/dashboard';
import { AuthContext } from '../../../Context/AuthContext';
import { formatter } from './../../../Utils/apputils';

export default function AdminDashboard() {
    const { state, dispatch } = useContext(AuthContext)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        loadAdminDashboardData(state.auth.user.id, dispatch);
    }, []);
    let dashboard = state.dashboard.admin;
    return (
        <main>
            <div className="cards">
                <div className="card-single">
                    <div>
                        <h4>{state.dashboard.admin.OrderCount}</h4>
                        <span>Orders</span>
                    </div>
                    <div><span className="las la-dolly-flatbed"></span></div>
                </div>
                <div className="card-single">
                    <div>
                        <h4>{state.dashboard.admin.ReferalUserCount}</h4>
                        <span>Referal User Count</span>
                    </div>
                    <div><span className="las la-project-diagram"></span></div>
                </div>
                <div className="card-single">
                    <div>
                        <h4>{state.dashboard.admin.ReferalCount}</h4>
                        <span>Referal Count</span>
                    </div>
                    <div><span className="las la-users"></span></div>
                </div>
                <div className="card-single">
                    <div>
                        <h4>{formatter.format(state.dashboard.admin.DeliveryCharges)}</h4>
                        <span>Delivery Charges</span>
                    </div>
                    <div><span className="las la-coins"></span></div>
                </div>

                <div className="card-single">
                    <div>
                        <h4>{formatter.format(state.dashboard.admin.ReferalDiscount * -1)}</h4>
                        <span>Referal Discount</span>
                    </div>
                    <div><span className="las la-hand-holding-usd"></span></div>
                </div>
                <div className="card-single">
                    <div>
                        <h4>{formatter.format(state.dashboard.admin.ServiceCharge)}</h4>
                        <span>Service Charges</span>
                    </div>
                    <div><span className="las la-money-bill"></span></div>
                </div>
                <div className="card-single">
                    <div>
                        <h4>{formatter.format(state.dashboard.admin.NetAmount)}</h4>
                        <span>Revenue</span>
                    </div>
                    <div><span className="las la-wallet"></span></div>
                </div>
            </div>
            <div className="recent-grid">
                <div className="projects">
                    <div className="card">
                        <div className="card-header">
                            <h4>Top Items</h4>
                            {/* <button className="btn btn-info">See all
                                <span className="las la-arrow-right"></span>
                            </button> */}
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table width="100%">
                                    <thead>
                                        <tr>
                                            <td>Item Name</td>
                                            <td>Total Order</td>
                                            <td>Total Quantity</td>
                                            <td>Total Amount</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            state.dashboard.admin?.topItems.map(item =>
                                                <tr>
                                                    <td>{item.ItemName}</td>
                                                    <td>{item.Count}</td>
                                                    <td>
                                                        {/* <span className="status purple"></span> */}
                                                        {item.TotalQty}
                                                    </td>
                                                    <td>{formatter.format(item.Amount)}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* <div className="card">
                        <div className="card-header">
                            <h4>Prime Customers</h4>
                             <button className="btn btn-info">See all
                                <span className="las la-arrow-right"></span>
                            </button> 
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table width="100%">
                                    <thead>
                                        <tr>
                                            <td>Customer Name</td>
                                            <td>Total Order</td>
                                            <td>Total Quantity</td>
                                            <td>Total Amount</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            state.dashboard.admin?.primeCustomer.map(item =>
                                                <tr>
                                                    <td>{item.UserName}</td>
                                                    <td>{item.Count}</td>
                                                    <td>
                                                         <span className="status purple"></span> 
                                                        {item.TotalQty}
                                                    </td>
                                                    <td>{formatter.format(item.Amount)}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> */}
                </div>
                {/* <div className="projects">
                   
                </div> */}
                <div className="customers">
                    <div className="card">
                        <div className="card-header">
                            <h4>Prime Customer</h4>
                            {/* <button>See all
                                <span className="las la-arrow-right"></span>
                            </button> */}
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table width="100%">
                                    <thead>
                                        <tr>
                                            <td></td>
                                            <td>Customer Name</td>
                                            <td>Total Order</td>
                                            <td>Total Quantity</td>
                                            <td>Total Amount</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            state.dashboard.admin?.primeCustomer.map(item =>
                                                <tr>
                                                    <td className="user-wrapper"><img src={`${PF}/${item.ProfilePicture !== null ? item.ProfilePicture : 'noAvatar.png'}`} alt="" /></td>
                                                    <td>{item.UserName}</td>
                                                    <td>{item.Count}</td>
                                                    <td>
                                                        {item.TotalQty}
                                                    </td>
                                                    <td>{formatter.format(item.Amount)}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {/* <div className="customer">
                                <div className="info">
                                    <img src="images/raquib.jpg" width="40px" height="40px" alt="" />
                                    <div>
                                        <h4>Lewis S. Cunningham</h4>
                                        <small>SEO Expert</small>
                                    </div>
                                </div>
                                <div className="contact">
                                    <span className="las la-user-circle"></span>
                                    <span className="las la-comment"></span>
                                    <span className="las la-phone"></span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
