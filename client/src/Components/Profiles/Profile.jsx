import React, { useContext, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { updateUser, updateProfilePicture, removeProfilePicture } from '../../api/userApi';
import * as Yup from 'yup';
import * as moment from 'moment';

import './profile.css';
import CustomPanel from '../Common/Panel/CustomPanel';
import Loader from '../Common/loader/Loader';

export default function Profile() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const file = useRef();
    // Yup.addMethod(Yup.date, 'format', function (formats, parseStrict) {
    //     return this.transform(function (value, originalValue) {
    //         value = Moment(originalValue, formats, parseStrict);
    //         return value.isValid() ? value.toDate() : new Date('');
    //     });
    // });

    // Yup.addMethod(Yup.date, 'ageRange', function (formats, min, max) {
    //     return this.transform(function (value, originalValue) {
    //         let years = Moment().add(-originalValue, 'years');
    //         // let years = Moment().diff(Moment(originalValue, formats).format('YYYY-MM-DD'), 'years');
    //         return (years >= min && years <= max) ? value : new Date('');
    //     });
    // });
    const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        gender: Yup.string().required('Select gender'),
        // dateofbirth: Yup.date().max('2010-01-01', 'Date should be less than 01-Jan-2010').required('Date of birth is required'),
        dateofbirth: Yup.string().required('Date of birth is required').test(
            "dateofbirth",
            "Age should be greater than or equal to 10 years",
            value => {
                return moment().diff(moment(value), 'years') >= 10;
            }
        ),
        // .format('DD-MM-YYYY', true)
        //.ageRange('DD-MM-YYYY', 10, 60, "date of birth is not within the rage."),
        questionhint: Yup.string().required('Select one of hint question'),
        userhint: Yup.string().required('Hint for above selected question is required')
    });
    const { state, dispatch } = useContext(AuthContext)
    console.log(state.auth.user)
    const history = useHistory()
    let user = state.auth.user;
    let defaultValue = {
        name: user.name,
        dateofbirth: user.dateofbirth,
        email: user.email,
        gender: user.gender,
        questionhint: user.questionhint,
        userhint: user.userhint,
    }

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema), defaultValues: defaultValue });

    const onSubmit = async (data) => {
        const result = updateUser(user.id, data, dispatch);
        // if (result) history.push("/");
    };

    const handleSelectFile = (event) => {
        if (!state.auth.isFetching)
            file.current.click();
    }

    const uploadHandle = async (event) => {
        updateProfilePicture(user.id, event.target.files[0], dispatch);
    }

    const handleRemovePicture = async () => {
        file.current.value = '';
        removeProfilePicture(user.id, dispatch);
    }

    return (
        <CustomPanel headingText={"Update Profile"}>
            {state.auth.isFetching && <Loader />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="userprofile">
                    <div className="usp-header">
                        <div className="usp-image">
                            <img
                                className="userImage"
                                src={`${PF}/${user.profilePicture !== null ? user.profilePicture : 'noAvatar.png'}`}
                                alt="User Image"
                            />
                            <div className={state.auth.isFetching ? "imguploadbtn disabled" : "imguploadbtn"}>
                                <i className="las la-camera" onClick={handleSelectFile}></i>
                                <input type="file" ref={file} onChange={uploadHandle} style={{ display: 'none' }} />
                            </div>
                        </div>
                        <div className="usp-otherlinks">
                            { }
                            <div className="usp-link">
                                {!state.auth.isFetching ?
                                    <Link to="/user/changepassword">Change Password</Link> :
                                    <span className="disabled">Change Password</span>}
                            </div>
                            <div className="usp-link">
                                {!state.auth.isFetching ?
                                    <Link to="/address/list">Manage Address</Link> :
                                    <span className="disabled">Manage Address</span>}
                            </div>
                            <div className="usp-link">
                                {(user.profilePicture !== null && !state.auth.isFetching) ?
                                    (<a href="#" onClick={handleRemovePicture} >Remove Picture</a>) :
                                    (<span className="disabled">Remove Picture</span>)
                                }</div>
                        </div>
                    </div>
                    <div className="usp-profiledeatail">
                        <div className="user-profile-group">
                            <div className="form-group">
                                <div className="form-control-label">Mobile Number</div>
                                <div>{user.username}</div>
                            </div>
                            <div className="form-group">
                                <div className="form-control-label">Ref Code</div>
                                <div>{user.refcode}</div>
                            </div>
                            <div className="form-group">
                                <div className="form-control-label">Last Login</div>
                                <div>{moment(user.lastLogin).format('DD/MM/YYYY hh:mm:ss A')}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-control-label">Name<span className="req-field">*</span></div>
                            <div><input type="text" name="name" maxLength="20"
                                disabled={state.auth.isFetching}
                                {...register('name', { required: true })}
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            /><div className="invalid-feedback">{errors.name?.message}</div></div>
                        </div>
                        <div className="form-group">
                            <div className="form-control-label">Gender<span className="req-field">*</span></div>
                            <div>
                                <select name="gender"
                                    disabled={state.auth.isFetching}
                                    {...register('gender', { required: true })}
                                    className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                >
                                    <option value=""></option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Others</option>
                                </select><div className="invalid-feedback">{errors.gender?.message}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-control-label">Date of birth<span className="req-field">*</span></div>
                            <div >
                                <input type="date" name="dateofbirth" placeholder="dd-mm-yyyy"
                                    disabled={state.auth.isFetching}
                                    {...register('dateofbirth', { required: true })}
                                    className={`form-control ${errors.dateofbirth ? 'is-invalid' : ''}`}
                                /><div className="invalid-feedback">{errors.dateofbirth?.message}</div>
                            </div>

                        </div>
                        <div className="form-group">
                            <div className="form-control-label">Email</div>
                            <div><input type="email" name="email" maxLength="50" className="form-control"
                                disabled={state.auth.isFetching}
                                {...register('email')}
                            /></div>
                        </div>
                        <div className="form-group">
                            <div className="form-control-label">Question Hint<span className="req-field">*</span></div>
                            <div>
                                <select name="questionhint"
                                    disabled={state.auth.isFetching}
                                    {...register('questionhint', { required: true })}
                                    className={`form-control ${errors.questionhint ? 'is-invalid' : ''}`}
                                >
                                    <option value=""></option>
                                    <option value="1">What's your favorite dress?</option>
                                    <option value="2">When you bought your first suit?</option>
                                    <option value="3">Which colour of dress you like most?</option>
                                </select>
                                <div className="invalid-feedback">{errors.questionhint?.message}</div>
                                <div style={{ marginTop: '10px' }}>
                                    <input type="text" name="userhint" maxLength="10"
                                        disabled={state.auth.isFetching}
                                        {...register('userhint', { required: true })}
                                        className={`form-control ${errors.userhint ? 'is-invalid' : ''}`}
                                    />
                                    <div className="invalid-feedback">{errors.userhint?.message}</div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="button-panel">
                                <div><button className="btn btn-primary" disabled={state.auth.isFetching}>Update</button></div>
                                <div>
                                    <Link to="/" className="btn btn-info">
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </CustomPanel>
    )
}
