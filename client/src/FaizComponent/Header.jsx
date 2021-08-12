import React from 'react';
import { useContext } from 'react';
import { AuthContext } from './../Context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const { state } = useContext(AuthContext);
    const location = useLocation();
    return (
        <div className="faiz-header">
            <div className="faiz-header-left">
                <div className="home-icon">
                    <i className="las la-home"></i>
                </div>
                <div className="home-comp-name">
                    {`Faiz & Faiz`}
                </div>
            </div>
            <div className="faiz-header-right">
                <div className="kart-icon">
                    <i className="las la-dolly-flatbed"></i>
                    {state.item.selected?.length > 0 &&
                        <div className="home-cart-badge">
                            {state.item.selected?.length}
                        </div>
                    }
                </div>
                {location.pathname !== "/contactus" &&
                    <div className="send-request">
                        <Link to="/contactus">Contact US</Link>
                    </div>
                }
            </div>
        </div>
    )
}
