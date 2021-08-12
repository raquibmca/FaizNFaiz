import React, { useEffect, useContext, useState } from 'react'
import OrderFooter from './OrderFooter';
import { AuthContext } from '../../../Context/AuthContext';
import { useHistory, useParams } from 'react-router-dom';
import { decrypt } from '../../../Utils/cipher';
import * as moment from 'moment';
// import OrderRow from './OrderRow';

import './confirmorder.css'
import { formatter } from './../../../Utils/apputils';
import { orderItemGridSchema } from './../../../api/orderApi';
import NewItem from './../../CustomeTable/NewItem';

export default function ConfirmOrder() {

    const { state, dispatch } = useContext(AuthContext);
    const [isPageExpire, setIsPageExpire] = useState(false);
    const { expiretime, id } = useParams();
    const history = useHistory();
    let order = state.order.current;
    let address = state.address.current;
    let chargeJson = null;
    if (order)
        chargeJson = JSON.parse(order.order?.orderchargejson?.data)
    useEffect(() => {
        let time = decrypt(expiretime)
        time = (+time - +new Date()) / 1000;
        if (time < 0 || !order) {
            setIsPageExpire(true);
            setTimeout(() => {
                history.push("/")
            }, 3000)
        }
    }, []);

    return (
        <div className="confirmOrder">
            {(!order || isPageExpire) ? (<div className="error-message"><h1>This page has expired</h1></div>) : (<>
                <div className="congrate">Congratulation!! Your order has been confirmed.
                    <p><small>* This is system generated reciept, no sigature required.</small></p>
                </div>
                <div className="co-header">
                    <div className="co-header-left">
                        <div><strong>{state.auth.user.name}</strong></div>
                        <div>{address?.address1},</div>
                        {address?.address2 && <div>{address?.address2},</div>}
                        <div>{address?.street},</div>
                        <div>{address?.post},</div>
                        <div>{address?.district},</div>
                        <div>{address?.state},</div>
                        <div>{address?.zip},</div>
                        <div>{address?.landmark},</div>

                    </div>
                    <div className="co-header-right">
                        <div className="add-row">Superwash Laundry,</div>
                        <div className="add-row">24/A, New Market,</div>
                        <div className="add-row">Dhanbad (Jharkhand)</div>
                        <div className="add-row">Zip:828104</div>
                        <div className="add-row">Mob:7989562314, 9956859825</div>
                        <div className="add-row">contact@superwash.com</div>
                        <div className="add-row"><strong>Order No. {order?.ordno}</strong></div>
                        <div className="add-row"><strong>Order Date: {moment(order?.order?.order?.orderdate).format('DD/MM/YYYY hh:mm A')}</strong></div>
                        <div className="add-row"><strong>Payable Amount: {formatter.format(order?.order?.order?.netpayamount)}</strong></div>

                    </div>
                </div>
                <div className="co-body">
                    <NewItem
                        gridSchema={orderItemGridSchema}
                        normalStyle={true}
                        items={order?.order?.detail}
                    />
                </div>
                <OrderFooter
                    amount={order?.order?.order?.billamount}
                    orderCharges={chargeJson}
                />
                <div className="button=panel">
                    {/* <button className="btn btn-info">Print</button> */}
                    <button className="btn btn-info" onClick={e => history.push("/")}>Ok</button>
                </div>
            </>)}
        </div >
    )
}
