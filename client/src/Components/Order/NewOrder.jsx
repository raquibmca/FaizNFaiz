import React, { useState, useEffect, useContext } from 'react'
import { loadItems } from './../../api/itemApi';
import { onlyNumericField, generateOrderCharges } from '../../Utils/apputils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import OrderFooter from './ChildComponent/OrderFooter';
import { AuthContext } from './../../Context/AuthContext';
import CustomPanel from '../Common/Panel/CustomPanel';
import { getDefaultAddress } from '../../api/userAddress';
import { saveOrder, verifyReferalCode, clearRefCode, orderItemGridSchema } from './../../api/orderApi';
import { useHistory } from 'react-router-dom';
import { encrypt } from '../../Utils/cipher';
import * as Yup from 'yup';

import './neworder.css';
import Loader from '../Common/loader/Loader';
import NewItem from './../CustomeTable/NewItem';


export default function NewOrder() {
    const { state, dispatch } = useContext(AuthContext);
    const history = useHistory();
    const schema = Yup.object().shape({
        items: Yup.string().required('Select any item'),
        qty: Yup.string().required('Quantity is required')
    });

    let user = state.auth.user;
    const [rowItem, setRowItem] = useState([]);
    const [amount, setAmount] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefValid, setIsRefValid] = useState(false);
    const [orderCharges, setOrderCharges] = useState(state.auth.orderCharges);

    useEffect(async () => {
        setIsLoading(true);
        await loadMinialOraderData();
        setIsLoading(false);
    }, []);

    const loadMinialOraderData = async () => {
        let orderChargesResult = generateOrderCharges(orderCharges?.array, amount);
        await setOrderCharges(orderChargesResult);
        await loadItems(dispatch);
        await getDefaultAddress(state.auth.user.id, dispatch)
    }

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setError: setError2,
        getValues,
        formState: { errors: errors2 }
    } = useForm();

    const handleAddItem = async (data) => {
        setHasError(false);
        let newItem = state.item.items.find(f => f.id == data.items);
        let result = rowItem.find(f => f.id == parseInt(data.items));
        if (result) {
            setHasError(true);
            return;
        }
        newItem.qty = data.qty;
        newItem.index = rowItem.length;
        newItem.amount = data.qty * newItem.rate;
        setRowItem((prev) => [...prev, newItem]);
        updateAmount(true, newItem);

        reset({ qty: '' });
        setFocus("items");
    };

    const handleRemoveItem = (id) => {
        setHasError(false);
        let result = rowItem.filter(f => f.id !== id);
        let removeItem = rowItem.find(f => f.id === id);
        setRowItem(result);
        updateAmount(false, removeItem);
    }

    const updateAmount = (isadd, result) => {
        let multiplyer = isadd ? 1 : -1;
        let newamount = amount + ((result.rate * result.qty) * multiplyer);
        let orderChargesResult = generateOrderCharges(orderCharges.array, newamount);

        setAmount(newamount);
        setOrderCharges(orderChargesResult);
    }

    const handleGenerateOrder = async () => {
        console.log(state.order.refCode, getValues("refCodeValue"))
        let refCodeValue = state.order.refCode ? getValues("refCodeValue") : null;
        let servicecharges = 0;
        let discounts = 0;
        let orderchargejson = null;

        if (orderCharges?.array.length > 0) {
            servicecharges = orderCharges.array.filter(f => f.CalcValue > 0)
                .reduce((a, b) => ({ CalcValue: a.CalcValue + b.CalcValue }))
                .CalcValue;
            discounts = orderCharges.array.filter(f => f.CalcValue < 0)
                .reduce((a, b) => ({ CalcValue: a.CalcValue + b.CalcValue }))
                .CalcValue;

            orderchargejson = {
                rule: JSON.stringify(state.auth.orderCharges),
                data: JSON.stringify(orderCharges)
            };
        }

        let orderData = {
            userid: user.id,
            order: {
                refcode: refCodeValue,
                refdiscount: discounts,
                paymentmode: 1,
                addressid: state.address?.current?.Id,
                deliverycharge: 0,
                servicecharge: servicecharges,
                gstcharge: 0,
                status: 1,
                billamount: amount,
                netpayamount: orderCharges.netamount
            },
            detail: rowItem,
            orderchargejson: orderchargejson
        }

        let data = await saveOrder(orderData, state.address.current, dispatch);
        if (data) {
            let timestamp = encrypt((+ new Date() + (5 * 1000)).toString());
            history.push(`/order/confirm/${timestamp}/co`)
        }
        else {
            dispatch({ type: "SET_ERROR", payload: { message: 'Someting went wrong while creating the order.' } });
            history.push("/")
        }
    }

    const checkCipher = () => {
        history.push("/")
        // let cdata = encrypt((+ new Date() + (5 * 1000)).toString());
        // console.log(cdata)
        // let ddata = JSON.parse(decrypt(cdata));
        // console.log(ddata)

    }
    const handleRefCode = async (data) => {
        if (data.refCodeValue.length === 0) {
            setError2("refCodeValue", { type: "manual", message: "Referal code required." });
        } else {
            let error = await verifyReferalCode(data, state.auth.user.id, dispatch);
            setIsRefValid(!error.error)
            if (error.error) {
                setError2("refCodeValue", { type: "manual", message: 'Invalid referal code.' });
            }
        }
    }

    return (
        <CustomPanel headingText={"Create New Order"}>
            {(isLoading || state.order.isFetching) ? (<Loader />) :
                (<>
                    <div className="neworder">
                        <form onSubmit={handleSubmit(handleAddItem)}>
                            <div className="orderheader">
                                {state.item.items.length > 0 &&
                                    <div style={{ display: 'flex' }}>
                                        <div className="form-group">
                                            <div className="form-control-label">Select Item from below <span className="req-field">*</span></div>
                                            <div className="oh-row">
                                                <select
                                                    name="items"
                                                    disabled={state.item.items.length === 0}
                                                    {...register('items', { required: true })}
                                                    className={`form-control ${errors.items ? 'is-invalid' : ''}`}
                                                >
                                                    <option value="">Select...</option>
                                                    {
                                                        state.item.items && state.item.items.map(item => <option value={item.id}>{item.rate + ' - ' + item.itemname}</option>)
                                                    }
                                                </select>
                                                {/* <div className="invalid-feedback">{errors.items?.message}</div> */}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-control-label">Quantity <span className="req-field">*</span></div>
                                            <div className="oh-row">
                                                <input
                                                    type="text"
                                                    name="qty"
                                                    style={{ width: '60px', textAlign: 'center' }}
                                                    disabled={state.item.items.length === 0}
                                                    maxLength={2}
                                                    // onChange={e => setQuantity(e.target.value)}
                                                    onKeyDown={onlyNumericField}
                                                    {...register('qty', { required: true })}
                                                    className={`form-control ${errors.qty ? 'is-invalid' : ''}`}
                                                />
                                                {/* <div className="invalid-feedback">{errors.qty?.message}</div> */}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="oh-row">
                                                <button
                                                    className="btn btn-primary"
                                                    disabled={
                                                        state.item.items.length === 0 ||
                                                        !state.address.current?.Id ||
                                                        state.order.isFetching
                                                    }
                                                >Add</button>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div>
                                    {!state.address.current?.Id && <div className="error-message">You don't have any active address. <p>please create a new one or set default from exsisting</p> </div>}
                                    {hasError && <div className="error-message">Selected item already in order list.</div>}
                                    {state.item.items.length === 0 && <div className="error-message">Unable to load items into list.
                                        <p>Might be reason of items not created yet.</p>
                                        <p>Please Contact The ADMIN.</p></div>}
                                </div>
                            </div>
                        </form >
                        {
                            state.item.items.length > 0 &&
                            (<>
                                <NewItem
                                    gridSchema={orderItemGridSchema}
                                    showAction={true}
                                    items={rowItem}
                                    handleRemoveItem={handleRemoveItem}
                                    // onRowClick={handleEditItem}
                                    actions={[
                                        { action: 'delete', bindwith: 'id' }
                                    ]}
                                />
                                <OrderFooter
                                    amount={amount}
                                    orderCharges={orderCharges}
                                />
                                <form onSubmit={handleSubmit2(handleRefCode)}>
                                    <div className="form-group">
                                        <div className="form-control-label">Referal Code</div>
                                        <div className="button-panel">
                                            <div><input
                                                type="text"
                                                name="refCodeValue"
                                                maxLength="8"
                                                onChange={e => setIsRefValid(false)}
                                                {...register2('refCodeValue')}
                                                className={`form-control ${errors2.refCodeValue ? 'is-invalid' :
                                                    isRefValid ? 'is-valid' : ''}`}
                                            />{errors2.refCodeValue &&
                                                <div className="invalid-feedback">{errors2.refCodeValue.message}</div>}
                                            </div>
                                            <div>
                                                <button className="btn btn-success">Apply</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="form-group">
                                    <div className="button-panel">
                                        <div>
                                            <button
                                                className="btn btn-primary"
                                                disabled={rowItem.length === 0 || state.order.isFetching}
                                                onClick={handleGenerateOrder}
                                            >Order</button></div>
                                        <div><input type="button" className="btn btn-info" value={"Back"} onClick={checkCipher} /></div>
                                    </div>
                                </div>
                            </>)
                        }
                    </div >
                </>
                )
            }
        </CustomPanel >
    )
}
