import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from './../Context/AuthContext';
import './contactus.css'
import { onlyNumericField } from '../Utils/apputils';

export default function Contactus() {
    const schema = Yup.object().shape({
        name: Yup.string().required('Name is required.'),
        mobile: Yup.string().max(10).required('Mobile no is required.'),
        address: Yup.string().required('Address is required.'),
        description: Yup.string().required('Description is required')
    });
    const { state, dispatch } = useContext(AuthContext)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        console.log(data)
    };

    return (
        <>
            <div className="contactus-body">
                <div className="contactus-body-panel">
                    <p>{`Faiz & Faiz`}</p>
                    <p>Azad Nagar,</p>
                    <p>Bhulli Road,</p>
                    <p>Anjuman Market,</p>
                    <p>Groud Floor,</p>
                    <p>Dist - Dhanbad,</p>
                    <p>Jharkhand,</p>
                    <p>Pin - 828105</p>
                </div>
            </div>
            <div className="faiz-contactus">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                        <div className="form-control-label">Name<span className="req-field">*</span></div>
                        <div><input type="text" name="name" maxLength="20"
                            // disabled={state.auth.isFetching}
                            {...register('name', { required: true })}
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        />
                            {/* <div className="invalid-feedback">{errors.name?.message}</div>*/}
                        </div>
                    </div>
                    <div className="">
                        <div className="form-control-label">Mobile No.<span className="req-field">*</span></div>
                        <div >
                            <input type="text" name="mobile" maxLength="10"
                                onKeyDown={onlyNumericField}
                                // disabled={state.auth.isFetching}
                                {...register('mobile', { required: true })}
                                className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                            />
                            {/* <div className="invalid-feedback">{errors.mobile?.message}</div> */}
                        </div>

                    </div>
                    <div className="">
                        <div className="form-control-label">Address<span className="req-field">*</span></div>
                        <div><textarea name="address" maxLength="80" className="form-control" style={{ height: '70px' }}
                            // disabled={state.auth.isFetching}
                            {...register('address', { required: true })}
                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        />
                            {/* <div className="invalid-feedback">{errors.address?.message}</div> */}
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Description<span className="req-field">*</span></div>
                        <div><textarea name="description" maxLength="150" className="form-control" style={{ height: '70px' }}
                            // disabled={state.auth.isFetching}
                            {...register('description', { required: true })}
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        />
                            {/* <div className="invalid-feedback">{errors.description?.message}</div> */}
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="button-panel">
                            <div><button className="btn btn-primary">Submit</button></div>
                            <div>
                                <Link to="/" className="btn btn-info">
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
