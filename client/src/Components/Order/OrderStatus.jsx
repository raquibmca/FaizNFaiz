import React, { useLayoutEffect, useState } from 'react'
import CustomPanel from './../Common/Panel/CustomPanel';
import { useContext } from 'react';
import { AuthContext } from './../../Context/AuthContext';
import { getOrders } from './../../api/orderApi';
import Loader from '../Common/loader/Loader';
import { formatter } from './../../Utils/apputils';
import OrderStatusDD from '../Common/Panel/OrderStatusDD';
import { ROLE_ADMIN } from './../../Constant/Role';
import * as moment from 'moment';

import './orderstatus.css'
import ShowSearch from '../Common/ShowHideSearch/ShowSearch';

export default function OrderStatus({ orderStatus }) {
    const { state, dispatch } = useContext(AuthContext);
    const [oStatus, setOStatus] = useState(orderStatus);
    const [isShowSearch, setIsShowSearch] = useState(false);
    useLayoutEffect(() => {
        getOrders(
            {
                status: oStatus,
                uid: state.auth.user.role === ROLE_ADMIN ? undefined : state.auth.user.id
            },
            dispatch);
    }, [oStatus]);

    const handleStatusChange = (val) => {
        setOStatus(val);
    }

    const handleShowHideClick = (val) => {
        setIsShowSearch(val);
    }

    return (
        <CustomPanel
            headingText={`(${state.order.items?.length === undefined ? 0 : state.order.items.length}) Records found.`}
            righChild={<ShowSearch handleShowHideClick={handleShowHideClick} />}
        >
            {state.order.isFetching && <Loader />}

            <div className="order-status-main">
                {isShowSearch &&
                    <div className="order-search-panel">
                        <div className="form-group">
                            <div className="form-control-label">Order No</div>
                            <div><input type="text" className="form-control"></input></div>
                        </div>
                        <div className="form-group">
                            <div className="form-control-label">Order Date</div>
                            <div><input type="date" className="form-control"></input></div>
                        </div>
                        {state.auth.user.role === ROLE_ADMIN &&
                            <div className="form-group">
                                <div className="form-control-label">Customer Name</div>
                                <div>
                                    <input type="text" className="form-control"></input>
                                </div>
                            </div>
                        }
                        <div className="form-group">
                            <div className="form-control-label">Status</div>
                            <div>
                                <OrderStatusDD handleStatusChange={handleStatusChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="button-panel">
                                <div><button className="btn btn-warning">Search</button></div>
                                <div><button className="btn btn-info">Clear</button></div>
                                <div><button className="btn btn-secondary">Close</button></div>
                            </div>
                        </div>
                    </div>
                }
                {/* <div><button className="btn btn-primary">Show Search</button></div> */}
                {/* <div style={{ fontSize: '25px', flex: '1' }}><i className="las la-chevron-circle-down"></i></div> */}
                <table className="orderstatustable">
                    <thead>
                        <tr>
                            <td>Order No</td>
                            <td>Order Date</td>
                            {state.auth.user.role === ROLE_ADMIN && <td>Customer Name</td>}
                            <td>Item Count</td>
                            <td>Total Qty</td>
                            <td>Amount</td>
                            <td>Status</td>
                            <td>Details</td>
                        </tr>
                        {/* <tr style={{ height: '55px' }}>
                            <td><input type="text" className="form-control"></input></td>
                            <td><input type="date" className="form-control"></input></td>
                            {state.auth.user.role === ROLE_ADMIN && <td>
                                <input type="text" className="form-control"></input></td>}
                            <td><input type="text" className="form-control"></input></td>
                            <td><input type="text" className="form-control"></input></td>
                            <td><input type="text" className="form-control"></input></td>
                            <td><OrderStatusDD
                                handleStatusChange={handleStatusChange}
                            /></td>
                            <td><button className="btn btn-warning">
                                <i className="las la-search"></i>
                            </button>
                                <button className="btn btn-info" style={{ marginLeft: '5px' }}>
                                    <i className="las la-times-circle"></i>
                                </button>
                            </td>
                        </tr> */}
                    </thead>
                    <tbody>
                        {
                            state.order.items &&
                            state.order.items.map(item =>
                                <tr>
                                    <td>{item.OrderNo}</td>
                                    <td>{moment(item.OrderDate).format('DD/MM/YYYY')}</td>
                                    {state.auth.user.role === ROLE_ADMIN && <td>{item.Name}</td>}
                                    <td>{item.ItemCount}</td>
                                    <td>{item.TotalQty}</td>
                                    <td>{formatter.format(item.NetPayAmount)}</td>
                                    <td>{item.Status}</td>
                                    <td><button className="btn btn-info">View</button></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </CustomPanel >
    )
}
