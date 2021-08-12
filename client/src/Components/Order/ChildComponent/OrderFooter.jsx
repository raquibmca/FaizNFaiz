import React from 'react'
import { formatter } from '../../../Utils/apputils'


export default function OrderFooter({ amount, orderCharges }) {
    const getPercentSign = (data) => {
        if (data.Operator === 'MUL')
            return `(${data.AppValue * 100}%)`
        return '';
    }

    const getValue = (data) => {
        if (!data.CalcValue)
            return data.Multiplier * 0;
        return data.CalcValue;
    }

    return (
        <div className="orderFooter">
            <div className="of-row">
                <div className="of-row-label">Amount</div>
                <div className="of-row-data">{formatter.format(amount)}</div>
            </div>
            {
                orderCharges && orderCharges.array && orderCharges.array.map(c => {
                    return <div className="of-row" key={`of-row${c.AppKey}`}>
                        <div className="of-row-label">{c.DisplayName}{getPercentSign(c)}</div>
                        <div className="of-row-data">{formatter.format(getValue(c))}</div>
                    </div>
                })
            }
            <div className="of-row">
                <div className="of-row-label">Net Amount</div>
                <div className="of-row-data">{formatter.format(orderCharges?.netamount)}</div>
            </div>
        </div>
    )
}
