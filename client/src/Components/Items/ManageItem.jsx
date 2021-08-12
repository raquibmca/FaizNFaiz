import React from 'react'
import ItemHeader from './ItemHeader';
import ItemResult from './ItemResult';
import CustomPanel from './../Common/Panel/CustomPanel';
import './manageitem.css';

export default function ManageItem() {
    return (
        <div className="item-main">
            <ItemHeader />
            <CustomPanel headingText={'Existing Items'} >
                <ItemResult />
            </CustomPanel>
        </div>
    )
}
