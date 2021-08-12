import React, { useContext, useEffect, useState, useRef } from 'react'
import { AuthContext } from './../../Context/AuthContext';
import NewItem from './../CustomeTable/NewItem';
import CustomPanel from './../Common/Panel/CustomPanel';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import CustomModal from './../Common/model-popup/Model';
import SwitchButton from '../Common/SwitchButton/SwitchButton';
import Address from '../Address/Address';
import {
    loadUsers,
    setCurrentUser,
    loadAddress,
    updateUserFlags,
    loadUserActivity,
    userGridSchema,
    userActivityGridSchema
} from '../../api/userApi';

import './manageuser.css'


export default function ManageUser() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { state, dispatch } = useContext(AuthContext);
    const [isShow, setIsShow] = useState(false);
    const [remarks, setRemarks] = useState(null);
    const [isRemark, setIsRemark] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [showActivity, setShowActivity] = useState(false);
    const [address, setAddress] = useState(null);
    const [activity, setActivity] = useState(null);

    const history = useHistory();
    let activeRef = useRef();
    let referalRef = useRef();
    let blockedRef = useRef();
    let remarksRef = useRef();

    useEffect(async () => {
        await loadUsers(dispatch);
        await setCurrentUserOnLoad();
    }, []);

    const setCurrentUserOnLoad = async () => {
        if (state.user.items.length > 0) {
            await setCurrentUser(state.user.items[0].id, dispatch);
        }
    }

    const handleEditItem = async (id) => {
        setAddress(null);
        setActivity(null);
        setShowAddress(false)
        setShowActivity(false)

        let data = await loadAddress(id);
        let activeAddress = data.find(f => f.isactive == 1);
        await setAddress(activeAddress)

        let activity = await loadUserActivity(id)
        setActivity(activity)

        await setCurrentUser(id, dispatch)
    }

    const handleUpdateClick = () => {
        if (activeRef.current.getValue() !== state.user.current?.isactive ||
            referalRef.current.getValue() !== state.user.current?.isrefactive ||
            blockedRef.current.getValue() !== state.user.current?.isblocked) {
            if (remarks?.length == 0 || remarks == null)
                setIsRemark(true)
            else {
                setIsRemark(false)
                setIsShow(true);
            }
        }
    }

    const handlePopupCancel = () => {
        setIsShow(false);
    }

    const handlePopupConfirm = () => {
        let data = {
            active: activeRef.current.getValue() ? 1 : 0,
            refactive: referalRef.current.getValue() ? 1 : 0,
            blocked: blockedRef.current.getValue() ? 1 : 0,
            remarks: remarks,
            userId: state.auth.user.id
        }
        updateUserFlags(state.user.current?.id, data, dispatch)
        setIsShow(false)
        remarksRef.current.value = "";
    }

    const handleShowAddress = async () => {
        if (address) {
            setShowAddress(!showAddress)
        }
    }

    const handleShowActivity = async () => {
        if (activity?.length > 0) {
            setShowActivity(!showActivity)
        }
    }

    return (
        <CustomPanel headingText={`Manage Users (${state.user.items?.length})`}>
            <div className="manage-user-main">
                {
                    isShow &&
                    <CustomModal
                        title={`Update User (${state.user.current?.name})`}
                        width={300}
                        height={200}
                        canCancel={true}
                        onCancel={handlePopupCancel}
                        canConfirm={true}
                        onConfirm={handlePopupConfirm}
                    >
                        <div>Are you sure<br />
                            {`want to to modify the setting of "${state.user.current?.name}" user?`}<br /><br />
                            <strong></strong>
                        </div>
                    </CustomModal>
                }
                <div className="manageuser-left">
                    <NewItem
                        gridSchema={userGridSchema}
                        items={state.user?.items}
                        onRowClick={handleEditItem}
                        // selectedRow={state.user.current}
                        selectedIndex={0}
                        pagging={true}
                    />
                </div>
                <div className="manageuser-right">
                    <CustomPanel headingText={state.user.current ? `Profile Details Of ${state.user.current?.name}` : 'No User Selected'} isSubHeading={true}>
                        {state.user.current ?
                            (<>
                                <div className="user-grid">
                                    <div className="user-grid-img">{
                                        <img
                                            className="userImage"
                                            src={`${PF}/${state.user.current?.profilepicture !== null ? state.user.current?.profilepicture : 'noAvatar.png'}`}
                                            alt=""
                                        />

                                    }</div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">User Name</div>
                                        <div>{state.user.current?.username}</div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Name</div>
                                        <div>{state.user.current?.name}</div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Referal Code</div>
                                        <div>{state.user.current?.refcode}</div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Gender</div>
                                        <div>{
                                            state.user.current?.gender !== null ?
                                                state.user.current?.gender?.toUpperCase() : 'N/A'
                                        }</div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Email</div>
                                        <div>{
                                            state.user.current?.email !== null ?
                                                state.user.current?.email : 'N/A'}</div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Birth Date</div>
                                        <div>{
                                            state.user.current?.dbo != null ?
                                                moment(state.user.current?.dob).format("DD-MMM-YYYY") : 'N/A'}</div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Joining Date</div>
                                        <div>{moment(state.user.current?.joindate).format("DD-MMM-YYYY")}</div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Last Login</div>
                                        <div>{
                                            state.user.current?.lastlogin != null ?
                                                moment(state.user.current?.lastlogin).format("DD-MMM-YYYY") :
                                                'Not Login Yet'
                                        }</div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Active</div>
                                        <div>
                                            <SwitchButton
                                                ref={activeRef}
                                                checked={state.user.current?.isactive}
                                                disabled={state.user.current?.lastlogin == null}
                                            /></div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Referal Active</div>
                                        <div>
                                            <SwitchButton
                                                ref={referalRef}
                                                checked={state.user.current?.isrefactive}
                                                disabled={state.user.current?.lastlogin == null}
                                            /></div>
                                    </div>
                                    <div className="user-grid-data">
                                        <div className="form-control-label">Blocked</div>
                                        <div>
                                            <SwitchButton
                                                ref={blockedRef}
                                                checked={state.user.current?.isblocked}
                                                disabled={state.user.current?.lastlogin == null}
                                            /></div>
                                    </div>
                                    <div className="user-grid-data user-activity">
                                        <div className={activity?.length > 0 ? "form-control-label link" : "disabled"}
                                            onClick={handleShowActivity}
                                        >
                                            See Activities
                                        </div>
                                        {
                                            showActivity &&
                                            <div className="user-activity-list">
                                                <NewItem
                                                    gridSchema={userActivityGridSchema}
                                                    items={activity}
                                                    pagging={true}
                                                    pageSize={3}
                                                />
                                            </div>
                                        }
                                    </div>
                                    <div className="user-grid-data user-activity">
                                        <div className={address ? "form-control-label link" : "disabled"}
                                            onClick={handleShowAddress}
                                        >
                                            See Active Address
                                        </div>
                                        {
                                            showAddress &&
                                            <div className="user-address">
                                                <Address data={address} dataOnly={true} />
                                            </div>
                                        }
                                    </div>
                                    <div className="form-group user-remarks">
                                        <div className="form-control-label">Remarks for updation</div>
                                        <textarea
                                            ref={remarksRef}
                                            name="remarks" className="user-remark-text" maxLength="250"
                                            onChange={e => setRemarks(e.target.value)}
                                            className={`form-control ${isRemark ? 'is-invalid' : ''}`}
                                            disabled={state.user.current?.lastlogin == null}
                                        ></textarea>{isRemark &&
                                            <div className="invalid-feedback">{"Remark is required as you user flags has been modified."}</div>}
                                    </div>

                                </div>
                                <div className="action-button">
                                    <div className="button-panel">
                                        <div>
                                            <button
                                                className="btn btn-success"
                                                onClick={handleUpdateClick}
                                                disabled={state.user.current?.lastlogin == null}
                                            >
                                                Update
                                            </button>
                                        </div>
                                        <div><button className="btn btn-info" onClick={e => history.push("/")}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </>) : (<div className="">
                                <div className="form-control-label">SELECT ANY USER</div>
                            </div>)
                        }
                    </CustomPanel>
                </div>
            </div>
        </CustomPanel>
    )
}
