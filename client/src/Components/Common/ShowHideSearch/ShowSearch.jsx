import React, { useState } from 'react'

export default function ShowSearch({ handleShowHideClick }) {
    const [isShow, setIsShow] = useState(false);

    return (
        <div style={{ fontSize: '40px', marginRight: '15px', color: 'black' }}>
            {!isShow && <i class="las la-chevron-circle-up" onClick={e => { setIsShow(true); handleShowHideClick(true) }}></i>}
            {isShow && <i class="las la-chevron-circle-down" onClick={e => { setIsShow(false); handleShowHideClick(false) }}></i>}
        </div>
    )
}
