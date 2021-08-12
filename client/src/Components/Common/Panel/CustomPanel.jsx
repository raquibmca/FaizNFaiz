import React, { useContext, useEffect } from 'react'
import { getOrderStatus } from '../../../api/orderApi';
import { AuthContext } from './../../../Context/AuthContext';
import './custompanel.css';
import OrderStatusDD from './OrderStatusDD';

export default function CustomPanel({ headingText, children, righChild, isSubHeading = false }) {
    let subhead_css = isSubHeading ? "sub" : "";
    const { dispatch } = useContext(AuthContext);
    useEffect(() => {
        getOrderStatus(dispatch);
    }, [])
    return (
        <div className="custom-panel">
            <div
                className={`panel-heading-text ${subhead_css}`}
            // dangerouslySetInnerHTML={{ __html: headingText }}
            // dangerouslySetInnerHTML={{ __html: headerControl }}
            >
                {headingText}
                {righChild}
            </div>
            <div className="panel-body">
                {children}
            </div>
        </div>
    )
}


