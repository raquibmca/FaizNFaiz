import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from "react-router";
import { deleteAddress, setCurrentAddress, setDefaultAddress } from '../../api/userAddress';
import { AuthContext } from '../../Context/AuthContext';
import './address.css';

export default function Address({ data, userid, dataOnly = false }) {
    const { dispatch } = useContext(AuthContext);
    const history = useHistory();
    console.log('Address Comp', data)

    const handleDeleteAddress = async () => {
        await deleteAddress(data.Id, dispatch);
        history.push('/address/list');
    }

    const handleCurrentAddress = async () => {
        await setCurrentAddress(data.Id, dispatch);
    }

    const handleDefaultAddress = async () => {
        await setDefaultAddress(data.Id, userid, dispatch);
        //history.push('/address/list');
    }

    return (
        <div className="address">
            <div className={data.isactive === 1 ? "addresswrapper active" : "addresswrapper"}>
                <div className="addressdetails">
                    {/* <div className="address-row"><div className="form-control-label">House No.</div><div>{data.address1}</div></div>
                    <div className="address-row"><div className="form-control-label">Address</div><div>{data.address2}</div></div>
                    <div className="address-row"><div className="form-control-label">Street</div><div>{data.street}</div></div>
                    <div className="address-row"><div className="form-control-label">Post</div><div>{data.post}</div></div>
                    <div className="address-row"><div className="form-control-label">District</div><div>{data.district}</div></div>
                    <div className="address-row"><div className="form-control-label">State</div><div>{data.state}</div></div>
                    <div className="address-row"><div className="form-control-label">Zip</div><div>{data.zip}</div></div>
                    <div className="address-row"><div className="form-control-label">Landmark</div><div>{data.landmark}</div></div> */}

                    <div className="address-row"><div>House No:{data.address1}</div></div>
                    {data.address2 && <div className="address-row"><div>{data.address2}</div></div>}
                    <div className="address-row"><div>{data.street}</div></div>
                    <div className="address-row"><div>{data.post}</div></div>
                    <div className="address-row"><div>{data.district}</div></div>
                    <div className="address-row"><div>{data.state}</div></div>
                    <div className="address-row"><div>{data.zip}</div></div>
                    {data.landmark && <div className="address-row"><div><span>Landmark </span>{data.landmark}</div></div>}
                </div> {!dataOnly &&
                    <div className="button-panel">
                        <div className="btn btn-primary">
                            <Link onClick={handleCurrentAddress} to={`/address/update/${data.Id}`}>Update</Link>
                        </div>
                        <div>
                            <button className="btn btn-danger" onClick={handleDeleteAddress}>Delete</button>
                        </div>
                        {(data.isactive === 0) && <div>
                            <button className="btn btn-info" onClick={handleDefaultAddress}>Set Default</button>
                        </div>}
                    </div>}
            </div>
        </div>
    )
}
