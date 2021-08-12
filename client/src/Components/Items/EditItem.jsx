import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { onlyNumericField } from '../../Utils/apputils';
import { useContext } from 'react';
import { AuthContext } from './../../Context/AuthContext';
import { updateItem } from './../../api/itemApi';
import * as Yup from 'yup';
import { useHistory, useParams, Link } from 'react-router-dom';
import Loader from '../Common/loader/Loader';
import CustomPanel from './../Common/Panel/CustomPanel';

export default function EditItem() {
    const { id } = useParams();
    const history = useHistory();
    const [isUpdated, setIsUpdated] = useState(false)
    const { state, dispatch } = useContext(AuthContext);

    const schema = Yup.object().shape({
        itemcode: Yup.string().required('Code is required'),
        itemname: Yup.string().required('Name is required'),
        rate: Yup.string().required('Rate is required')
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema), defaultValues: {
            category: state.item.current?.category,
            itemcode: state.item.current?.itemcode,
            itemname: state.item.current?.itemname,
            rate: state.item.current?.rate
        }
    });

    const handleSaveItems = async (data) => {
        await updateItem(id, data, dispatch);
    }

    return (
        <CustomPanel headingText={
            state.item.current?.itemname === undefined ? 'Oops no item for update!' :
                `Updating Item:&nbsp;<strong>${state.item.current?.itemname}</strong>`
        }>
            <form onSubmit={handleSubmit(handleSaveItems)}>
                {state.item.isFetching && <Loader />}
                <div className="item-header-context">
                    <div className="form-group">
                        <div className="form-control-label">Select category</div>
                        <div className="oh-row">
                            <select className="form-control" name="category"
                                disabled={state.item.current == null || isUpdated}
                                {...register('category')}
                            >
                                <option value="1">Select...</option>
                                {state.category.items?.map(i => <option value={i.id}>{i.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Enter item code<span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" name="itemcode" palceholder="Item code" maxLength="8"
                                disabled={state.item.current == null || isUpdated}
                                {...register('itemcode', { required: true, pattern: /^[A-Z0-9]+$/ })}
                                className={`form-control ${errors.itemcode ? 'is-invalid' : ''}`}
                            /><div className="invalid-feedback">{errors.itemcode?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Enter item name<span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" palceholder="Item name" name="itemname" maxLength="15"
                                disabled={state.item.current == null || isUpdated}
                                {...register('itemname', { required: true })}
                                className={`form-control ${errors.itemname ? 'is-invalid' : ''}`}
                            /><div className="invalid-feedback">{errors.itemname?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Enter Rate<span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" palceholder="Item rate" name="rate" maxLength="5"
                                disabled={state.item.current == null || isUpdated}
                                {...register('rate', { required: true })}
                                className={`form-control ${errors.rate ? 'is-invalid' : ''}`}
                                onKeyDown={onlyNumericField}
                            /><div className="invalid-feedback">{errors.rate?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="oh-row">
                            <button className="btn btn-primary"
                                disabled={
                                    state.item.current == null ||
                                    isUpdated ||
                                    state.item.isFetching
                                } >Update</button>
                        </div>
                        <div className="oh-row">
                            {/* <Link to="/manageitems" className="btn btn-info">
                                Back
                            </Link> */}
                            <input type="button" className="btn btn-info" onClick={e => history.goBack()} value={"Back"} />
                        </div>
                    </div>
                </div>
            </form>
        </CustomPanel>
    )
}
