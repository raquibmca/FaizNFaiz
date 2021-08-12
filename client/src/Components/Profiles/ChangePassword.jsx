import React, { useContext } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updatePassword } from '../../api/userApi';
import { AuthContext } from '../../Context/AuthContext';

import * as Yup from 'yup';
import { useHistory } from 'react-router';
import CustomPanel from '../Common/Panel/CustomPanel';

export default function ChangePassword() {
    const schema = Yup.object().shape({
        originalPassword: Yup.string()
            .required('Original password is required')
            .min(8, "Password should be of 8 character.")
            .max(8, "Password should be of 8 character."),
        newPassword: Yup.string()
            .required('New password is required')
            .min(8, "Password should be of 8 character.")
            .max(8, "Password should be of 8 character."),
        // .oneOf([Yup.ref('confirmPassword'), null], 'New and confirm password does not match'),
        confirmPassword: Yup.string()
            .required('Confirm password is required')
            .min(8, "Password should be of 8 character.")
            .max(8, "Password should be of 8 character.")
            .oneOf([Yup.ref('newPassword'), null], 'New and confirm password does not match')
    });
    const history = useHistory();
    const { state, dispatch } = useContext(AuthContext)
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        let cred = {
            userid: state.auth.user.id,
            password: data.originalPassword,
            newpassword: data.newPassword
        }
        setFocus("originalPassword")
        let status = updatePassword(cred, dispatch);
        if (status)
            reset({ originalPassword: '', newPassword: '', confirmPassword: '' });
    };

    React.useEffect(() => {
        setFocus("originalPassword");
    }, [setFocus]);

    return (
        <CustomPanel headingText="Change Password">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="userchangepassword">
                    <div className="form-group">
                        <div className="form-control-label">Original Password<span className="req-field">*</span></div>
                        <div><input type="password" name="originalPassword" minLength="8" maxLength="8"
                            {...register('originalPassword', { required: true })}
                            className={`form-control ${errors.originalPassword ? 'is-invalid' : ''}`}
                        /><div className="invalid-feedback">{errors.originalPassword?.message}</div></div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">New Password<span className="req-field">*</span></div>
                        <div><input type="password" name="newPassword" minLength="8" maxLength="8"
                            {...register('newPassword', { required: true })}
                            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                        /><div className="invalid-feedback">{errors.newPassword?.message}</div></div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-label">Confirm Password<span className="req-field">*</span></div>
                        <div><input type="password" name="confirmPassword" minLength="8" maxLength="8"
                            {...register('confirmPassword', { required: true })}
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        /><div className="invalid-feedback">{errors.confirmPassword?.message}</div></div>
                    </div>
                    <div className="form-group">
                        <div className="button-panel">
                            <div><button className="btn btn-primary">Update</button></div>
                            <div><input type="button" className="btn btn-info" onClick={e => history.goBack()} value={"Back"} /></div>
                        </div>
                    </div>
                </div>
            </form >
        </CustomPanel>
    )
}
