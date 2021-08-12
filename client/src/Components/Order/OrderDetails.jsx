import React from 'react'

export default function OrderDetails() {
    return (
        <div className="orderdetail">
            <div className="od-header">
                <div className="od-header-row">
                    <div className="od-date">Date : 12-Jul-2021</div>
                    <div className="od-status">Status : Completed</div>
                </div>
                <div className="od-header-row">
                    <div className="od-itemcount">Total Items : 4</div>
                    <div className="od-amount">Total Amount 48</div>
                </div>
            </div>
            <div className="od-table">
                <table>
                    <thead>
                        <tr>
                            <td>Itme</td>
                            <td>Rate</td>
                            <td>Qty</td>
                            <td>Amount</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Item 1</td>
                            <td>12</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>Item 1</td>
                            <td>12</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>Item 1</td>
                            <td>12</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>Item 1</td>
                            <td>12</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>Item 1</td>
                            <td>12</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div >
    )
}
