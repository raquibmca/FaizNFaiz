import React, { useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { loadAddress } from '../../api/userAddress';
import { AuthContext } from '../../Context/AuthContext';
import Address from './Address'
import CustomPanel from './../Common/Panel/CustomPanel';

import './address.css';
import Loader from '../Common/loader/Loader';

export default function Addresses() {
    const { state, dispatch } = useContext(AuthContext)
    const history = useHistory()
    useEffect(() => {
        if (state.address.count === 0)
            loadAddress(state.auth.user.id, dispatch);
    }, [state.address.count])

    return (
        <CustomPanel headingText={"Manage Addresses"} >
            <div className="addressmaster">
                <div className="btn-addnewaddress">
                    <div style={{ display: 'flex' }}>
                        <Link to="/address/addnew" className="btn btn-primary btnadd-address">
                            <i className="las la-plus"></i>
                        </Link>
                        <div className="addnewaddress">Add New Address</div>
                    </div>
                    <div>
                        <button className="btn btn-info btnadd-address" onClick={e => history.goBack()}>
                            Back
                        </button>
                    </div>
                </div>
                <div className="addresslist">
                    {
                        state.address.isFetching ? (<Loader />) :
                            (state.address.address.length > 0
                                ?
                                state.address.address.map(a => <Address key={`address_${a.Id}`} data={a} userid={state.auth.user.id} />)
                                :
                                <div style={{ fontSize: '2rem' }}></div>)
                    }
                </div>
            </div>
        </CustomPanel>
    )
}
