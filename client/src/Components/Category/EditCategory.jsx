import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams, Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { updateCategory } from './../../api/categoryApi';
import { AuthContext } from './../../Context/AuthContext';
import CustomPanel from './../Common/Panel/CustomPanel';
import Loader from '../Common/loader/Loader';

export default function EditCategory() {
    const { id } = useParams();
    const history = useHistory();
    const [isUpdated, setIsUpdated] = useState(false)
    const { state, dispatch } = useContext(AuthContext);

    const schema = Yup.object().shape({
        code: Yup.string().required('Code is required'),
        name: Yup.string().required('Name is required'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema), defaultValues: {
            code: state.category.current?.code,
            name: state.category.current?.name
        }
    });

    const handleSaveItems = async (data) => {
        await updateCategory(id, data, dispatch)
    }
    return (

        <CustomPanel headingText={
            state.category.current?.name === undefined ? 'Oops no category for update!' :
                `Updating Category: ${state.category.current?.name}`
        }>
            <form onSubmit={handleSubmit(handleSaveItems)}>
                {state.category.isFetching && <Loader />}
                <div className="item-header-context">
                    <div className="form-group">
                        <div className="form-control-label">Enter item code <span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" name="code" palceholder="Item code" maxLength="8"
                                disabled={state.category.current == null || isUpdated}
                                {...register('code', { required: true })}
                                className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                            /><div className="invalid-feedback">{errors.code?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Enter item name <span className="req-field">*</span></div>
                        <div className="oh-row">
                            <input type="text" palceholder="Item name" name="name" maxLength="15"
                                disabled={state.category.current == null || isUpdated}
                                {...register('name', { required: true })}
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            /><div className="invalid-feedback">{errors.name?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="oh-row">
                            <button className="btn btn-primary" disabled={state.category.current == null || isUpdated} >Update</button>
                        </div>
                        <div className="oh-row">
                            <Link to="/managecategory" className="btn btn-info">
                                Back
                            </Link>
                            {/* <input type="button" className="btn btn-info" onClick={e => history.goBack()} value={"Back"} /> */}
                        </div>
                    </div>
                </div>
            </form>
        </CustomPanel>
    )
}
