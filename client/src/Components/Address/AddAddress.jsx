import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useParams, useHistory } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../../Context/AuthContext';
import { addAddress, updateAddress } from '../../api/userAddress';
import * as Yup from 'yup';
import { onlyNumericField } from '../../Utils/apputils';

export default function AddAddress() {
    const schema = Yup.object().shape({
        address1: Yup.string().required('House no. is required'),
        street: Yup.string().required('Street is required'),
        post: Yup.string().required('Post is required'),
        state: Yup.string().required('State is required'),
        district: Yup.string().required('District is required'),
        zip: Yup.string().required('Zip is required').matches(/^[0-9]+$/, 'Zip should be numeric').test('len', 'Zip should be of 8 digit', val => val.length === 6),
    });
    const history = useHistory();
    const { state, dispatch } = useContext(AuthContext)
    const { id } = useParams();
    const defaultValue = {
        address1: state.address?.current?.address1,
        address2: state.address?.current?.address2,
        street: state.address?.current?.street,
        post: state.address?.current?.post,
        district: state.address?.current?.district,
        state: state.address?.current?.state,
        zip: state.address?.current?.zip,
        landmark: state.address?.current?.landmark,
    };
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema), defaultValues: (!!id) ? defaultValue : {} });

    const onSubmit = async (data) => {
        let result = false;
        if (!!id)
            result = await updateAddress(data, id, dispatch);
        else
            result = await addAddress(data, state.auth?.user.id, dispatch);
        if (result)
            history.push('/address/list');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div className="form-group">
                <div className="form-control-label"><label htmlFor="address1">House No. <span className="req-field">*</span></label></div>
                <div><input type="text" name="address1"
                    {...register('address1', { required: true })}
                    className={`form-control ${errors.address1 ? 'is-invalid' : ''}`}
                />
                    <div className="invalid-feedback">{errors.address1?.message}</div>
                </div>
            </div>
            <div className="form-group">
                <div className="form-control-label"><label htmlFor="address2">Address</label></div>
                <div><input type="text" name="address2" className="form-control"
                    {...register('address2')}
                /></div>
            </div>
            <div className="form-group">
                <div className="form-control-label"><label htmlFor="street">Street <span className="req-field">*</span></label></div>
                <div><input type="text" name="street"
                    {...register('street')}
                    className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                /><div className="invalid-feedback">{errors.street?.message}</div></div>
            </div>
            <div className="form-group">
                <div className="form-control-label"><label htmlFor="post">P.O. <span className="req-field">*</span></label></div>
                <div><input type="text" name="post"
                    {...register('post')}
                    className={`form-control ${errors.post ? 'is-invalid' : ''}`}
                /><div className="invalid-feedback">{errors.post?.message}</div></div>
            </div>
            <div className="form-group">
                <div className="form-control-label"><label htmlFor="state">State <span className="req-field">*</span></label></div>
                <div><input type="text" name="state"
                    {...register('state')}
                    className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                /><div className="invalid-feedback">{errors.state?.message}</div></div>
            </div>
            <div className="form-group">
                <div className="form-control-label"><label htmlFor="district">District <span className="req-field">*</span></label></div>
                <div><input type="text" name="district"
                    {...register('district')}
                    className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                /><div className="invalid-feedback">{errors.district?.message}</div></div>
            </div>
            <div className="form-group">
                <div className="form-control-label"><label htmlFor="zip">Pin Code <span className="req-field">*</span></label></div>
                <div><input type="text" name="zip" maxLength="6" minLength="6"
                    {...register('zip')}
                    className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                    onKeyDown={onlyNumericField}
                /><div className="invalid-feedback">{errors.zip?.message}</div></div>
            </div>
            <div className="form-group">
                <div className="form-control-label"><label htmlFor="landmark">Landmark</label></div>
                <div><input type="text" name="landmark" className="form-control"
                    {...register('landmark')}
                /></div>
            </div>
            <div className="form-group">
                <div className="button-panel">
                    <div><button className="btn btn-primary">{id ? 'Update' : 'Save'}</button></div>
                    <div>
                        <Link to="/address/list" className="btn btn-info">
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    )
}
