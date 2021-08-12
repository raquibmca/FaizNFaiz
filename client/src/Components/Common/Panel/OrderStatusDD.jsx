import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './../../../Context/AuthContext';
import axios from 'axios';

const OrderStatusDD = ({ handleStatusChange }) => {
    const { state } = useContext(AuthContext);
    useEffect(async () => {
        if (state.order.orderStatus?.length === 0) {
            const response = await axios.get(`/order/orderstatus/`);
        }
    }, [])
    return (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', width: '100%' }}>
            {/* <div style={{ marginRight: '10px' }}></div> */}
            <div>
                <select
                    onChange={e => handleStatusChange(e.target.value)}
                    className="form-control">
                    {state.order.orderStatus &&
                        state.order.orderStatus?.map(os =>
                            <option value={os.Id}>{os.Status}</option>)
                    }
                </select>
            </div>
        </div>
    )
}

export default React.memo(OrderStatusDD)